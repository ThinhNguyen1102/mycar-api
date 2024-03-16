import {Column, Entity, OneToOne} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {UserLoginInformation} from './user-login-informations.entity'
import {UserRole, UserStatus} from 'src/common/enums/user.enum'

@Entity({name: 'users'})
export class User extends CommonEntity {
  @ApiResponseProperty({type: String})
  @Column({nullable: false, length: 50})
  username: string

  @ApiResponseProperty({type: String})
  @Column({nullable: false, length: 255})
  email: string

  @ApiResponseProperty({type: String})
  @Column({nullable: false, length: 255})
  hash_password: string

  @ApiResponseProperty({type: String})
  @Column({nullable: false, length: 12})
  phone_number: string

  @ApiResponseProperty({type: UserRole})
  @Column({nullable: false, enum: UserRole, type: 'enum'})
  role: UserRole

  @ApiResponseProperty({type: UserStatus})
  @Column({nullable: false, enum: UserStatus, type: 'enum'})
  status: UserStatus

  // Define relations
  @OneToOne(() => UserLoginInformation, userInfo => userInfo.user)
  userLoginInfomation: UserLoginInformation
}
