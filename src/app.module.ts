import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {ConfigModule, ConfigService} from '@nestjs/config'
import configuration from './common/config/configuration'
import {TypeOrmModule} from '@nestjs/typeorm'
import {MailerModule, PugAdapter} from '@nest-modules/mailer'
import {join} from 'path'
import {AuthModule} from './modules/auth/auth.module'
import {ContractModule} from './modules/contract/contract.module'
import {readJSONFile} from './utils/read-json-file'
import {CarContractModule} from './modules/car-contract/car-contract.module'
import {CarRentaPostModule} from './modules/car-rental-post/car-rental-post.module'
import {EventEmitterModule} from '@nestjs/event-emitter'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.postgres.host'),
        port: +configService.get('database.postgres.port'),
        username: configService.get('database.postgres.user'),
        password: configService.get('database.postgres.password'),
        database: configService.get('database.postgres.db', 'mycar'),
        entities: ['dist/**/*.entity.js'],
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail.host'),
          secure: false,
          auth: {
            user: configService.get('mail.user'),
            pass: configService.get('mail.password'),
          },
        },
        defaults: {
          from: `'No Reply' <${configService.get('mail.from')}>`,
        },
        template: {
          dir: join(__dirname, 'common/templates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ContractModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          constract_abi: await readJSONFile(join(__dirname, 'contract', 'abis', 'mycar-abi.json')),
          constract_address: configService.get('contract.contract_address'),
          rpc_provider_url: configService.get('contract.bsc_testnet_rpc'),
          signer_private_key: configService.get('contract.signer_private_key'),
          singer_address: configService.get('contract.signer_address'),
          options: {
            gasLimit: Number(configService.get('contract.gas_limit')),
          },
        }
      },
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    CarContractModule,
    CarRentaPostModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
