import {TransactionResponse} from '@ethersproject/abstract-provider'
import {Inject, Injectable} from '@nestjs/common'
import {BigNumber, ethers} from 'ethers'
import {CarContractStatus} from 'src/common/enums/car-contract.enum'
import {ContractTransactionType} from 'src/common/enums/contract-tx-history.enum'
import {CONTRACT_CONFIG_TOKEN, ContractConfig} from 'src/common/types/contract'
import {CarContractSM} from 'src/contract/types'
import {CarContractRepository} from 'src/repositories/car-contract.repository'
import {ContractTxHistoryRepository} from 'src/repositories/contract-tx-history.repository'
import {UserRepository} from 'src/repositories/user.repository'

@Injectable()
export class ContractService {
  private contract: ethers.Contract
  private provider: ethers.providers.JsonRpcProvider
  private signer: ethers.Wallet
  private options: Record<string, any>

  constructor(
    @Inject(CONTRACT_CONFIG_TOKEN) contractConfig: ContractConfig,
    private readonly carContractRepository: CarContractRepository,
    private readonly userRepository: UserRepository,
    private readonly contractTxHistoryRepository: ContractTxHistoryRepository,
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(contractConfig.rpc_provider_url)
    this.signer = new ethers.Wallet(contractConfig.signer_private_key, this.provider)
    this.contract = new ethers.Contract(
      contractConfig.constract_address,
      contractConfig.constract_abi,
      this.signer,
    )
    this.options = contractConfig.options

    this.listentCarContractEvent()
  }

  async createCarContact(carContract: CarContractSM) {
    try {
      const tx = await this.contract.functions.createContract(
        carContract.contract_id,
        carContract.owner_email,
        carContract.owner_address,
        carContract.renter_email,
        carContract.renter_address,
        this._toWei(carContract.rental_price_per_day),
        this._toWei(carContract.over_limit_fee),
        this._toWei(carContract.over_time_fee),
        this._toWei(carContract.cleaning_fee),
        this._toWei(carContract.deodorization_fee),
        carContract.num_of_days,
        carContract.start_date.getTime(),
        carContract.end_date.getTime(),
        carContract.car_model,
        carContract.car_plate,
        {
          ...this.options,
        },
      )

      return this._handleTransactionResponse(tx)
    } catch (e) {
      console.log(e)
    }
  }

  async refundOwnerReject(contractId: number, renterAddress: string, amount: number) {
    try {
      const tx = await this.contract.functions.refundOwnerReject(
        contractId,
        renterAddress,
        this._toWei(amount),
      )

      return this._handleTransactionResponse(tx)
    } catch (e) {
      console.log(e)
    }
  }

  async getAllCarContract() {
    try {
      const response = await this.contract.functions.getCarContracts()

      return this.handleListContractResponse(response[0])
    } catch (e) {
      console.log(e)
    }
  }

  async getCarContractWithId(contractId: number) {
    try {
      const response = await this.contract.functions.getCarContractWithId(contractId)

      return this.handleListContractResponse(response)
    } catch (e) {
      console.log(e)
    }
  }

  private listentCarContractEvent() {
    this.contract.on(
      'PaymentReceived',
      async (contract_id, sender_email, amount, sender_address) => {
        contract_id = this._toNumber(contract_id)
        amount = this._toNumber(amount)
        console.log('PaymentReceived')
        console.log('contract_id:::', contract_id)
        console.log('sender_email:::', sender_email)
        console.log('amount:::', amount)
        console.log('sender_address:::', sender_address)

        this.handlePaymentReceivedEvent(contract_id, sender_email, sender_address, amount)
      },
    )

    this.contract.on(
      'CarContractCreated',
      async (contract_id, owner_address, owner_email, renter_address, renter_email) => {
        console.log('ContractCreated')
        console.log('contract_id:::', contract_id)
        console.log('owner_address:::', owner_address)
        console.log('owner_email:::', owner_email)
        console.log('renter_address:::', renter_address)
        console.log('renter_email:::', renter_email)
        await this.handleCarContractSMCreated(this._toNumber(contract_id))
      },
    )

    this.contract.on('CarContractRefundedOwnerRejected', (contract_id, renter_amount) => {
      console.log('CarContractRefundedOwnerRejected')
      console.log('contract_id:::', contract_id)
      console.log('renter_amount:::', this._toNumber(renter_amount))
    })

    this.contract.on('CarContractRefundedOwnerCanceled', (contract_id, renter_amount) => {
      console.log('CarContractRefundedOwnerCanceled')
      console.log('contract_id:::', contract_id)
      console.log('renter_amount:::', renter_amount)
    })

    this.contract.on(
      'CarContractRefundedRenterCanceled',
      (contract_id, renter_amount, owner_amount) => {
        console.log('CarContractRefundedRenterCanceled')
        console.log('contract_id:::', contract_id)
        console.log('renter_amount:::', this._toNumber(renter_amount))
        console.log('owner_amount:::', this._toNumber(owner_amount))
      },
    )

    this.contract.on('CarContractRefunded', (contract_id, renter_amount, owner_amount) => {
      console.log('CarContractRefunded')
      console.log('contract_id:::', contract_id)
      console.log('renter_amount:::', this._toNumber(renter_amount))
      console.log('owner_amount:::', this._toNumber(owner_amount))
    })

    this.contract.on('CarContractStarted', contract_id => {
      console.log('CarContractStarted')
      console.log('contract_id:::', contract_id)
    })

    this.contract.on('CarContractEnded', contract_id => {
      console.log('CarContractEnded')
      console.log('contract_id:::', contract_id)
    })
  }

