import {Column, Entity} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'

@Entity({name: 'car_rental_post_images'})
export class CarRentalPostImages extends CommonEntity {
  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  post_id: number

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  image_url: string
}
