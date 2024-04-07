import {ApiProperty} from '@nestjs/swagger'
import {Transform, TransformFnParams} from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator'
import {Fuel, Transmission} from 'src/common/enums/car-rental-post.enum'

export class CarRentalPostAddressDto {
  @ApiProperty({type: String, required: true})
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @Transform(({value}: TransformFnParams) => value?.trim())
  district_name: string

  @ApiProperty({type: String, required: true})
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @Transform(({value}: TransformFnParams) => value?.trim())
  prefecture_name: string
}

export class CarRentalPostDto extends CarRentalPostAddressDto {
  @ApiProperty({type: String, required: true})
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @Transform(({value}: TransformFnParams) => value?.trim())
  model: string

  @ApiProperty({type: Number, required: true})
  @IsInt()
  @IsNotEmpty()
  @Max(100)
  seats: number

  @ApiProperty({type: Fuel, required: true, enum: Fuel})
  @IsEnum(Fuel)
  @IsNotEmpty()
  fuel: Fuel

  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  @Transform(({value}: TransformFnParams) => value?.trim())
  description: string

  @ApiProperty({type: Transmission, required: true, enum: Transmission})
  @IsEnum(Transmission)
  @IsNotEmpty()
  transmission: Transmission

  @ApiProperty({type: String, required: true})
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @Transform(({value}: TransformFnParams) => value?.trim())
  brand: string

  @ApiProperty({type: String, required: true})
  @IsString()
  @Length(8, 9)
  @IsNotEmpty()
  license_plate: string

  @ApiProperty({type: Number, required: true})
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(40)
  consumption: number

  @ApiProperty({type: Number, required: true})
  @IsNumber()
  @IsNotEmpty()
  @Min(1970)
  @Max(new Date().getFullYear())
  year: number

  @ApiProperty({type: Number, required: true})
  @IsNumber()
  @IsNotEmpty()
  @Max(10)
  @Min(0)
  price_per_day: number

  @ApiProperty({type: Number, required: true})
  @IsNumber()
  @IsNotEmpty()
  @Max(1)
  @Min(0)
  over_limit_fee: number

  @ApiProperty({type: Number, required: true})
  @IsNumber()
  @IsNotEmpty()
  @Max(1)
  @Min(0)
  over_time_fee: number

  @ApiProperty({type: Number, required: true})
  @IsNumber()
  @IsNotEmpty()
  @Max(1)
  @Min(0)
  cleaning_fee: number

  @ApiProperty({type: Number, required: true})
  @IsNumber()
  @IsNotEmpty()
  @Max(1)
  @Min(0)
  deodorization_fee: number

  @ApiProperty({
    type: String,
    isArray: true,
    required: true,
    maxItems: 5,
    minItems: 1,
  })
  @IsNotEmpty()
  @IsArray()
  @IsUrl({require_protocol: true}, {each: true})
  car_image_urls: string[]

  @ApiProperty({
    type: Number,
    isArray: true,
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsInt({each: true})
  @Min(1, {each: true})
  car_feature_ids: number[]
}

export class CreateCarRentalPostReq extends CarRentalPostDto {}
