import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {CarFeature} from 'src/entities/car-feature.entity'

@Injectable()
export class CarFeatureRepository extends Repository<CarFeature> {
  constructor(
    @InjectRepository(CarFeature)
    private carFeatureRepository: Repository<CarFeature>,
  ) {
    super(
      carFeatureRepository.target,
      carFeatureRepository.manager,
      carFeatureRepository.queryRunner,
    )
  }
}
