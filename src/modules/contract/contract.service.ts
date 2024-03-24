import {TransactionResponse} from '@ethersproject/abstract-provider'
import {Inject, Injectable} from '@nestjs/common'
import {BigNumber, ethers} from 'ethers'
import {CarContractStatus} from 'src/common/enums/car-contract.enum'
import {CONTRACT_CONFIG_TOKEN, ContractConfig} from 'src/common/types/contract'
import {CarContractSM} from 'src/contract/types'
import {CarContractRepository} from 'src/repositories/car-contract.repository'
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
    private readonly userRepositoy: UserRepository,
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

  listentCarContractEvent() {
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

        let invalidPayment = true
        let isOwnerPayment = false

        const user = await this.userRepositoy.findOne({where: {email: sender_email}})
        if (!user) {
          console.log("PaymentReceived::: user doesn't exist")
          invalidPayment = false
        }

        const carContract = await this.carContractRepository.findOne({where: {id: contract_id}})
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

        if (!carContract) {
          console.log("PaymentReceived::: Car contract doesn't exist")
          invalidPayment = false
        }

        if (contract_status !== CarContractStatus.WAITING_APPROVAL) {
          console.log('PaymentReceived::: invalid contract status')
          invalidPayment = false
        }

        if (renter_id !== user.id && owner_id !== user.id) {
          console.log('PaymentReceived::: invalid user')
          invalidPayment = false
        }

        if (owner_id === user.id) {
          isOwnerPayment = true
        }

        if (isOwnerPayment) {
          const ownerAmount = price_per_day * num_of_days * 0.25
          if (amount !== ownerAmount) {
            console.log('PaymentReceived::: invalid amount')
            invalidPayment = false
          } else if (renter_wallet_address && renter_wallet_address === sender_address) {
            console.log('PaymentReceived::: invalid renter address')
            invalidPayment = false
          } else {
            carContract.owner_wallet_address = sender_address
          }
        } else {
          const renterAmount = price_per_day * num_of_days + mortgage

          if (amount !== renterAmount) {
            console.log('PaymentReceived::: invalid amount')
            invalidPayment = false
          } else if (owner_wallet_address && owner_wallet_address === sender_address) {
            console.log('PaymentReceived::: invalid renter address')
            invalidPayment = false
          }
          {
            carContract.renter_wallet_address = sender_address
          }
        }

        if (invalidPayment) {
          const isCompletedPayment =
            carContract.owner_wallet_address && carContract.renter_wallet_address
          if (isCompletedPayment) {
            carContract.contract_status = CarContractStatus.APPROVED
          }

          await this.carContractRepository.save(carContract)
          // send message to frontend
        } else {
          // send message to frontend
        }
      },
    )

    this.contract.on(
      'CarContractCreated',
      (contract_id, owner_address, owner_email, renter_address, renter_email) => {
        console.log('ContractCreated')
        console.log('contract_id:::', contract_id)
        console.log('owner_address:::', owner_address)
        console.log('owner_email:::', owner_email)
        console.log('renter_address:::', renter_address)
        console.log('renter_email:::', renter_email)
      },
    )

    this.contract.on('CarContractRefundedOwnerRejected', (contract_id, renter_amount) => {
      console.log('CarContractRefundedOwnerRejected')
      console.log('contract_id:::', contract_id)
      console.log('renter_amount:::', renter_amount)
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
