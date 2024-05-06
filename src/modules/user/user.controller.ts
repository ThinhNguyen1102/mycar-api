import {Controller, Get, HttpStatus, Param, Post, UseGuards} from '@nestjs/common'
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'
import {UserService} from './user.service'
import {JwtAuthGuard} from 'src/common/guards/jwt-auth.guard'
import {CurrentUser} from 'src/common/decorators/current-user.decorator'
import {User} from 'src/entities/user.entity'

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-profile',
    summary: 'Get profile',
    description: 'Get profile',
  })
  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return user
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-notification',
    summary: 'Get notification',
    description: 'Get notification',
  })
  @Get('notifications')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getNotification(@CurrentUser() user: User) {
    return await this.userService.getNotification(user.id)
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'set-is-read-notifications',
    summary: 'Set is read notifications',
    description: 'Set is read notifications',
  })
  @Post('notifications/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setIsReadNotifications(@CurrentUser() user: User) {
    return await this.userService.setIsReadNotification(user.id)
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'set-is-read-notifications-with-id',
    summary: 'Set is read notification with id',
    description: 'Set is read notification with id',
  })
  @Post('notifications/:id/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setIsReadNotificationWithId(@CurrentUser() user: User, @Param('id') id: number) {
    return await this.userService.setIsReadNotificationWithId(user.id, id)
  }
}
