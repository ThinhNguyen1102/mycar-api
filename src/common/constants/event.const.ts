export const LISTEN_EVENTS = {
  PAYMENT_RECEIVED: 'event::PaymentReceived',
  CAR_CONTRACT_CREATED: 'event::CarContractCreated',
  REFUNDED_OWNER_REJECTED: 'event::CarContractRefundedOwnerRejected',
  REFUNDED_OWNER_CANCELED: 'event::CarContractRefundedOwnerCanceled',
  REFUNDED_RENTER_CANCELED: 'event::CarContractRefundedRenterCanceled',
  REFUNDED_ADMIN_CANCEL: 'event::CarContractRefunded',
  CAR_CONTRACT_STARTED: 'event::CarContractStarted',
  CAR_CONTRACT_ENDED: 'event::CarContractStarted',
}

export const CALL_EVENTS = {
  CAR_CONTRACT_CREATED: 'call::create_car_contract',
  REFUNDED_OWNER_REJECTED: 'call::refund_owner_rejected',
  REFUNDED_OWNER_CANCELED: 'call::refund_owner_canceled',
  REFUNDED_RENTER_CANCELED: 'call::refund_renter_canceled',
  REFUNDED_ADMIN_CANCEL: 'call::refund_admin_cancel',
  CAR_CONTRACT_STARTED: 'call::start_contract',
  CAR_CONTRACT_ENDED: 'call::end_contract',
}
