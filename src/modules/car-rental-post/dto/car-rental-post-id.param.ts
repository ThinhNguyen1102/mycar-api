import {ApiProperty} from '@nestjs/swagger'
import {Type} from 'class-transformer'
import {IsNotEmpty, IsNumber, Min} from 'class-validator'

export class CarRentalPostParam {
  @ApiProperty({type: Number, required: true})
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  post_id: number
}
