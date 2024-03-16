import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'
import {AuthService} from './auth.service'
import {RegisterReq} from './dto/register.req'
import {VerifyQuery} from './dto/verify.query'
import {SuccessRes} from 'src/common/types/response'
import {ForgotPasswordReq} from './dto/forgot-password.req'
import {ResetPasswordReq} from './dto/reset-password.req'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'register',
    summary: 'Register',
    description: 'Register',
  })
  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerReq: RegisterReq) {
    return await this.authService.register(registerReq)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'verify-account',
    summary: 'Verify account',
    description: 'Verify account',
  })
  @Get('verify')
  @UsePipes(ValidationPipe)
  async verify(@Query() {user_id, token}: VerifyQuery) {
    return await this.authService.verifyAccount(user_id, token)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'forgot-password',
    summary: 'Forgot password',
    description: 'Forgot password',
  })
  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() {email}: ForgotPasswordReq) {
    return await this.authService.forgotPassword(email)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'reset-password',
    summary: 'Reset password',
    description: 'Reset password',
  })
  @Post('reset-password')
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() request: ResetPasswordReq) {
    return await this.authService.resetPassword(request)
  }
}
