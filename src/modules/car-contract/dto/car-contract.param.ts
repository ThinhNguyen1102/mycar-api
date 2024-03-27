import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty, IsNumberString} from 'class-validator'
import {IsExisted} from 'src/common/validations'

export class CarContractIdParam {
  @ApiProperty({type: Number, required: true})
  @IsNotEmpty()
  @IsNumberString()
  @IsExisted('car_contracts', 'id')
  contractId: number
}
