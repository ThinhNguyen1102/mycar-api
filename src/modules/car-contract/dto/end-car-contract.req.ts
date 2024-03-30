import {ApiProperty} from '@nestjs/swagger'
import {IsBoolean, IsNotEmpty, IsNumber, Min} from 'class-validator'

export class EndCarContractReq {
  @ApiProperty({type: Boolean, required: true})
  @IsNotEmpty()
  @IsBoolean()
  is_over_limit_fee: boolean

  @ApiProperty({type: Number, required: true})
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  over_time: number

  @ApiProperty({type: Boolean, required: true})
  @IsNotEmpty()
  @IsBoolean()
  is_cleaning_fee: boolean

  @ApiProperty({type: Boolean, required: true})
  @IsNotEmpty()
  @IsBoolean()
  is_deodorization_fee: boolean
}
