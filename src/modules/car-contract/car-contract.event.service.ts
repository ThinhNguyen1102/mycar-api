import {Injectable} from '@nestjs/common'
import {OnEvent} from '@nestjs/event-emitter'
import {CarContractStatus} from 'src/common/enums/car-contract.enum'
import {
  CarContractCreatedEvent,
  CarContractEndedEvent,
  CarContractRefundedEvent,
  CarContractSM,
  CarContractStartedEvent,
  EndCarContractParam,
  PaymentReceivedEvent,
  RefundAdminCancelParam,
  RefundedOwnerCanceledEvent,
  RefundedOwnerRejectedEvent,
  RefundedRenterCanceledEvent,
  RefundOwnerCancelParam,
  RefundOwnerRejectParam,
  RefundRenterCancelParam,
  StartCarContractParam,
} from 'src/contract/types'
import {CarContractRepository} from 'src/repositories/car-contract.repository'
import {ContractTxHistoryRepository} from 'src/repositories/contract-tx-history.repository'
import {ContractService} from '../contract/contract.service'
import {ContractTransactionType} from 'src/common/enums/contract-tx-history.enum'
import {CALL_EVENTS, LISTEN_EVENTS} from 'src/common/constants/event.const'
import {ContractFulfillmentRepository} from 'src/repositories/contract-fulfillment.repository'
import {PusherService} from '../pusher/pusher.service'

@Injectable()
export class CarContractEventService {
  constructor(
    private readonly carContractRepository: CarContractRepository,
    private readonly contractService: ContractService,
    private readonly contractTxHistoryRepository: ContractTxHistoryRepository,
    private readonly contractFulfillmentRepository: ContractFulfillmentRepository,
    private readonly pusherService: PusherService,
  ) {}

  @OnEvent(CALL_EVENTS.REFUND_OWNER_REJECTED)
  async handleCallRefundOwnerReject({contract_id, renter_address, amount}: RefundOwnerRejectParam) {
    const txResponse = await this.contractService.refundOwnerReject(
      contract_id,
      renter_address,
      amount,
    )

    await this.carContractRepository.update(
      {
        id: contract_id,
      },
      {contract_status: CarContractStatus.REJECTED, is_processing: false},
    )

    const tx = await this.contractTxHistoryRepository.save({
      contract_id: contract_id,
      tx_hash: txResponse.transactionHash,
      tx_type: ContractTransactionType.REFUND_OWNER_REJECT,
      tx_value: 0,
    })

    if (tx) {
      this.pusherService.trigger(`car-contract-${contract_id}`, 'car-contract::update', {
        type: CALL_EVENTS.REFUND_OWNER_REJECTED,
        contract_id: contract_id,
        tx: {
          id: tx.id,
          tx_hash: tx.tx_hash,
          tx_type: tx.tx_type,
          tx_value: tx.tx_value,
          created_at: tx.created_at,
        },
      })
    }
  }

  @OnEvent(CALL_EVENTS.REFUND_OWNER_CANCELED)
  async handleCallRefundOwnerCanceled({contract_id}: RefundOwnerCancelParam) {
    const txResponse = await this.contractService.refundOwnerCancel(contract_id)

    await this.carContractRepository.update(
      {
        id: contract_id,
      },
      {contract_status: CarContractStatus.CANCELED, is_processing: false},
    )

    const tx = await this.contractTxHistoryRepository.save({
      contract_id: contract_id,
      tx_hash: txResponse.transactionHash,
      tx_type: ContractTransactionType.REFUND_OWNER_CANCEL,
      tx_value: 0,
    })

    if (tx) {
      this.pusherService.trigger(`car-contract-${contract_id}`, 'car-contract::update', {
        type: CALL_EVENTS.REFUND_OWNER_CANCELED,
        contract_id: contract_id,
        tx: {
          id: tx.id,
          tx_hash: tx.tx_hash,
          tx_type: tx.tx_type,
          tx_value: tx.tx_value,
          created_at: tx.created_at,
        },
      })
    }
  }

