import {BadRequestException, Injectable} from '@nestjs/common'
import {CarRentalPostRepository} from 'src/repositories/car-rental-post.repository'
import {CreateCarRentalPostReq} from './dto/create-car-rental-post.req'
import {User} from 'src/entities/user.entity'
import {CarRentalPostStatus} from 'src/common/enums/car-rental-post.enum'
import {CarRentalPostAddressRepository} from 'src/repositories/car-rental-post-address.repositoty'
import {CarImageRepository} from 'src/repositories/car-image.repository'
import {CarFeatureRepository} from 'src/repositories/car-feature.repository'
import {In} from 'typeorm'
import {CarRentalPostFeatureRepository} from 'src/repositories/car-rental-post-feature.repository'
import {CarContract} from 'src/entities/car-contract.entity'
import {CarContractStatus} from 'src/common/enums/car-contract.enum'

@Injectable()
export class CarRentalPostService {
  constructor(
    private readonly carRentalPostRepository: CarRentalPostRepository,
    private readonly carFeatureRepository: CarFeatureRepository,
    private readonly carRentalPostAddressRepository: CarRentalPostAddressRepository,
    private readonly carRentalPostFeatureRepository: CarRentalPostFeatureRepository,
    private readonly carImageRepository: CarImageRepository,
  ) {}

  async updateCarRentalPost(post_id: number, request: CreateCarRentalPostReq, owner: User) {
    const existedFeatures = await this.carFeatureRepository.find({
      where: {
        id: In(request.car_feature_ids),
      },
    })

    const carRentalPost = await this.carRentalPostRepository.findOne({
      where: {
        id: post_id,
      },
    })

    if (!carRentalPost) {
      throw new BadRequestException('Car rental post not found')
    }

    if (carRentalPost.owner_id !== owner.id) {
      throw new BadRequestException('You are not the owner of this post')
    }

    const updateData = {...request}
    delete updateData.car_feature_ids
    delete updateData.car_image_urls
    delete updateData.district_name
    delete updateData.prefecture_name

    console.log(updateData)

    const carRentalPostSaved = await this.carRentalPostRepository.update(
      {
        id: post_id,
      },
      {
        ...updateData,
      },
    )

    await this.carRentalPostAddressRepository.delete({
      post_id: post_id,
    })

    await this.carRentalPostAddressRepository.insert({
      post_id: post_id,
      district_name: request.district_name,
      prefecture_name: request.prefecture_name,
    })

    await this.carImageRepository.delete({
      post_id: post_id,
    })

    await this.carImageRepository.insert(
      request.car_image_urls.map(url => ({
        post_id: post_id,
        image_url: url,
      })),
    )

    await this.carRentalPostFeatureRepository.delete({
      post_id: post_id,
    })

    await this.carRentalPostFeatureRepository
      .createQueryBuilder()
      .insert()
      .values(
        existedFeatures.map(feature => ({
          post_id: post_id,
          car_feature_id: feature.id,
        })),
      )
      .execute()

    return carRentalPostSaved
  }

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

  async getCarRentalPostDetail(post_id: number) {
    const carRentalPost = await this.carRentalPostRepository
      .createQueryBuilder('crp')
      .where('crp.id = :id', {id: post_id})
      .leftJoinAndSelect('crp.owner', 'owner')
      .leftJoinAndSelect('crp.carImages', 'carImages')
      .leftJoinAndSelect('crp.carRentalPostAddress', 'carRentalPostAddress')
      .leftJoinAndSelect('crp.carRentalPostFeatures', 'carRentalPostFeatures')
      .leftJoinAndSelect('carRentalPostFeatures.carFeature', 'carFeature')
      .leftJoinAndMapMany(
        'crp.carContracts',
        CarContract,
        'cc',
        'cc.contract_status in (:...statuses) and cc.post_id = crp.id',
        {
          statuses: [
            CarContractStatus.WAITING_APPROVAL,
            CarContractStatus.APPROVED,
            CarContractStatus.STARTED,
          ],
        },
      )
      .getOne()

    if (!carRentalPost) {
      throw new BadRequestException('Car rental post not found')
    }

    return {
      ...carRentalPost,
      owner: {
        id: carRentalPost.owner.id,
        email: carRentalPost.owner.email,
        username: carRentalPost.owner.username,
        phone_number: carRentalPost.owner.phone_number,
      },
      carRentalPostFeatures: carRentalPost.carRentalPostFeatures.map(
        feature => feature.carFeature.detail,
      ),
      carImages: carRentalPost.carImages.map(image => image.image_url),
      carRentalPostAddress: {
        district_name: carRentalPost.carRentalPostAddress.district_name,
        prefecture_name: carRentalPost.carRentalPostAddress.prefecture_name,
      },
      carContracts: carRentalPost.carContracts.map(contract => {
        return {
          id: contract.id,
          start_date: contract.start_date,
          end_date: contract.end_date,
        }
      }),
    }
  }

  async getCarRentalPosts() {
    const carRentalPosts = await this.carRentalPostRepository
      .createQueryBuilder('crp')
      .leftJoinAndSelect('crp.owner', 'owner')
      .leftJoinAndSelect('crp.carImages', 'carImages')
      .leftJoinAndSelect('crp.carRentalPostAddress', 'carRentalPostAddress')
      .leftJoinAndSelect('crp.carRentalPostFeatures', 'carRentalPostFeatures')
      .leftJoinAndSelect('carRentalPostFeatures.carFeature', 'carFeature')
      .getMany()

    return carRentalPosts.map(carRentalPost => ({
      ...carRentalPost,
      owner: {
        id: carRentalPost.owner.id,
        email: carRentalPost.owner.email,
        username: carRentalPost.owner.username,
        phone_number: carRentalPost.owner.phone_number,
      },
      carRentalPostFeatures: carRentalPost.carRentalPostFeatures.map(
        feature => feature.carFeature.detail,
      ),
      carImages: carRentalPost.carImages.map(image => image.image_url),
      carRentalPostAddress: {
        district_name: carRentalPost.carRentalPostAddress.district_name,
        prefecture_name: carRentalPost.carRentalPostAddress.prefecture_name,
      },
    }))
  }
}
