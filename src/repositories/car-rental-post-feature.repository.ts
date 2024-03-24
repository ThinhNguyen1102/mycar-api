import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {CarRentalPostFeature} from 'src/entities/car-rental-post-feature.entity'

@Injectable()
export class CarRentalPostFeatureRepository extends Repository<CarRentalPostFeature> {
  constructor(
    @InjectRepository(CarRentalPostFeature)
    private carRentalPostFeatureRepository: Repository<CarRentalPostFeature>,
  ) {
    super(
      carRentalPostFeatureRepository.target,
      carRentalPostFeatureRepository.manager,
      carRentalPostFeatureRepository.queryRunner,
    )
  }
}
