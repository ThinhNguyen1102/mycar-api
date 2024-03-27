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

@Module({
  imports: [TypeOrmModule.forFeature([User, CarRentalPost, CarContract])],
  controllers: [CarContractController],
  providers: [
    CarContractService,
    IsExistedRule,
    UserRepository,
    CarRentalPostRepository,
    CarContractRepository,
  ],
  exports: [CarContractService],
})
export class CarContractModule {}
