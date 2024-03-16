import {Module} from '@nestjs/common'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {JwtModule} from '@nestjs/jwt'
import {ConfigModule, ConfigService} from '@nestjs/config'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('app.token_jwt_secret_key'),
        signOptions: {
          expiresIn: `${configService.get('app.token_expire_time')}h`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
