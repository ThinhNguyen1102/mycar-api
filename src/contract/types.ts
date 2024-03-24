import {CarContractStatus} from 'src/common/enums/car-contract.enum'

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
