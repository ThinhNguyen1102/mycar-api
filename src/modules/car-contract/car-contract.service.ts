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
import {EndCarContractReq} from './dto/end-car-contract.req'
import {UserRole} from 'src/common/enums/user.enum'
import {CAR_CONTRACT_REFUND_RATE} from 'src/common/constants/common.const'
import {CarContractSM, PaymentTxInfomation} from 'src/contract/types'
import {ContractTxHistoryRepository} from 'src/repositories/contract-tx-history.repository'
import {ContractTransactionType} from 'src/common/enums/contract-tx-history.enum'
import {EventEmitter2} from '@nestjs/event-emitter'

@Injectable()
export class CarContractService {
  constructor(
    private readonly contractService: ContractService,
    private readonly carRentalPostRepository: CarRentalPostRepository,
    private readonly carContractRepository: CarContractRepository,
    private readonly contractTxHistoryRepository: ContractTxHistoryRepository,
    private readonly eventEmitter: EventEmitter2,
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

  async startCarContractByRenter(contractId: number, renter: User) {
    const contract = await this.carContractRepository.findOne({
      where: {
        id: contractId,
      },
    })

    if (contract.renter_id !== renter.id) {
      throw new BadRequestException('You are not the renter of this contract')
    }

    if (contract.contract_status !== CarContractStatus.APPROVED) {
      throw new BadRequestException('Contract is not approved')
    }

    contract.contract_status = CarContractStatus.STARTED

    await this.carContractRepository.save(contract)

    this.contractService.startContract(contract.id)

    return new SuccessRes('Contract started successfully!')
  }

  async endCarContractByOwner(contractId: number, owner: User, request: EndCarContractReq) {
    const contract = await this.carContractRepository.findOne({
      where: {
        id: contractId,
      },
    })

    if (contract.owner_id !== owner.id) {
      throw new BadRequestException('You are not the owner of this contract')
    }

    if (contract.contract_status !== CarContractStatus.STARTED) {
      throw new BadRequestException('Contract is not started')
    }

    contract.contract_status = CarContractStatus.ENDED

    await this.carContractRepository.save(contract)

    this.contractService.endContract(contract.id, request)

    return new SuccessRes('Contract ended successfully! Please check your wallet in a few minutes')
  }

  async cancelCarContractByAdmin(contractId: number, user: User) {
    user.role = UserRole.ADMIN
    if (user.role !== UserRole.ADMIN) {
      throw new BadRequestException('You are not an admin')
    }

    const contract = await this.carContractRepository.findOne({
      where: {
        id: contractId,
      },
    })

    if (contract.contract_status !== CarContractStatus.APPROVED) {
      throw new BadRequestException('Contract is not approved or started')
    }

    contract.contract_status = CarContractStatus.CANCELED

    await this.carContractRepository.save(contract)

    this.contractService.refund(contract.id)

    return new SuccessRes(
      'Admin cancel contract successfully! Please check your wallet in a few minutes',
    )
  }

  async confirmPayment(contractId: number, user: User, txHash: string) {
    let txInfo: PaymentTxInfomation = null
    try {
      txInfo = await this.contractService.getTransactionInfo(txHash)
    } catch (error) {
      throw new BadRequestException('Transaction not found')
    }

    if (txInfo.data.email !== user.email) {
      throw new BadRequestException('You are not the owner of this transaction')
    }

    if (contractId !== txInfo.data.contract_id) {
      throw new BadRequestException('Transaction does not match with contract')
    }

    const carContract = await this.carContractRepository.findOne({
      where: {
        id: txInfo.data.contract_id,
      },
      relations: {
        owner: true,
        renter: true,
        carRentalPost: true,
      },
    })

    if (!carContract) {
      throw new BadRequestException('Contract not found')
    }

    if (carContract.contract_status !== CarContractStatus.WAITING_APPROVAL) {
      throw new BadRequestException('Contract is not waiting for approval')
    }

    if (carContract.renter_id !== user.id && carContract.owner_id !== user.id) {
      throw new BadRequestException('You are not the owner or renter of this contract')
    }

    const isOwnerPayment = carContract.owner_id === user.id
    if (isOwnerPayment) {
      const ownerAmount =
        carContract.num_of_days * carContract.price_per_day * CAR_CONTRACT_REFUND_RATE

      if (txInfo.value !== ownerAmount) {
        throw new BadRequestException('Amount is not correct')
      }

      if (carContract.renter_wallet_address && carContract.renter_wallet_address === txInfo.from) {
        throw new BadRequestException('Invalid owner address')
      }

      carContract.owner_wallet_address = txInfo.from
    } else {
      const renterAmount =
        carContract.num_of_days * carContract.price_per_day + carContract.mortgage

      if (txInfo.value !== renterAmount) {
        throw new BadRequestException('Amount is not correct')
      }

      if (carContract.owner_wallet_address && carContract.owner_wallet_address === txInfo.from) {
        throw new BadRequestException('Invalid renter address')
      }

      carContract.renter_wallet_address = txInfo.from
    }

    if (carContract.renter_wallet_address && carContract.owner_wallet_address) {
      const carContractSm: CarContractSM = {
        contract_id: carContract.id,
        owner_address: carContract.owner_wallet_address,
        owner_email: carContract.owner.email,
        renter_address: carContract.renter_wallet_address,
        renter_email: carContract.renter.email,
        rental_price_per_day: carContract.price_per_day,
        mortgage: carContract.mortgage,
        over_limit_fee: carContract.over_limit_fee,
        over_time_fee: carContract.over_time_fee,
        cleaning_fee: carContract.cleaning_fee,
        deodorization_fee: carContract.deodorization_fee,
        num_of_days: carContract.num_of_days,
        start_date: carContract.start_date,
        end_date: carContract.end_date,
        car_model: carContract.carRentalPost.model,
        car_plate: carContract.carRentalPost.license_plate,
        status: carContract.contract_status,
        created_at: carContract.created_at,
      }

      this.eventEmitter.emit('call::create_contract', carContractSm)
    }

    await this.carContractRepository.save(carContract)

    await this.contractTxHistoryRepository.save({
      contract_id: carContract.id,
      tx_hash: txHash,
      tx_type: ContractTransactionType.PAYMENT,
      created_at: new Date(txInfo.timestamp * 1000),
    })

    return new SuccessRes('Payment confirmed successfully!')
  }
}
