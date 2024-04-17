import {ApiProperty} from '@nestjs/swagger'
import {Type} from 'class-transformer'
import {IsNotEmpty, IsNumber, IsOptional, Min} from 'class-validator'
import {Fuel} from 'src/common/enums/car-rental-post.enum'

export class GetCarRentalPostsQuery {
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

  @ApiProperty({type: Fuel})
  @IsOptional()
  fuel?: Fuel

  @ApiProperty({type: Number})
  @IsOptional()
  num_seat?: number

  @ApiProperty({type: String})
  @IsOptional()
  dist_code?: string

  @ApiProperty({type: String})
  @IsOptional()
  pref_code?: string

  @ApiProperty({type: String})
  @IsOptional()
  order_by?: 'price_per_day' | 'num_star' | 'num_trip'

  @ApiProperty({type: String})
  @IsOptional()
  order?: 'ASC' | 'DESC'
}
