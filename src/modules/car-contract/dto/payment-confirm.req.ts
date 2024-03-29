import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty, IsString, Matches} from 'class-validator'

export class PaymentConfirmReq {
  @ApiProperty({type: String, required: true})
  @IsNotEmpty()
  @IsString()
  @Matches(/^0x([A-Fa-f0-9]{64})$/)
  tx_hash: string
}
