import {Column, Entity} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {CarContractStatus} from 'src/common/enums/car-contract.enum'

@Entity({name: 'car_contracts'})
export class CarContract extends CommonEntity {
  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  renter_id: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  owner_id: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  post_id: number

  @ApiResponseProperty({type: CarContractStatus})
  @Column({type: 'enum', enum: CarContractStatus, nullable: false})
  contract_status: CarContractStatus

  @ApiResponseProperty({type: Date})
  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  start_date: Date

  @ApiResponseProperty({type: Date})
  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  end_date: Date

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  renter_wallet_address: string

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  owner_wallet_address: string

  @ApiResponseProperty({type: String})
  @Column({type: 'text', nullable: false})
  car_info_snapshot: string

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  price_per_day: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  mortgage: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  over_limit_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  over_time_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  cleaning_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  deodorization_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  num_of_days: number
}
