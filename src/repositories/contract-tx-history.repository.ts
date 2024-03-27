import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ContractTxHistory} from 'src/entities/contract-tx-history.entity'

@Injectable()
export class ContractTxHistoryRepository extends Repository<ContractTxHistory> {
  constructor(
    @InjectRepository(ContractTxHistory)
    private contractTxHistoryRepository: Repository<ContractTxHistory>,
  ) {
    super(
      contractTxHistoryRepository.target,
      contractTxHistoryRepository.manager,
      contractTxHistoryRepository.queryRunner,
    )
  }
}
