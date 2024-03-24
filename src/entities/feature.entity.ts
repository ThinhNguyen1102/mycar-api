import {Column, Entity} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'

@Entity({name: 'car_features'})
export class CarFeature extends CommonEntity {
  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  detail: string
}
