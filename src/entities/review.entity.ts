import {Column, Entity} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'

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
}
