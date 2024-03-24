import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {CarRentalPostAddress} from 'src/entities/car-rental-post-address.entity'

@Injectable()
export class CarRentalPostAddressRepository extends Repository<CarRentalPostAddress> {
  constructor(
    @InjectRepository(CarRentalPostAddress)
    private carRentalPostAddressRepository: Repository<CarRentalPostAddress>,
  ) {
    super(
      carRentalPostAddressRepository.target,
      carRentalPostAddressRepository.manager,
      carRentalPostAddressRepository.queryRunner,
    )
  }
}