  @OnEvent(CALL_EVENTS.REFUND_RENTER_CANCELED)
  async handleCallRefundRenterCanceled({contract_id}: RefundRenterCancelParam) {
    const txResponse = await this.contractService.refundRenterCancel(contract_id)

    await this.carContractRepository.update(
      {
        id: contract_id,
      },
      {contract_status: CarContractStatus.CANCELED, is_processing: false},
    )

    const tx = await this.contractTxHistoryRepository.save({
      contract_id: contract_id,
      tx_hash: txResponse.transactionHash,
      tx_type: ContractTransactionType.REFUND_RENTAL_CANCEL,
      tx_value: 0,
    })

    if (tx) {
      this.pusherService.trigger(`car-contract-${contract_id}`, 'car-contract::update', {
        type: CALL_EVENTS.REFUND_RENTER_CANCELED,
        contract_id: contract_id,
        tx: {
          id: tx.id,
          tx_hash: tx.tx_hash,
          tx_type: tx.tx_type,
          tx_value: tx.tx_value,
          created_at: tx.created_at,
        },
      })
    }
  }

  @OnEvent(CALL_EVENTS.REFUND_ADMIN_CANCEL)
  async handleCallRefundAdminCancel({contract_id}: RefundAdminCancelParam) {
    const txResponse = await this.contractService.refund(contract_id)

    await this.carContractRepository.update(
      {
        id: contract_id,
      },
      {contract_status: CarContractStatus.CANCELED, is_processing: false},
    )

    const tx = await this.contractTxHistoryRepository.save({
      contract_id: contract_id,
      tx_hash: txResponse.transactionHash,
      tx_type: ContractTransactionType.REFUND_ADMIN_CANCEL,
      tx_value: 0,
    })

    if (tx) {
      this.pusherService.trigger(`car-contract-${contract_id}`, 'car-contract::update', {
        type: CALL_EVENTS.REFUND_ADMIN_CANCEL,
        contract_id: contract_id,
        tx: {
          id: tx.id,
          tx_hash: tx.tx_hash,
          tx_type: tx.tx_type,
          tx_value: tx.tx_value,
          created_at: tx.created_at,
        },
      })
    }
  }

  @OnEvent(CALL_EVENTS.START_CAR_CONTRACT)
  async handleCallStartContract({contract_id}: StartCarContractParam) {
    const txResponse = await this.contractService.startContract(contract_id)

    await this.carContractRepository.update(
      {
        id: contract_id,
      },
      {contract_status: CarContractStatus.STARTED, is_processing: false},
    )

    const tx = await this.contractTxHistoryRepository.save({
      contract_id: contract_id,
      tx_hash: txResponse.transactionHash,
      tx_type: ContractTransactionType.CAR_CONTRACT_STARTED,
      tx_value: 0,
    })

    if (tx) {
      this.pusherService.trigger(`car-contract-${contract_id}`, 'car-contract::update', {
        type: CALL_EVENTS.START_CAR_CONTRACT,
        contract_id: contract_id,
        tx: {
          id: tx.id,
          tx_hash: tx.tx_hash,
          tx_type: tx.tx_type,
          tx_value: tx.tx_value,
          created_at: tx.created_at,
        },
      })
    }
  }

  @OnEvent(CALL_EVENTS.END_CAR_CONTRACT)
  async handleCallEndContract({contract_id, surcharge}: EndCarContractParam) {
    const txResponse = await this.contractService.endContract(contract_id, surcharge)

    await this.carContractRepository.update(
      {
        id: contract_id,
      },
      {contract_status: CarContractStatus.ENDED, is_processing: false},
    )

    await this.contractFulfillmentRepository.save({
      contract_id: contract_id,
      has_cleaning_fee: surcharge.is_cleaning_fee,
      has_deodorization_fee: surcharge.is_deodorization_fee,
      has_over_limit_fee: surcharge.over_limit_km > 0,
      over_limit_km: surcharge.over_limit_km,
      has_over_time_fee: surcharge.over_time_hours > 0,
      over_time_hours: surcharge.over_time_hours,
    })

    const tx = await this.contractTxHistoryRepository.save({
      contract_id: contract_id,
      tx_hash: txResponse.transactionHash,
      tx_type: ContractTransactionType.CAR_CONTRACT_ENDED,
      tx_value: 0,
    })

    if (tx) {
      this.pusherService.trigger(`car-contract-${contract_id}`, 'car-contract::update', {
        type: CALL_EVENTS.END_CAR_CONTRACT,
        contract_id: contract_id,
        tx: {
          id: tx.id,
          tx_hash: tx.tx_hash,
          tx_type: tx.tx_type,
          tx_value: tx.tx_value,
          created_at: tx.created_at,
        },
      })
    }
  }

