import {Column, Entity, OneToMany} from 'typeorm'
import {NotSelectTimestampCommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {CarRentalPostFeature} from './car-rental-post-feature.entity'

@Entity({name: 'car_features'})
export class CarFeature extends NotSelectTimestampCommonEntity {
  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  detail: string

  // relation
  @OneToMany(() => CarRentalPostFeature, carRentalPostFeature => carRentalPostFeature.carRentalPost)
  carRentalPostFeatures: CarRentalPostFeature[]
}
