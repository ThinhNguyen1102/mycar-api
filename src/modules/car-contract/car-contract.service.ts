import {Injectable} from '@nestjs/common'
import {ContractService} from '../contract/contract.service'

@Injectable()
export class CarContractService {
  constructor(private readonly contractService: ContractService) {}

  async getAllCarContract() {
    return this.contractService.pay()
  }
}
