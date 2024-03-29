import {ApiProperty} from '@nestjs/swagger'
import {Type} from 'class-transformer'
import {IsNotEmpty} from 'class-validator'
import {IsExisted} from 'src/common/validations'

export class CarContractIdParam {
  @ApiProperty({type: Number, required: true})
  @IsNotEmpty()
  @Type(() => Number)
  @IsExisted('car_contracts', 'id')
  contractId: number
}
