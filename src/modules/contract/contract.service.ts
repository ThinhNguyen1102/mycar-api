import {TransactionResponse} from '@ethersproject/abstract-provider'
import {Inject, Injectable} from '@nestjs/common'
import {BigNumber, ethers} from 'ethers'
import {CONTRACT_CONFIG_TOKEN, ContractConfig} from 'src/common/types/contract'
import {CarContractSM} from 'src/contract/types'

@Injectable()
export class ContractService {
  private contract: ethers.Contract
  private provider: ethers.providers.JsonRpcProvider
  private signer: ethers.Wallet
  private options: Record<string, any>

  constructor(@Inject(CONTRACT_CONFIG_TOKEN) contractConfig: ContractConfig) {
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
    this.contract.on('PaymentReceived', (contract_id, sender_email, amount, sender_address) => {
      console.log('PaymentReceived')
      console.log('contract_id:::', contract_id)
      console.log('sender_email:::', sender_email)
      console.log('amount:::', amount)
      console.log('sender_address:::', sender_address)
    })

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
