import {DynamicModule, Module} from '@nestjs/common'
import {CONTRACT_CONFIG_TOKEN, ContractAsyncOptions} from 'src/common/types/contract'
import {ContractService} from './contract.service'

@Module({})
export class ContractModule {
  static registerAsync(contractOptions: ContractAsyncOptions): DynamicModule {
    return {
      module: ContractModule,
      providers: [
        {
          provide: CONTRACT_CONFIG_TOKEN,
          useFactory: contractOptions.useFactory,
          inject: contractOptions.inject,
        },
        ContractService,
      ],
      exports: [ContractService],
    }
  }
}