  private async handleCarContractSMCreated(contractId: number) {
    const carContract = await this.carContractRepository.findOne({
      where: {
        id: contractId,
      },
    })

    carContract.contract_status = CarContractStatus.APPROVED

    await this.carContractRepository.save(carContract)

    // send message to frontend
  }

  private async handlePaymentReceivedEvent(
    contractId: number,
    senderEmail: string,
    senderAddress: string,
    amount: number,
  ) {
    let validPayment = true
    let isOwnerPayment = false

    const user = await this.userRepository.findOne({where: {email: senderEmail}})
    if (!user) {
      console.log("PaymentReceived::: user doesn't exist")
      validPayment = false
    }

    const carContract = await this.carContractRepository.findOne({
      where: {id: contractId},
      relations: {
        owner: true,
        renter: true,
        carRentalPost: true,
      },
    })

    if (!carContract) {
      console.log("PaymentReceived::: Car contract doesn't exist")
      validPayment = false
    }

    const {
      contract_status,
      renter_id,
      owner_id,
      renter_wallet_address,
      owner_wallet_address,
      mortgage,
      price_per_day,
      num_of_days,
    } = carContract
    console.log('PaymentReceived::: contract_status:::', contract_status)

    if (contract_status !== CarContractStatus.WAITING_APPROVAL) {
      console.log('PaymentReceived::: invalid contract status')
      validPayment = false
    }

    if (renter_id !== user.id && owner_id !== user.id) {
      console.log('PaymentReceived::: invalid user')
      validPayment = false
    }

    if (owner_id === user.id) {
      isOwnerPayment = true
    }

    if (isOwnerPayment) {
      const ownerAmount = price_per_day * num_of_days * 0.25
      if (amount !== ownerAmount) {
        console.log('PaymentReceived::: invalid amount')
        validPayment = false
      } else if (renter_wallet_address && renter_wallet_address === senderAddress) {
        console.log('PaymentReceived::: invalid renter address')
        validPayment = false
      } else {
        carContract.owner_wallet_address = senderAddress
      }
    } else {
      const renterAmount = price_per_day * num_of_days + mortgage

      if (amount !== renterAmount) {
        console.log('PaymentReceived::: invalid amount')
        validPayment = false
      } else if (owner_wallet_address && owner_wallet_address === senderAddress) {
        console.log('PaymentReceived::: invalid renter address')
        validPayment = false
      } else {
        carContract.renter_wallet_address = senderAddress
      }
    }

    if (validPayment) {
      const isCompletedPayment =
        carContract.owner_wallet_address && carContract.renter_wallet_address
      if (isCompletedPayment) {
        const carContractSm: CarContractSM = {
          contract_id: carContract.id,
          owner_address: carContract.owner_wallet_address,
          owner_email: carContract.owner.email,
          renter_address: carContract.renter_wallet_address,
          renter_email: carContract.renter.email,
          rental_price_per_day: carContract.price_per_day,
          mortgage: carContract.mortgage,
          over_limit_fee: carContract.over_limit_fee,
          over_time_fee: carContract.over_time_fee,
          cleaning_fee: carContract.cleaning_fee,
          deodorization_fee: carContract.deodorization_fee,
          num_of_days: carContract.num_of_days,
          start_date: carContract.start_date,
          end_date: carContract.end_date,
          car_model: carContract.carRentalPost.model,
          car_plate: carContract.carRentalPost.license_plate,
          status: carContract.contract_status,
          created_at: carContract.created_at,
        }

        const response = await this.createCarContact(carContractSm)

        if (response) {
          await this.contractTxHistoryRepository.save({
            contract_id: carContract.id,
            tx_hash: response.transactionHash,
            tx_type: ContractTransactionType.CAR_CONTRACT_CREATE,
          })
        }
      }

      await this.carContractRepository.save(carContract)
      // send message to frontend
    } else {
      // send message to frontend
    }
  }

  private handleListContractResponse(response: any[]): CarContractSM[] {
    return response.map(r => {
      return this.handleContractResponse(r)
    })
  }

  private handleContractResponse(response: any[]): CarContractSM {
    const carContractSm: CarContractSM = {
      contract_id: this._toNumber(response[0]),
      owner_address: response[1],
      owner_email: response[2],
      renter_address: response[3],
      renter_email: response[4],
      rental_price_per_day: this._toEther(response[5]),
      mortgage: this._toEther(response[6]),
      over_limit_fee: this._toEther(response[7]),
      over_time_fee: this._toEther(response[8]),
      cleaning_fee: this._toEther(response[9]),
      deodorization_fee: this._toEther(response[10]),
      num_of_days: this._toNumber(response[11]),
      start_date: new Date(this._toNumber(response[12])),
      end_date: new Date(this._toNumber(response[13])),
      car_model: response[14],
      car_plate: response[15],
      status: response[16],
      created_at: new Date(this._toNumber(response[17]) * 1000),
    }

    return carContractSm
  }

  private _handleTransactionResponse = async (tx: TransactionResponse) => {
    const recept = await tx.wait()
    return recept
  }

  _numberToEth = (amount: number) => {
    return ethers.utils.parseEther(amount.toString())
  }

  _toNumber = (bigNumber: BigNumber) => {
    try {
      return bigNumber.toNumber()
    } catch (er) {
      return Number.parseFloat(ethers.utils.formatEther(bigNumber))
    }
  }

  _toEther = (bigNumber: BigNumber) => {
    return Number.parseFloat(ethers.utils.formatEther(bigNumber))
  }

  _toWei = (amount: number) => {
    return ethers.utils.parseUnits(amount.toString())
  }
}
