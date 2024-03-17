import {Injectable} from '@nestjs/common'
import {ContractService} from './modules/contract/contract.service'

@Injectable()
export class AppService {
  constructor(private readonly contractService: ContractService) {}

  getHello() {
    return {
      message: 'Welcome to MyCar api! visit /api/docs for more api documentation.',
    }
  }
}
