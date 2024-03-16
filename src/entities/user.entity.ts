import {Column, Entity, OneToOne} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {UserLoginInformation} from './user-login-informations.entity'

@Entity({name: 'users'})
export class User extends CommonEntity {
  @ApiResponseProperty({type: String})
  @Column({nullable: false, length: 50})
  user_name: string

  @ApiResponseProperty({type: String})
  @Column({nullable: false, length: 255})
  email: string

  @ApiResponseProperty({type: String})
  @Column({nullable: false, length: 255})
  hash_password: string

  // Define relations
  @OneToOne(() => UserLoginInformation, userInfo => userInfo.user)
  userLoginInfomation: UserLoginInformation
}
