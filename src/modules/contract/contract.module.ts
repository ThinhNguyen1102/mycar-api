import {DynamicModule, Global, Module} from '@nestjs/common'
import {CONTRACT_CONFIG_TOKEN, ContractAsyncOptions} from 'src/common/types/contract'
import {ContractService} from './contract.service'
import {Web3Module} from 'nest-web3'
import {ConfigModule, ConfigService} from '@nestjs/config'

@Global()
@Module({})
export class ContractModule {
  static registerAsync(contractOptions: ContractAsyncOptions): DynamicModule {
    return {
      module: ContractModule,
      imports: [
        Web3Module.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            name: 'bsc-testnet',
            url: configService.get('contract.bsc_testnet_rpc'),
          }),
          inject: [ConfigService],
        }),
      ],
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
