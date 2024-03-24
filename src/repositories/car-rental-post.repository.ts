import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {CarRentalPost} from 'src/entities/car-rental-post.entity'

@Injectable()
export class CarRentalPostRepository extends Repository<CarRentalPost> {
  constructor(
    @InjectRepository(CarRentalPost)
    private carRentalPostRepository: Repository<CarRentalPost>,
  ) {
    super(
      carRentalPostRepository.target,
      carRentalPostRepository.manager,
      carRentalPostRepository.queryRunner,
    )
  }
}
