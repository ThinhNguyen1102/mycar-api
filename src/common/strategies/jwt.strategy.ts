import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {UserLoginInformationRepository} from 'src/repositories/user-login-information.repository'
import {UserRepository} from 'src/repositories/user.repository'
import {JwtTokenPayload} from '../types/jwt-token-payload'
import {UnauthorizedException} from '../errors/exceptions'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userLoginInfoRepository: UserLoginInformationRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.token_jwt_secret_key'),
      passReqToCallback: true,
    })
  }

  async validate(req: any, payload: JwtTokenPayload) {
    if (payload.is_refresh_token || payload.is_admin) {
      throw new UnauthorizedException('Invalid token!')
    }

    // Validate if token is active or not and validate if token belongs to user
    const rawToken = req.headers['authorization'].split(' ')[1]

    const userLoginInfo = await this.userLoginInfoRepository.findOneByAccessToken(rawToken)

    if (!userLoginInfo || userLoginInfo.user_id != payload.sub) {
      throw new UnauthorizedException('Invalid token!')
    }

    return this.userRepository.findById(payload.sub)
  }
}
