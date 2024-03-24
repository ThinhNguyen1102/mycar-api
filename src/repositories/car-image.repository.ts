import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {CarImage} from 'src/entities/car-image.entity'

@Injectable()
export class CarImageRepository extends Repository<CarImage> {
  constructor(
    @InjectRepository(CarImage)
    private carImageRepository: Repository<CarImage>,
  ) {
    super(carImageRepository.target, carImageRepository.manager, carImageRepository.queryRunner)
  }
}
