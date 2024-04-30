import {Injectable} from '@nestjs/common'
import {SuccessRes} from 'src/common/types/response'
import {NotificationRepository} from 'src/repositories/notification.repository'
import {UserRepository} from 'src/repositories/user.repository'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async getNotification(userId: number) {
    return this.notificationRepository.find({where: {user_id: userId}})
  }

  async setIsReadNotification(userId: number) {
    await this.notificationRepository.update({user_id: userId}, {is_read: true})

    return new SuccessRes('Set is read notifications successfully')
  }
}
