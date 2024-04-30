import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from 'src/entities/user.entity'
import {UserService} from './user.service'
import {UserController} from './user.controller'
import {UserRepository} from 'src/repositories/user.repository'
import {Notification} from 'src/entities/notification.entity'
import {NotificationRepository} from 'src/repositories/notification.repository'

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  controllers: [UserController],
  providers: [UserService, UserRepository, NotificationRepository],
})
export class UserModule {}
