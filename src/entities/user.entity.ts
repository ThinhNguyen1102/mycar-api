import {Column, Entity, OneToMany, OneToOne} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {UserLoginInformation} from './user-login-informations.entity'
import {UserRole, UserStatus} from 'src/common/enums/user.enum'
import {CarRentalPost} from './car-rental-post.entity'
import {CarContract} from './car-contract.entity'
import {Notification} from './notification.entity'

@Entity({name: 'users'})
export class User extends CommonEntity {
  @ApiResponseProperty({type: String})
  @Column({nullable: false, length: 50})
  username: string

  @ApiResponseProperty({type: String})
  @Column({nullable: false, length: 255})
  email: string

  @ApiResponseProperty({type: String, deprecated: true})
  @Column({nullable: false, length: 255, select: false})
  hash_password: string

  @ApiResponseProperty({type: String})
  @Column({nullable: false, length: 12})
  phone_number: string

  @ApiResponseProperty({type: String, enum: UserRole})
  @Column({nullable: false, enum: UserRole, type: 'enum'})
  role: UserRole

  @ApiResponseProperty({type: String, enum: UserStatus})
  @Column({nullable: false, enum: UserStatus, type: 'enum'})
  status: UserStatus

  // Define relations
  @OneToOne(() => UserLoginInformation, userInfo => userInfo.user)
  userLoginInfomation: UserLoginInformation

  @OneToMany(() => CarRentalPost, carRentalPost => carRentalPost.owner)
  carRentalPosts: CarRentalPost[]

  @OneToMany(() => CarContract, ownedContract => ownedContract.owner)
  ownedContracts: CarContract[]

  @OneToMany(() => CarContract, rentedContract => rentedContract.renter)
  rentedContracts: CarContract[]

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[]
}
