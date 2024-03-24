import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {CarRentalPostStatus, Fuel, Transmission} from 'src/common/enums/car-rental-post.enum'
import {CarRentalPostAddress} from './car-rental-post-address.entity'
import {CarImage} from './car-image.entity'
import {CarRentalPostFeature} from './car-rental-post-feature.entity'
import {User} from './user.entity'
import {CarContract} from './car-contract.entity'
import {Review} from './review.entity'

@Entity({name: 'car_rental_posts'})
export class CarRentalPost extends CommonEntity {
  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  owner_id: number

  @ApiResponseProperty({type: CarRentalPostStatus})
  @Column({type: 'enum', enum: CarRentalPostStatus, nullable: false})
  post_status: CarRentalPostStatus

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  model: string

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  seats: number

  @ApiResponseProperty({type: Fuel})
  @Column({type: 'enum', enum: Fuel, nullable: false})
  fuel: Fuel

  @ApiResponseProperty({type: String})
  @Column({type: 'text', nullable: false})
  description: string

  @ApiResponseProperty({type: Transmission})
  @Column({type: 'enum', enum: Transmission, nullable: false})
  transmission: Transmission

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  brand: string

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  license_plate: string

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  price_per_day: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  mortgage: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  over_limit_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  over_time_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  cleaning_fee: number

  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  deodorization_fee: number

  // relation
  @OneToOne(() => CarRentalPostAddress, carRentalPostAddress => carRentalPostAddress.carRentalPost)
  carRentalPostAddress: CarRentalPostAddress

  @OneToMany(() => CarImage, carImage => carImage.carRentalPost)
  carImages: CarImage[]

  @OneToMany(() => CarRentalPostFeature, carRentalPostFeature => carRentalPostFeature.carRentalPost)
  carRentalPostFeatures: CarRentalPostFeature[]

  @OneToMany(() => CarContract, carContract => carContract.carRentalPost)
  carContracts: CarContract[]

  @OneToMany(() => Review, review => review.carRentalPost)
  reviews: Review[]

  @ManyToOne(() => User, user => user.carRentalPosts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'owner_id'})
  owner: User
}
