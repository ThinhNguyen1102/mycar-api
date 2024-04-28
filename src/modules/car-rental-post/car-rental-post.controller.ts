import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'
import {CarRentalPostService} from './car-rental-post.service'
import {JwtAuthGuard} from 'src/common/guards/jwt-auth.guard'
import {CreateCarRentalPostReq} from './dto/create-car-rental-post.req'
import {CurrentUser} from 'src/common/decorators/current-user.decorator'
import {User} from 'src/entities/user.entity'
import {CarRentalPost} from 'src/entities/car-rental-post.entity'
import {CarRentalPostParam} from './dto/car-rental-post-id.param'
import {FilesInterceptor} from '@nestjs/platform-express'
import {filterImageConfig, storageConfig} from 'src/common/config/upload-files-config'
import {CloudinaryService} from '../cloudinary/cloudinary.service'

@ApiTags('Car rental post')
@Controller('car-rental-posts')
export class CarRentalPostController {
  constructor(
    private readonly carRentalPostService: CarRentalPostService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('image', 4, {
      storage: storageConfig('images'),
      fileFilter: filterImageConfig(1024 * 1024 * 20),
    }),
  )
  @Post('upload/images')
  async uploadFiles(@Req() req: any, @UploadedFiles() files: Array<Express.Multer.File>) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError)
    }

    const cloudImages = await Promise.all(
      files.map(file => {
        return this.cloudinaryService.uploadFile(file)
      }),
    )

    return cloudImages.map(cloudImage => cloudImage.secure_url)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: CarRentalPost,
  })
  @ApiOperation({
    operationId: 'update-car-rental-post',
    summary: 'Update car rental post',
    description: 'Update car rental post',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':post_id')
  async updateCarRentalPost(
    @Param() {post_id}: CarRentalPostParam,
    @Body() request: CreateCarRentalPostReq,
    @CurrentUser() user: User,
  ) {
    return this.carRentalPostService.updateCarRentalPost(post_id, request, user)
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-car-rental-post-detail',
    summary: 'Get car rental post detail',
    description: 'Get car rental post detail',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':post_id/detail')
  async getCarRentalPostDetail(@Param() {post_id}: CarRentalPostParam) {
    return this.carRentalPostService.getCarRentalPostDetail(post_id)
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-car-rental-posts',
    summary: 'Get car rental posts',
    description: 'Get car rental posts',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getCarRentalPosts() {
    return this.carRentalPostService.getCarRentalPosts()
  }
}
