import {DynamicModule, Global, Module} from '@nestjs/common'
import {CONTRACT_CONFIG_TOKEN, ContractAsyncOptions} from 'src/common/types/contract'
import {ContractService} from './contract.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CarContract} from 'src/entities/car-contract.entity'
import {CarContractRepository} from 'src/repositories/car-contract.repository'
import {User} from 'src/entities/user.entity'
import {UserRepository} from 'src/repositories/user.repository'
import {CarRentalPost} from 'src/entities/car-rental-post.entity'
import {CarRentalPostRepository} from 'src/repositories/car-rental-post.repository'
import {ContractTxHistory} from 'src/entities/contract-tx-history.entity'
import {ContractTxHistoryRepository} from 'src/repositories/contract-tx-history.repository'

@Global()
@Module({})
export class ContractModule {
  static registerAsync(contractOptions: ContractAsyncOptions): DynamicModule {
    return {
      module: ContractModule,
      imports: [TypeOrmModule.forFeature([User, CarContract, CarRentalPost, ContractTxHistory])],
      providers: [
        {
          provide: CONTRACT_CONFIG_TOKEN,
          useFactory: contractOptions.useFactory,
          inject: contractOptions.inject,
        },
        ContractService,
        CarContractRepository,
        CarRentalPostRepository,
        UserRepository,
        ContractTxHistoryRepository,
      ],
      exports: [ContractService],
    }
  }
}
