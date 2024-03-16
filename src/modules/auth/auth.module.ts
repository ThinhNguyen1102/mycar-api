import {Module} from '@nestjs/common'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {JwtModule} from '@nestjs/jwt'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {User} from 'src/entities/user.entity'
import {UserLoginInformation} from 'src/entities/user-login-informations.entity'
import {TypeOrmModule} from '@nestjs/typeorm'
import {UserRepository} from 'src/repositories/user.repository'
import {UserLoginInformationRepository} from 'src/repositories/user-login-information.repository'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('app.token_jwt_secret_key'),
        signOptions: {
          expiresIn: `${configService.get('app.token_expire_time')}`,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, UserLoginInformation]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, UserLoginInformationRepository],
})
export class AuthModule {}
