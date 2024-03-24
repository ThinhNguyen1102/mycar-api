import {Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm'
import {ApiResponseProperty} from '@nestjs/swagger'
import {TimestampEntity} from './common.entity'
import {CarRentalPost} from './car-rental-post.entity'
import {CarFeature} from './car-feature.entity'

@Entity({name: 'car_rental_post_features'})
export class CarRentalPostFeature extends TimestampEntity {
  @ApiResponseProperty({type: Number})
  @PrimaryColumn({type: Number, nullable: false})
  post_id: number

  @ApiResponseProperty({type: Number})
  @PrimaryColumn({type: Number, nullable: false})
  car_feature_id: number

  // relation
  @ManyToOne(() => CarRentalPost, carRentalPost => carRentalPost.carRentalPostFeatures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'post_id'})
  carRentalPost: CarRentalPost

  @ManyToOne(() => CarFeature, carFeature => carFeature.carRentalPostFeatures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'car_feature_id'})
  carFeature: CarFeature
}
