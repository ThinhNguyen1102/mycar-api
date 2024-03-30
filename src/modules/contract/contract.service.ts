import {TransactionResponse} from '@ethersproject/abstract-provider'
import {Inject, Injectable} from '@nestjs/common'
import {BigNumber, ethers} from 'ethers'
import {CONTRACT_CONFIG_TOKEN, ContractConfig} from 'src/common/types/contract'
import {
  CarContractSM,
  CarContractCreatedEvent,
  PaymentReceivedEvent,
  PaymentTxInfomation,
  RefundedOwnerRejectedEvent,
  RefundedOwnerCanceledEvent,
  RefundedRenterCanceledEvent,
  CarContractRefundedEvent,
  CarContractStartedEvent,
  CarContractEndedEvent,
} from 'src/contract/types'
import {EndCarContractReq} from '../car-contract/dto/end-car-contract.req'
import {EventEmitter2} from '@nestjs/event-emitter'
import {LISTEN_EVENTS} from 'src/common/constants/event.const'

@Injectable()
export class ContractService {
  private contract: ethers.Contract
  private provider: ethers.providers.JsonRpcProvider
  private signer: ethers.Wallet
  private iface: ethers.utils.Interface
  private options: Record<string, any>

  constructor(
    @Inject(CONTRACT_CONFIG_TOKEN) contractConfig: ContractConfig,
    private eventEmitter: EventEmitter2,
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(contractConfig.rpc_provider_url)
    this.signer = new ethers.Wallet(contractConfig.signer_private_key, this.provider)
    this.contract = new ethers.Contract(
      contractConfig.constract_address,
      contractConfig.constract_abi,
      this.signer,
    )
    this.options = contractConfig.options
    this.iface = new ethers.utils.Interface(contractConfig.constract_abi)

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

  async refundOwnerCancel(contractId: number) {
    try {
      const tx = await this.contract.functions.refundOwnerCancel(contractId)

      return this._handleTransactionResponse(tx)
    } catch (e) {
      console.log(e)
    }
  }

  async refundRenterCancel(contractId: number) {
    try {
      const tx = await this.contract.functions.refundRenterCancel(contractId)

      return this._handleTransactionResponse(tx)
    } catch (e) {
      console.log(e)
    }
  }

  async refund(contractId: number) {
    try {
      const tx = await this.contract.functions.refund(contractId)

      return this._handleTransactionResponse(tx)
    } catch (e) {
      console.log(e)
    }
  }

  async startContract(contractId: number) {
    try {
      const tx = await this.contract.functions.startContract(contractId)

      return this._handleTransactionResponse(tx)
    } catch (e) {
      console.log(e)
    }
  }

  async endContract(contractId: number, surcharge: EndCarContractReq) {
    try {
      const tx = await this.contract.functions.endContract(
        contractId,
        surcharge.is_over_limit_fee,
        surcharge.over_time,
        surcharge.is_cleaning_fee,
        surcharge.is_deodorization_fee,
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

  async getTransactionInfo(txHash: string): Promise<PaymentTxInfomation> {
    try {
      const response = await this.provider.getTransaction(txHash)
      const block = await this.provider.getBlock(response.blockNumber)

      const rawData = this.iface.parseTransaction({data: response.data})

      return {
        hash: response.hash,
        from: response.from,
        to: response.to,
        value: this._toNumber(response.value),
        timestamp: block.timestamp,
        func: rawData.name,
        data: {
          contract_id: this._toNumber(rawData.args[0]),
          email: rawData.args[1],
          amount: this._toNumber(rawData.args[2]),
        },
      }
    } catch (e) {
      throw e
    }
  }

  private listentCarContractEvent() {
    this.contract.on(
      'PaymentReceived',
      async (contract_id, sender_email, amount, sender_address) => {
        const payload = new PaymentReceivedEvent()
        payload.amount = this._toNumber(amount)
        payload.contract_id = this._toNumber(contract_id)
        payload.sender_address = sender_address
        payload.sender_email = sender_email

        this.eventEmitter.emit(LISTEN_EVENTS.PAYMENT_RECEIVED, payload)
      },
    )

    this.contract.on(
      'CarContractCreated',
      async (contract_id, owner_address, owner_email, renter_address, renter_email) => {
        const payload = new CarContractCreatedEvent()
        payload.contract_id = this._toNumber(contract_id)
        payload.owner_address = owner_address
        payload.owner_email = owner_email
        payload.renter_address = renter_address
        payload.renter_email = renter_email

        this.eventEmitter.emit(LISTEN_EVENTS.CAR_CONTRACT_CREATED, payload)
      },
    )

    this.contract.on('CarContractRefundedOwnerRejected', (contract_id, renter_amount) => {
      const payload = new RefundedOwnerRejectedEvent()
      payload.contract_id = this._toNumber(contract_id)
      payload.renter_amount = this._toNumber(renter_amount)

      this.eventEmitter.emit(LISTEN_EVENTS.REFUNDED_OWNER_REJECTED, payload)
    })

    this.contract.on('CarContractRefundedOwnerCanceled', (contract_id, renter_amount) => {
      const payload = new RefundedOwnerCanceledEvent()
      payload.contract_id = this._toNumber(contract_id)
      payload.renter_amount = this._toNumber(renter_amount)

      this.eventEmitter.emit(LISTEN_EVENTS.REFUNDED_OWNER_CANCELED, payload)
    })

    this.contract.on(
      'CarContractRefundedRenterCanceled',
      (contract_id, renter_amount, owner_amount) => {
        const payload = new RefundedRenterCanceledEvent()
        payload.contract_id = this._toNumber(contract_id)
        payload.renter_amount = this._toNumber(renter_amount)
        payload.owner_amount = this._toNumber(owner_amount)

        this.eventEmitter.emit(LISTEN_EVENTS.REFUNDED_RENTER_CANCELED, payload)
      },
    )

    this.contract.on('CarContractRefunded', (contract_id, renter_amount, owner_amount) => {
      const payload = new CarContractRefundedEvent()
      payload.contract_id = this._toNumber(contract_id)
      payload.renter_amount = this._toNumber(renter_amount)
      payload.owner_amount = this._toNumber(owner_amount)

      this.eventEmitter.emit(LISTEN_EVENTS.REFUNDED_ADMIN_CANCEL, payload)
    })

    this.contract.on('CarContractStarted', contract_id => {
      const payload = new CarContractStartedEvent()
      payload.contract_id = this._toNumber(contract_id)

      this.eventEmitter.emit(LISTEN_EVENTS.CAR_CONTRACT_STARTED, payload)
    })

    this.contract.on('CarContractEnded', contract_id => {
      const payload = new CarContractEndedEvent()
      payload.contract_id = this._toNumber(contract_id)

      this.eventEmitter.emit(LISTEN_EVENTS.CAR_CONTRACT_ENDED, payload)
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
