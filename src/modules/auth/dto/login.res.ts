import {ApiResponseProperty} from '@nestjs/swagger'
import {TokenInfoRes} from './token-info.res'
import {User} from 'src/entities/user.entity'
import {Type} from 'class-transformer'
import {SuccessRes} from 'src/common/types/response'

class LoginInfo extends TokenInfoRes {
  @ApiResponseProperty({type: User})
  user: User
}

export class LoginRes extends SuccessRes {
  @ApiResponseProperty({type: LoginInfo})
  @Type(() => LoginInfo)
  data: LoginInfo
}
