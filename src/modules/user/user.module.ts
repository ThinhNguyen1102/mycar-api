import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from 'src/entities/user.entity'
import {UserService} from './user.service'
import {UserController} from './user.controller'
import {UserRepository} from 'src/repositories/user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
