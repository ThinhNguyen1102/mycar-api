import {Column, Entity, JoinColumn, OneToOne} from 'typeorm'
import {NotSelectTimestampCommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {CarRentalPost} from './car-rental-post.entity'

@Entity({name: 'car_rental_post_addresses'})
export class CarRentalPostAddress extends NotSelectTimestampCommonEntity {
  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  post_id: number

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  district_name: string

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  prefecture_name: string

  // relation
  @OneToOne(() => CarRentalPost, carRentalPost => carRentalPost.carRentalPostAddress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'post_id'})
  carRentalPost: CarRentalPost
}
