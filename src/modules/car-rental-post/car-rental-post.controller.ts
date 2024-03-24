import {Body, Controller, HttpStatus, Post, UseGuards} from '@nestjs/common'
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'
import {CarRentalPostService} from './car-rental-post.service'
import {JwtAuthGuard} from 'src/common/guards/jwt-auth.guard'
import {CreateCarRentalPostReq} from './dto/create-car-rental-post.req'
import {CurrentUser} from 'src/common/decorators/current-user.decorator'
import {User} from 'src/entities/user.entity'
import {CarRentalPost} from 'src/entities/car-rental-post.entity'

@ApiTags('Car rental post')
@Controller('car-rental-posts')
export class CarRentalPostController {
  constructor(private readonly carRentalPostService: CarRentalPostService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: CarRentalPost,
  })
  @ApiOperation({
    operationId: 'create-car-rental-post',
    summary: 'Create car rental post',
    description: 'Create car rental post',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createCarRentalPost(@Body() request: CreateCarRentalPostReq, @CurrentUser() user: User) {
    return this.carRentalPostService.createCarRentalPost(request, user)
  }
}
