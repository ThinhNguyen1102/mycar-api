import {Module} from '@nestjs/common'
import {CarContractController} from './car-contract.controller'
import {CarContractService} from './car-contract.service'
import {TypeOrmModule} from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [CarContractController],
  providers: [CarContractService],
})
export class CarContractModule {}
