import {ApiResponseProperty} from '@nestjs/swagger'

export class SuccessRes {
  constructor(message: string) {
    this.success = true
    this.message = message
  }

  @ApiResponseProperty({type: Boolean, example: true})
  success: boolean

  @ApiResponseProperty({type: String, example: 'success!!'})
  message: string
}
