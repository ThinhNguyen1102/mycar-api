import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {CarRentalPost} from './car-rental-post.entity'
import {CarContract} from './car-contract.entity'

@Entity({name: 'reviews'})
export class Review extends CommonEntity {
  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  post_id: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  star: number

  @ApiResponseProperty({type: String})
  @Column({type: 'text', nullable: false})
  comment: string

  // relation
  @ManyToOne(() => CarRentalPost, carRentalPost => carRentalPost.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'post_id'})
  carRentalPost: CarRentalPost

  @ManyToOne(() => CarContract, carContract => carContract.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'contract_id'})
  carContract: CarContract
}
