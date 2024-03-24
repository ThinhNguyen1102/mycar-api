import {Entity, PrimaryColumn} from 'typeorm'
import {ApiResponseProperty} from '@nestjs/swagger'
import {TimestampEntity} from './common.entity'

@Entity({name: 'car_rental_post_features'})
export class CarRentalPostFeature extends TimestampEntity {
  @ApiResponseProperty({type: Number})
  @PrimaryColumn({type: Number, nullable: false})
  post_id: number

  @ApiResponseProperty({type: Number})
  @PrimaryColumn({type: Number, nullable: false})
  car_feature_id: number
}
