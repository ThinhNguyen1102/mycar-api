import {CarContractStatus} from 'src/common/enums/car-contract.enum'
import {Numbers} from 'web3'

export type CarContractSM = {
  contract_id: number
  owner_email: string
  owner_address: string
  renter_email: string
  renter_address: string
  rental_price_per_day: number
  mortgage: number
  over_limit_fee: number
  over_time_fee: number
  cleaning_fee: number
  deodorization_fee: number
  num_of_days: number
  start_date: Date
  end_date: Date
  car_model: string
  car_plate: string
  status: CarContractStatus
  created_at: Date
}

export type PaymentResData = {
  contract_id: number
  email: string
  amount: number
}

export type PaymentTxInfomation = {
  hash: string
  from: string
  to: string
  value: number
  timestamp: number
  data: PaymentResData
  func: string
}

export class PaymentReceivedEvent {
  contract_id: number
  sender_email: string
  amount: number
  sender_address: string
}

export class CarContractCreatedEvent {
  contract_id: number
  owner_address: string
  owner_email: string
  renter_address: string
  renter_email: string
}

export class RefundedOwnerRejectedEvent {
  contract_id: number
  renter_amount: number
}

export class RefundedOwnerCanceledEvent {
  contract_id: number
  renter_amount: number
}

export class RefundedRenterCanceledEvent {
  contract_id: number
  renter_amount: number
  owner_amount: number
}

export class CarContractRefundedEvent {
  contract_id: number
  renter_amount: number
  owner_amount: number
}

export class CarContractStartedEvent {
  contract_id: Numbers
}

export class CarContractEndedEvent {
  contract_id: Numbers
}