  @OnEvent(CALL_EVENTS.CREATE_CAR_CONTRACT)
  async handleCallCreateContract(contract: CarContractSM) {
    const txResponse = await this.contractService.createCarContact(contract)

    const tx = await this.contractTxHistoryRepository.save({
      contract_id: contract.contract_id,
      tx_hash: txResponse.transactionHash,
      tx_type: ContractTransactionType.CAR_CONTRACT_CREATE,
      tx_value: 0,
    })

    await this.carContractRepository.update(
      {
        id: contract.contract_id,
      },
      {
        contract_status: CarContractStatus.APPROVED,
        is_processing: false,
      },
    )

    if (tx) {
      this.pusherService.trigger(`car-contract-${contract.contract_id}`, 'car-contract::update', {
        type: CALL_EVENTS.CREATE_CAR_CONTRACT,
        contract_id: contract.contract_id,
        tx: {
          id: tx.id,
          tx_hash: tx.tx_hash,
          tx_type: tx.tx_type,
          tx_value: tx.tx_value,
          created_at: tx.created_at,
        },
      })
    }
  }

  @OnEvent(LISTEN_EVENTS.PAYMENT_RECEIVED)
  async handlePaymentReceivedEvent(event: PaymentReceivedEvent) {
    console.log('PaymentReceivedEvent', event)
  }

  @OnEvent(LISTEN_EVENTS.CAR_CONTRACT_CREATED)
  async handleCarContractCreatedEvent(event: CarContractCreatedEvent) {
    console.log('CarContractCreatedEvent', event)
    // this.pusherService.trigger(`car-contract-${event.contract_id}`, 'car-contract::update', {
    //   type: CALL_EVENTS.CREATE_CAR_CONTRACT,
    //   contract_id: event.contract_id,
    // })
  }

  @OnEvent(LISTEN_EVENTS.REFUNDED_OWNER_REJECTED)
  async handleRefundedOwnerRejectedEvent(event: RefundedOwnerRejectedEvent) {
    console.log('RefundedOwnerRejectedEvent', event)
    // this.pusherService.trigger(`car-contract-${event.contract_id}`, 'car-contract::update', {
    //   type: CALL_EVENTS.REFUND_OWNER_REJECTED,
    //   contract_id: event.contract_id,
    // })
  }

  @OnEvent(LISTEN_EVENTS.REFUNDED_OWNER_CANCELED)
  async handleRefundedOwnerCanceledEvent(event: RefundedOwnerCanceledEvent) {
    console.log('RefundedOwnerCanceledEvent', event)
    // this.pusherService.trigger(`car-contract-${event.contract_id}`, 'car-contract::update', {
    //   type: CALL_EVENTS.REFUND_OWNER_CANCELED,
    //   contract_id: event.contract_id,
    // })
  }

  @OnEvent(LISTEN_EVENTS.REFUNDED_RENTER_CANCELED)
  async handleRefundedRenterCanceledEvent(event: RefundedRenterCanceledEvent) {
    console.log('RefundedRenterCanceledEvent', event)
    // this.pusherService.trigger(`car-contract-${event.contract_id}`, 'car-contract::update', {
    //   type: CALL_EVENTS.REFUND_RENTER_CANCELED,
    //   contract_id: event.contract_id,
    // })
  }

  @OnEvent(LISTEN_EVENTS.REFUNDED_ADMIN_CANCEL)
  async handleCarContractRefundedEvent(event: CarContractRefundedEvent) {
    console.log('CarContractRefundedEvent', event)
    // this.pusherService.trigger(`car-contract-${event.contract_id}`, 'car-contract::update', {
    //   type: CALL_EVENTS.REFUND_ADMIN_CANCEL,
    //   contract_id: event.contract_id,
    // })
  }

  @OnEvent(LISTEN_EVENTS.CAR_CONTRACT_STARTED)
  async handleCarContractStartedEvent(event: CarContractStartedEvent) {
    console.log('CarContractStartedEvent', event)
    // this.pusherService.trigger(`car-contract-${event.contract_id}`, 'car-contract::update', {
    //   type: CALL_EVENTS.START_CAR_CONTRACT,
    //   contract_id: event.contract_id,
    // })
  }

  @OnEvent(LISTEN_EVENTS.CAR_CONTRACT_ENDED)
  async handleCarContractEndedEvent(event: CarContractEndedEvent) {
    console.log('CarContractEndedEvent', event)
    // this.pusherService.trigger(`car-contract-${event.contract_id}`, 'car-contract::update', {
    //   type: CALL_EVENTS.END_CAR_CONTRACT,
    //   contract_id: event.contract_id,
    // })
  }
}
