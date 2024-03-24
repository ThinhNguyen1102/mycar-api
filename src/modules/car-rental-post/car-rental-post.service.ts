import {Injectable} from '@nestjs/common'
import {CarRentalPostRepository} from 'src/repositories/car-rental-post.repository'
import {CreateCarRentalPostReq} from './dto/create-car-rental-post.req'
import {User} from 'src/entities/user.entity'
import {CarRentalPostStatus} from 'src/common/enums/car-rental-post.enum'
import {CarRentalPostAddressRepository} from 'src/repositories/car-rental-post-address.repositoty'
import {CarImageRepository} from 'src/repositories/car-image.repository'
import {CarFeatureRepository} from 'src/repositories/car-feature.repository'
import {In} from 'typeorm'
import {CarRentalPostFeatureRepository} from 'src/repositories/car-rental-post-feature.repository'

@Injectable()
export class CarRentalPostService {
  constructor(
    private readonly carRentalPostRepository: CarRentalPostRepository,
    private readonly carFeatureRepository: CarFeatureRepository,
    private readonly carRentalPostAddressRepository: CarRentalPostAddressRepository,
    private readonly carRentalPostFeatureRepository: CarRentalPostFeatureRepository,
    private readonly carImageRepository: CarImageRepository,
  ) {}

  async createCarRentalPost(request: CreateCarRentalPostReq, owner: User) {
    const existedFeatures = await this.carFeatureRepository.find({
      where: {
        id: In(request.car_feature_ids),
      },
    })

    const carRentalPost = this.carRentalPostRepository.create({
      ...request,
      post_status: CarRentalPostStatus.PUBLISHED,
      mortgage: 0.1,
      owner,
    })

    const carRentalPostSaved = await this.carRentalPostRepository.save(carRentalPost)

    await this.carRentalPostAddressRepository.save({
      post_id: carRentalPostSaved.id,
      district_name: request.district_name,
      prefecture_name: request.prefecture_name,
    })

    await this.carImageRepository
      .createQueryBuilder()
      .insert()
      .values(
        request.car_image_urls.map(url => ({
          post_id: carRentalPostSaved.id,
          image_url: url,
        })),
      )
      .execute()

    await this.carRentalPostFeatureRepository
      .createQueryBuilder()
      .insert()
      .values(
        existedFeatures.map(feature => ({
          post_id: carRentalPostSaved.id,
          car_feature_id: feature.id,
        })),
      )
      .execute()

    return carRentalPostSaved
  }
}
