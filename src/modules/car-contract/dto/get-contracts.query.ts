import {ApiProperty} from '@nestjs/swagger'
import {Type} from 'class-transformer'
import {IsNotEmpty, IsNumber, IsOptional, Min} from 'class-validator'
import {CarContractStatus} from 'src/common/enums/car-contract.enum'

export class GetContractsQuery {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Page',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  page: number

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Limit records per page',
    required: true,
  })
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  limit: number

  @ApiProperty({type: CarContractStatus})
  @IsOptional()
  status?: CarContractStatus

  @ApiProperty({type: String})
  @IsOptional()
  order_by?: 'start_date' | 'updated_at'

  @ApiProperty({type: String})
  @IsOptional()
  order?: 'ASC' | 'DESC'
}
