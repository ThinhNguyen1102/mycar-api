import {Module} from '@nestjs/common'
import {CarRentalPostController} from './car-rental-post.controller'
import {CarRentalPostService} from './car-rental-post.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CarRentalPost} from 'src/entities/car-rental-post.entity'
import {CarRentalPostRepository} from 'src/repositories/car-rental-post.repository'
import {CarFeature} from 'src/entities/car-feature.entity'
import {CarFeatureRepository} from 'src/repositories/car-feature.repository'
import {CarRentalPostAddress} from 'src/entities/car-rental-post-address.entity'
import {CarImage} from 'src/entities/car-image.entity'
import {CarRentalPostAddressRepository} from 'src/repositories/car-rental-post-address.repositoty'
import {CarImageRepository} from 'src/repositories/car-image.repository'
import {CarRentalPostFeatureRepository} from 'src/repositories/car-rental-post-feature.repository'
import {CarRentalPostFeature} from 'src/entities/car-rental-post-feature.entity'
import {CloudinaryModule} from '../cloudinary/cloudinary.module'

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([
      CarRentalPost,
      CarFeature,
      CarRentalPostAddress,
      CarImage,
      CarRentalPostFeature,
    ]),
  ],
  controllers: [CarRentalPostController],
  providers: [
    CarRentalPostService,
    CarRentalPostRepository,
    CarFeatureRepository,
    CarRentalPostAddressRepository,
    CarImageRepository,
    CarRentalPostFeatureRepository,
  ],
})
export class CarRentaPostModule {}
