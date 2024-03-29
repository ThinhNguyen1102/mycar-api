import {Module} from '@nestjs/common'
import {CarContractController} from './car-contract.controller'
import {CarContractService} from './car-contract.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {IsExistedRule} from 'src/common/validations'
import {User} from 'src/entities/user.entity'
import {CarRentalPost} from 'src/entities/car-rental-post.entity'
import {UserRepository} from 'src/repositories/user.repository'
import {CarRentalPostRepository} from 'src/repositories/car-rental-post.repository'
import {CarContract} from 'src/entities/car-contract.entity'
import {CarContractRepository} from 'src/repositories/car-contract.repository'
import {CarContractEventService} from './car-contract.event.service'
import {ContractTxHistory} from 'src/entities/contract-tx-history.entity'
import {ContractTxHistoryRepository} from 'src/repositories/contract-tx-history.repository'

@Module({
  imports: [TypeOrmModule.forFeature([User, CarRentalPost, CarContract, ContractTxHistory])],
  controllers: [CarContractController],
  providers: [
    CarContractService,
    CarContractEventService,
    IsExistedRule,
    UserRepository,
    CarRentalPostRepository,
    CarContractRepository,
    ContractTxHistoryRepository,
  ],
  exports: [CarContractService],
})
export class CarContractModule {}
