import {BadRequestException, Injectable} from '@nestjs/common'
import {CreateCarContractReq} from './dto/create-car-contract.req'
import {User} from 'src/entities/user.entity'
import {CarRentalPostRepository} from 'src/repositories/car-rental-post.repository'
import {CarRentalPostStatus} from 'src/common/enums/car-rental-post.enum'
import {CarContract} from 'src/entities/car-contract.entity'
import {CarContractStatus} from 'src/common/enums/car-contract.enum'
import {CarContractRepository} from 'src/repositories/car-contract.repository'
import {ContractService} from '../contract/contract.service'

@Injectable()
export class CarContractService {
  constructor(
    private readonly contractService: ContractService,
    private readonly carRentalPostRepository: CarRentalPostRepository,
    private readonly carContractRepository: CarContractRepository,
  ) {}

  async getAllCarContract() {
    return this.contractService.getAllCarContract()
  }

  async createCarContract(request: CreateCarContractReq, renter: User) {
    const post = await this.carRentalPostRepository.findOne({
      where: {
        id: request.post_id,
      },
    })

    if (post.post_status !== CarRentalPostStatus.PUBLISHED) {
      throw new BadRequestException('Post is not available')
    }

    if (post.owner_id === renter.id) {
      throw new BadRequestException('You can not rent your own car')
    }

    const carContract = new CarContract()
    carContract.renter_id = request.renter_id
    carContract.owner_id = request.owner_id
    carContract.post_id = request.post_id
    carContract.start_date = new Date(request.start_date_ts)
    carContract.end_date = new Date(request.end_date_ts)
    carContract.contract_status = CarContractStatus.WAITING_APPROVAL
    carContract.car_info_snapshot = 'car_info_summary'
    carContract.price_per_day = post.price_per_day
    carContract.mortgage = post.mortgage
    carContract.over_limit_fee = post.over_limit_fee
    carContract.over_time_fee = post.over_time_fee
    carContract.cleaning_fee = post.cleaning_fee
    carContract.deodorization_fee = post.deodorization_fee
    carContract.num_of_days = Math.ceil(
      (carContract.end_date.getTime() - carContract.start_date.getTime()) / (1000 * 3600 * 24),
    )

    const carContractResult = await this.carContractRepository.save(carContract)

    return carContractResult
  }
}
