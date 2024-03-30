export const LISTEN_EVENTS = {
  PAYMENT_RECEIVED: 'event::PaymentReceived',
  CAR_CONTRACT_CREATED: 'event::CarContractCreated',
  REFUNDED_OWNER_REJECTED: 'event::CarContractRefundedOwnerRejected',
  REFUNDED_OWNER_CANCELED: 'event::CarContractRefundedOwnerCanceled',
  REFUNDED_RENTER_CANCELED: 'event::CarContractRefundedRenterCanceled',
  REFUNDED_ADMIN_CANCEL: 'event::CarContractRefunded',
  CAR_CONTRACT_STARTED: 'event::CarContractStarted',
  CAR_CONTRACT_ENDED: 'event::CarContractEnded',
}

export const CALL_EVENTS = {
  CREATE_CAR_CONTRACT: 'call::create_car_contract',
  REFUND_OWNER_REJECTED: 'call::refund_owner_rejected',
  REFUND_OWNER_CANCELED: 'call::refund_owner_canceled',
  REFUND_RENTER_CANCELED: 'call::refund_renter_canceled',
  REFUND_ADMIN_CANCEL: 'call::refund_admin_cancel',
  START_CAR_CONTRACT: 'call::start_contract',
  END_CAR_CONTRACT: 'call::end_contract',
}
