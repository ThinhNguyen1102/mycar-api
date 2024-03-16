import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {User} from 'src/entities/user.entity'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository.target, userRepository.manager, userRepository.queryRunner)
  }

  async findById(userId: number): Promise<User> {
    return await this.userRepository.findOne({where: {id: userId}})
  }
}
