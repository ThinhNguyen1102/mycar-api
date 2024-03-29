export enum ContractTransactionType {
  PAYMENT = 'pay',
  CAR_CONTRACT_CREATE = 'createContract',
  REFUND_ADMIN_CANCEL = 'refund',
  REFUND_OWNER_REJECT = 'refundOwnerReject',
  REFUND_OWNER_CANCEL = 'refundOwnerCancel',
  REFUND_RENTAL_CANCEL = 'refundRentalCancel',
  CAR_CONTRACT_STARTED = 'startContract',
  CAR_CONTRACT_ENDED = 'endContract',
}
