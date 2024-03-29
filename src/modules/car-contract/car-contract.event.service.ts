import {Injectable} from '@nestjs/common'
import {OnEvent} from '@nestjs/event-emitter'
import {CarContractStatus} from 'src/common/enums/car-contract.enum'
import {
  CarContractCreatedEvent,
  CarContractEndedEvent,
  CarContractRefundedEvent,
  CarContractSM,
  CarContractStartedEvent,
  PaymentReceivedEvent,
  RefundedOwnerCanceledEvent,
  RefundedOwnerRejectedEvent,
  RefundedRenterCanceledEvent,
} from 'src/contract/types'
import {CarContractRepository} from 'src/repositories/car-contract.repository'
import {ContractTxHistoryRepository} from 'src/repositories/contract-tx-history.repository'
import {ContractService} from '../contract/contract.service'
import {ContractTransactionType} from 'src/common/enums/contract-tx-history.enum'
import {LISTEN_EVENTS} from 'src/common/constants/event.const'

@Injectable()
export class CarContractEventService {
  constructor(
    private readonly carContractRepository: CarContractRepository,
    private readonly contractService: ContractService,
    private readonly contractTxHistoryRepository: ContractTxHistoryRepository,
  ) {}

  @OnEvent('call::create_contract')
  async handleSaveTxEvent(contract: CarContractSM) {
    const txResponse = await this.contractService.createCarContact(contract)

    await this.contractTxHistoryRepository.save({
      contract_id: contract.contract_id,
      tx_hash: txResponse.transactionHash,
      tx_type: ContractTransactionType.CAR_CONTRACT_CREATE,
    })
  }

  @OnEvent(LISTEN_EVENTS.PAYMENT_RECEIVED)
  async handlePaymentReceivedEvent(event: PaymentReceivedEvent) {
    console.log('PaymentReceivedEvent', event)
  }

  @OnEvent(LISTEN_EVENTS.CAR_CONTRACT_CREATED)
  async handleCarContractCreatedEvent(event: CarContractCreatedEvent) {
    console.log('CarContractCreatedEvent', event)

    await this.carContractRepository.update(
      {
        id: event.contract_id,
      },
      {
        contract_status: CarContractStatus.APPROVED,
      },
    )
  }

  @OnEvent(LISTEN_EVENTS.REFUNDED_OWNER_REJECTED)
  async handleRefundedOwnerRejectedEvent(event: RefundedOwnerRejectedEvent) {
    console.log('RefundedOwnerRejectedEvent', event)
  }

  @OnEvent(LISTEN_EVENTS.REFUNDED_OWNER_CANCELED)
  async handleRefundedOwnerCanceledEvent(event: RefundedOwnerCanceledEvent) {
    console.log('RefundedOwnerCanceledEvent', event)
  }

  @OnEvent(LISTEN_EVENTS.REFUNDED_RENTER_CANCELED)
  async handleRefundedRenterCanceledEvent(event: RefundedRenterCanceledEvent) {
    console.log('RefundedRenterCanceledEvent', event)
  }

  @OnEvent(LISTEN_EVENTS.REFUNDED_ADMIN_CANCEL)
  async handleCarContractRefundedEvent(event: CarContractRefundedEvent) {
    console.log('CarContractRefundedEvent', event)
  }

  @OnEvent(LISTEN_EVENTS.CAR_CONTRACT_STARTED)
  async handleCarContractStartedEvent(event: CarContractStartedEvent) {
    console.log('CarContractStartedEvent', event)
  }

  @OnEvent(LISTEN_EVENTS.CAR_CONTRACT_ENDED)
  async handleCarContractEndedEvent(event: CarContractEndedEvent) {
    console.log('CarContractEndedEvent', event)
  }
}
