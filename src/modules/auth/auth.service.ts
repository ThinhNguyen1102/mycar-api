import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import {RegisterReq} from './dto/register.req'
import {UserRepository} from 'src/repositories/user.repository'
import {compare, hashPassword} from 'src/utils/bcrypt'
import {MailerService} from '@nest-modules/mailer'
import {ConfigService} from '@nestjs/config'
import {SuccessRes} from 'src/common/types/response'
import {AccountPayload, JwtTokenPayload} from 'src/common/types/jwt-token-payload'
import {TokenInfoRes} from './dto/token-info.res'
import {JwtService} from '@nestjs/jwt'
import {ResetPasswordReq} from './dto/reset-password.req'
import {UserLoginInformationRepository} from 'src/repositories/user-login-information.repository'
import {UserRole, UserStatus} from 'src/common/enums/user.enum'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userLoginInfoRepository: UserLoginInformationRepository,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerReq: RegisterReq) {
    const user = await this.userRepository.findOne({
      where: [{email: registerReq.email, phone_number: registerReq.phone_number}],
    })

    if (user) {
      const errMessage =
        user.email === registerReq.email ? 'Email already exists' : 'Phone number already exists'
      throw new BadRequestException(errMessage)
    }

    const hashPass = hashPassword(registerReq.password)

    delete registerReq.password
    const newUser = await this.userRepository.save({
      ...registerReq,
      hash_password: hashPass,
      role: UserRole.USER,
      status: UserStatus.INACTIVE,
    })

    await this.userLoginInfoRepository.save({
      user: newUser,
    })

    // if (newUser) {
    //   const hashed = hashPassword(registerReq.email)
    //   const appDomain = this.configService.get('app.domain')
    //   const appPort = this.configService.get('app.port')
    //   const appPrefix = this.configService.get('app.prefix')
    //   const appVersion = this.configService.get('app.version')
    //   const verifyUrl = `http://${appDomain}:${appPort}/${appPrefix}/${appVersion}/auth/verify?user_id=${newUser.id.toString()}&token=${hashed}`

    //   this.mailerService.sendMail({
    //     to: newUser.email,
    //     subject: 'Welcome to MyCar',
    //     template: './verify',
    //     context: {
    //       name: newUser.username,
    //       verifyUrl,
    //     },
    //   })
    // }

    return new SuccessRes('Register successfully! Please check your email to verify account')
  }

  async verifyAccount(user_id: number, token: string) {
    const user = await this.userRepository.findOne({where: {id: user_id}})

    if (!user) {
      throw new BadRequestException('User not found')
    }

    const checked = compare(user.email, token)

    if (!checked) {
      throw new BadRequestException('Verify account failed')
    }

    await this.userRepository.update({id: user_id}, {status: UserStatus.ACTIVE})

    return new SuccessRes('Verify account successfully')
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new NotFoundException('Email not registered')
    }

    //generate password reset token
    const token = this.jwtService.sign(
      {email},
      {
        secret: this.configService.get('app.token_jwt_secret_key'),
        expiresIn: this.configService.get('app.token_password_reset_expire_time'),
      },
    )

    // Send the password reset email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'MyCar reset password',
      template: './reset-password',
      context: {
        name: user.username,
        resetPassUrl: `http://localhost:3000/auth/reset-password?token=${token}`,
      },
    })

    return new SuccessRes('Please check your email to reset password')
  }

  async resetPassword({email, token, password}: ResetPasswordReq) {
    const {email: emailToken} = await this.jwtService.verify(token, {
      secret: this.configService.get('app.token_jwt_secret_key'),
    })

    if (email !== emailToken) {
      throw new BadRequestException('Invalid or expired password reset token')
    }

    const hashedPassword = hashPassword(password)

    await this.userRepository.update({email}, {hash_password: hashedPassword})

    return new SuccessRes('Reset password successfully')
  }

  async issueToken(payload: AccountPayload): Promise<TokenInfoRes> {
    const tokenExpireTime = this.configService.get('app.token_expire_time')
    const refreshTokenExpireTime = this.configService.get('app.token_refresh_expire_time')
    const tokenSecret = this.configService.get('app.token_jwt_secret_key')

    const accessTokenPayload: JwtTokenPayload = {
      ...payload,
      is_refresh_token: false,
    }
    const refreshTokenPayload: JwtTokenPayload = {
      ...payload,
      is_refresh_token: true,
    }

    return {
      access_token: await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: `${tokenExpireTime}`,
        secret: tokenSecret,
      }),
      refresh_token: await this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: `${refreshTokenExpireTime}`,
        secret: tokenSecret,
      }),
    }
  }
}
