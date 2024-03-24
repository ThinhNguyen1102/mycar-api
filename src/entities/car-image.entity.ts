import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm'
import {NotSelectTimestampCommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {CarRentalPost} from './car-rental-post.entity'

@Entity({name: 'car_images'})
export class CarImage extends NotSelectTimestampCommonEntity {
  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  post_id: number

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  image_url: string

  // relation
  @ManyToOne(() => CarRentalPost, carRentalPost => carRentalPost.carImages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'post_id'})
  carRentalPost: CarRentalPost
}
