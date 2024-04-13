import {Column, Entity, JoinColumn, OneToOne} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {CarContract} from './car-contract.entity'

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

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  over_limit_km: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: true})
  other_fee: number

  @ApiResponseProperty({type: String})
  @Column({type: 'text', nullable: true})
  other_fee_detail: string

  // relation
  @OneToOne(() => CarContract, carContract => carContract.contractFulfillment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'contract_id'})
  carContract: CarContract
}
