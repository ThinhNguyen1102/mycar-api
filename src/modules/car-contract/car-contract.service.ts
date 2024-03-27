import {BadRequestException, Injectable} from '@nestjs/common'
import {CreateCarContractReq} from './dto/create-car-contract.req'
import {User} from 'src/entities/user.entity'
import {CarRentalPostRepository} from 'src/repositories/car-rental-post.repository'
import {CarRentalPostStatus} from 'src/common/enums/car-rental-post.enum'
import {CarContract} from 'src/entities/car-contract.entity'
import {CarContractStatus} from 'src/common/enums/car-contract.enum'
import {CarContractRepository} from 'src/repositories/car-contract.repository'
import {ContractService} from '../contract/contract.service'
import {SuccessRes} from 'src/common/types/response'

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

  async ownerRejectCarContract(contractId: number, owner: User) {
    const contract = await this.carContractRepository.findOne({
      where: {
        id: contractId,
      },
    })

    if (contract.owner_id !== owner.id) {
      throw new BadRequestException('You are not the owner of this contract')
    }

    if (contract.contract_status !== CarContractStatus.WAITING_APPROVAL) {
      throw new BadRequestException('Contract is not waiting for approval')
    }

    if (!contract.renter_wallet_address) {
      throw new BadRequestException('Renter wallet address is not available')
    }

    contract.contract_status = CarContractStatus.REJECTED

    await this.carContractRepository.save(contract)

    this.contractService.refundOwnerReject(
      contract.id,
      contract.renter_wallet_address,
      contract.num_of_days * contract.price_per_day + contract.mortgage,
    )

    return new SuccessRes(
      'Owner reject contract successfully! Please check your wallet in a few minutes',
    )
  }

  async cancelCarContractByOwner(contractId: number, owner: User) {
    const contract = await this.carContractRepository.findOne({
      where: {
        id: contractId,
      },
    })

    if (contract.owner_id !== owner.id) {
      throw new BadRequestException('You are not the owner of this contract')
    }

    if (contract.contract_status !== CarContractStatus.APPROVED) {
      throw new BadRequestException('Contract is not approved or started')
    }

    contract.contract_status = CarContractStatus.CANCELED

    await this.carContractRepository.save(contract)

    this.contractService.refundOwnerCancel(contract.id)

    return new SuccessRes(
      'Owner cancel contract successfully! Please check your wallet in a few minutes',
    )
  }

  async cancelCarContractByRenter(contractId: number, renter: User) {
    const contract = await this.carContractRepository.findOne({
      where: {
        id: contractId,
      },
    })

    if (contract.renter_id !== renter.id) {
      throw new BadRequestException('You are not the renter of this contract')
    }

    if (contract.contract_status !== CarContractStatus.APPROVED) {
      throw new BadRequestException('Contract is not approved or started')
    }

    contract.contract_status = CarContractStatus.CANCELED

    await this.carContractRepository.save(contract)

    this.contractService.refundRenterCancel(contract.id)

    return new SuccessRes(
      'Renter cancel contract successfully! Please check your wallet in a few minutes',
    )
  }
}
