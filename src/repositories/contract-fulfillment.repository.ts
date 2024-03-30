import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ContractFulfillment} from 'src/entities/contract-fulfillment.entity'

@Injectable()
export class ContractFulfillmentRepository extends Repository<ContractFulfillment> {
  constructor(
    @InjectRepository(ContractFulfillment)
    private contractFulfillmentRepository: Repository<ContractFulfillment>,
  ) {
    super(
      contractFulfillmentRepository.target,
      contractFulfillmentRepository.manager,
      contractFulfillmentRepository.queryRunner,
    )
  }
}
