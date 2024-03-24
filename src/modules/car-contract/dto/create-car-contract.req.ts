import {ApiProperty} from '@nestjs/swagger'
import {IsInt, IsNotEmpty} from 'class-validator'
import {IsExisted, IsGreaterThan} from 'src/common/validations'

export class CreateCarContractReq {
  @ApiProperty({type: Number, required: true})
  @IsInt()
  @IsNotEmpty()
  @IsExisted('users', 'id')
  renter_id: number

  @ApiProperty({type: Number, required: true})
  @IsInt()
  @IsNotEmpty()
  @IsExisted('users', 'id')
  owner_id: number

  @ApiProperty({type: Number, required: true})
  @IsInt()
  @IsNotEmpty()
  @IsExisted('car_rental_posts', 'id')
  post_id: number

  @ApiProperty({type: Number, required: true})
  @IsInt()
  @IsNotEmpty()
  // @Min(Date.now())
  start_date_ts: number

  @ApiProperty({type: Number, required: true})
  @IsInt()
  @IsNotEmpty()
  @IsGreaterThan('start_date_ts')
  end_date_ts: number
}
