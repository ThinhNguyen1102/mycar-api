export enum ContractTransactionType {
  PAYMENT = 'payment',
  CAR_CONTRACT_CREATE = 'car_contract_create',
  REFUND_OWNER_REJECT = 'refund_owner_reject',
  REFUND_OWNER_CANCEL = 'refund_owner_cancel',
  REFUND_RENTAL_CANCEL = 'CANCEL',
  CAR_CONTRACT_STARTED = 'REFUND',
  CAR_CONTRACT_ENDED = 'OVERDUE',
}
