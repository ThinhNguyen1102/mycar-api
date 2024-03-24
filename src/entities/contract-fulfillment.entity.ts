import {Column, Entity} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'

@Entity({name: 'contract_fulfillments'})
export class ContractFulfillment extends CommonEntity {
  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  contract_id: number

  @ApiResponseProperty({type: Boolean})
  @Column({type: Boolean, nullable: false})
  has_over_limit_fee: boolean

  @ApiResponseProperty({type: Boolean})
  @Column({type: Boolean, nullable: false})
  has_over_time_fee: boolean

  @ApiResponseProperty({type: Boolean})
  @Column({type: Boolean, nullable: false})
  has_cleaning_fee: boolean

  @ApiResponseProperty({type: Boolean})
  @Column({type: Boolean, nullable: false})
  has_deodorization_fee: boolean

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  over_time_hours: number
}
