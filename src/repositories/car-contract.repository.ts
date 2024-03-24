import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {CarContract} from 'src/entities/car-contract.entity'

@Injectable()
export class CarContractRepository extends Repository<CarContract> {
  constructor(
    @InjectRepository(CarContract)
    private carContractRepository: Repository<CarContract>,
  ) {
    super(
      carContractRepository.target,
      carContractRepository.manager,
      carContractRepository.queryRunner,
    )
  }
}
