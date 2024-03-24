import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {CarContractStatus} from 'src/common/enums/car-contract.enum'
import {CarRentalPost} from './car-rental-post.entity'
import {Review} from './review.entity'
import {ContractFulfillment} from './contract-fulfillment.entity'
import {ContractTxHistory} from './contract-tx-history.entity'
import {User} from './user.entity'

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
  @Column({type: String, nullable: true})
  renter_wallet_address: string

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: true})
  owner_wallet_address: string

  @ApiResponseProperty({type: String})
  @Column({type: 'text', nullable: false})
  car_info_snapshot: string

  @ApiResponseProperty({type: Number})
  @Column({type: 'double precision', nullable: false})
  price_per_day: number

  @ApiResponseProperty({type: Number})
  @Column({type: 'double precision', nullable: false})
  mortgage: number

  @ApiResponseProperty({type: Number})
  @Column({type: 'double precision', nullable: false})
  over_limit_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: 'double precision', nullable: false})
  over_time_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: 'double precision', nullable: false})
  cleaning_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: 'double precision', nullable: false})
  deodorization_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  num_of_days: number

  // relation
  @ManyToOne(() => CarRentalPost, carRentalPost => carRentalPost.carContracts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'post_id'})
  carRentalPost: CarRentalPost

  @OneToMany(() => Review, review => review.carContract)
  reviews: Review[]

  @OneToOne(() => ContractFulfillment, contractFulfillment => contractFulfillment.carContract)
  contractFulfillment: ContractFulfillment

  @OneToMany(() => ContractTxHistory, contractTxHistory => contractTxHistory.carContract)
  contractTxHistories: ContractTxHistory[]

  @ManyToOne(() => User, user => user.ownedContracts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'owner_id'})
  owner: User

  @ManyToOne(() => User, user => user.rentedContracts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'renter_id'})
  renter: User
}
