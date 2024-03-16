import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {ConfigModule, ConfigService} from '@nestjs/config'
import configuration from './common/config/configuration'
import {TypeOrmModule} from '@nestjs/typeorm'

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
