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
import {CALL_EVENTS} from 'src/common/constants/event.const'
import {GetContractsQuery} from './dto/get-contracts.query'
import {paginateResponse} from 'src/utils/helpers'
import {Notification} from 'src/entities/notification.entity'
import {NotificationRepository} from 'src/repositories/notification.repository'
import {PusherService} from '../pusher/pusher.service'
import {NotificationType} from 'src/common/enums/notification.enum'

@Injectable()
export class CarContractService {
  constructor(
    private readonly contractService: ContractService,
    private readonly carRentalPostRepository: CarRentalPostRepository,
    private readonly carContractRepository: CarContractRepository,
    private readonly contractTxHistoryRepository: ContractTxHistoryRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationRepository: NotificationRepository,
    private readonly pusherService: PusherService,
  ) {}

  async getAllCarContract(user: User, query: GetContractsQuery) {
    let carContractsQuery = this.carContractRepository.createQueryBuilder('cc')
    const selectStatuses = query?.status
      ? query?.status.split(';').filter(status => {
          return Object.values(CarContractStatus).includes(status as CarContractStatus)
        })
      : []

    const selectTypes = query?.type
      ? query?.type.split(';').filter(type => {
          return ['owner', 'renter'].includes(type)
        })
      : []

    if (selectTypes.length === 1) {
      carContractsQuery.where(`cc.${selectTypes[0]}_id = :id`, {id: user.id})
    } else {
      carContractsQuery.where('(cc.renter_id = :id or cc.owner_id = :id)', {id: user.id})
    }

    if (selectStatuses.length > 0) {
      carContractsQuery.andWhere('cc.contract_status IN (:...statuses)', {
        statuses: selectStatuses,
      })
    }

    const count = await carContractsQuery.getCount()

    if (query.order_by === 'updated_at') {
      carContractsQuery.orderBy('cc.updated_at', query.order || 'ASC')
    } else {
      carContractsQuery.orderBy('cc.start_date', query.order || 'ASC')
    }

    carContractsQuery = carContractsQuery
      .leftJoinAndSelect('cc.owner', 'owner')
      .leftJoinAndSelect('cc.renter', 'renter')
      .leftJoinAndSelect('cc.contractFulfillment', 'contractFulfillment')
      .leftJoinAndSelect('cc.reviews', 'reviews')
      .leftJoinAndSelect('cc.contractTxHistories', 'contractTxHistories')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)

    const carContracts = await carContractsQuery.getMany()

    const formatterData = carContracts.map(contract => {
      return {
        id: contract.id,
        post_id: contract.post_id,
        owner: {
          id: contract.owner.id,
          email: contract.owner.email,
          username: contract.owner.username,
          phone_number: contract.owner.phone_number,
        },
        renter: {
          id: contract.renter.id,
          email: contract.renter.email,
          username: contract.renter.username,
          phone_number: contract.renter.phone_number,
        },
        contractFulfillment: contract.contractFulfillment
          ? {
              id: contract.contractFulfillment.id,
              has_cleaning_fee: contract.contractFulfillment.has_cleaning_fee,
              has_deodorization_fee: contract.contractFulfillment.has_deodorization_fee,
              has_over_limit_fee: contract.contractFulfillment.has_over_limit_fee,
              over_time_km: contract.contractFulfillment.over_limit_km,
              has_over_time_fee: contract.contractFulfillment.has_over_time_fee,
              over_time_hours: contract.contractFulfillment.over_time_hours,
              other_fee: contract.contractFulfillment.other_fee,
              other_fee_detail: contract.contractFulfillment.other_fee_detail,
            }
          : null,
        contractTxHistories: contract.contractTxHistories.map(tx => {
          return {
            id: tx.id,
            tx_hash: tx.tx_hash,
            tx_type: tx.tx_type,
            tx_value: tx.tx_value,
            created_at: tx.created_at,
          }
        }),
        contract_status: contract.contract_status,
        start_date: contract.start_date,
        end_date: contract.end_date,
        renter_wallet_address: contract.renter_wallet_address,
        owner_wallet_address: contract.owner_wallet_address,
        car_info_snapshot: contract.car_info_snapshot,
        price_per_day: contract.price_per_day,
        mortgage: contract.mortgage,
        over_limit_fee: contract.over_limit_fee,
        over_time_fee: contract.over_time_fee,
        cleaning_fee: contract.cleaning_fee,
        deodorization_fee: contract.deodorization_fee,
        num_of_days: contract.num_of_days,
        is_processing: contract.is_processing,
        created_at: contract.created_at,
        updated_at: contract.updated_at,
        reviews: contract.reviews,
      }
    })

    return paginateResponse(formatterData, count, query.page, query.limit)
  }

  async getCarContractWithId(contractId: number, user: User) {
    const carContract = await this.carContractRepository
      .createQueryBuilder('cc')
      .where('cc.id = :id AND (cc.renter_id = :uid OR cc.owner_id = :uid)', {
        id: contractId,
        uid: user.id,
      })
      .leftJoinAndSelect('cc.owner', 'owner')
      .leftJoinAndSelect('cc.renter', 'renter')
      .leftJoinAndSelect('cc.contractFulfillment', 'contractFulfillment')
      .leftJoinAndSelect('cc.reviews', 'reviews')
      .leftJoinAndSelect('cc.contractTxHistories', 'contractTxHistories')
      .getOne()

    if (!carContract) {
      throw new BadRequestException('Contract not found')
    }

    if (carContract.renter_id !== user.id && carContract.owner_id !== user.id) {
      throw new BadRequestException('You are not the owner or renter of this contract')
    }

    return {
      id: carContract.id,
      post_id: carContract.post_id,
      owner: {
        id: carContract.owner.id,
        email: carContract.owner.email,
        username: carContract.owner.username,
        phone_number: carContract.owner.phone_number,
      },
      renter: {
        id: carContract.renter.id,
        email: carContract.renter.email,
        username: carContract.renter.username,
        phone_number: carContract.renter.phone_number,
      },
      contractFulfillment: carContract.contractFulfillment
        ? {
            id: carContract.contractFulfillment.id,
            has_cleaning_fee: carContract.contractFulfillment.has_cleaning_fee,
            has_deodorization_fee: carContract.contractFulfillment.has_deodorization_fee,
            has_over_limit_fee: carContract.contractFulfillment.has_over_limit_fee,
            over_limit_km: carContract.contractFulfillment.over_limit_km,
            has_over_time_fee: carContract.contractFulfillment.has_over_time_fee,
            over_time_hours: carContract.contractFulfillment.over_time_hours,
            other_fee: carContract.contractFulfillment.other_fee,
            other_fee_detail: carContract.contractFulfillment.other_fee_detail,
          }
        : null,
      contractTxHistories: carContract.contractTxHistories.map(tx => {
        return {
          id: tx.id,
          tx_hash: tx.tx_hash,
          tx_type: tx.tx_type,
          tx_value: tx.tx_value,
          created_at: tx.created_at,
        }
      }),
      contract_status: carContract.contract_status,
      start_date: carContract.start_date,
      end_date: carContract.end_date,
      renter_wallet_address: carContract.renter_wallet_address,
      owner_wallet_address: carContract.owner_wallet_address,
      car_info_snapshot: carContract.car_info_snapshot,
      price_per_day: carContract.price_per_day,
      mortgage: carContract.mortgage,
      over_limit_fee: carContract.over_limit_fee,
      over_time_fee: carContract.over_time_fee,
      cleaning_fee: carContract.cleaning_fee,
      deodorization_fee: carContract.deodorization_fee,
      num_of_days: carContract.num_of_days,
      is_processing: carContract.is_processing,
      created_at: carContract.created_at,
      updated_at: carContract.updated_at,
      reviews: [],
    }
  }

  async createCarContract(request: CreateCarContractReq, renter: User) {
    const post = await this.carRentalPostRepository.findOne({
      where: {
        id: request.post_id,
      },
      relations: ['owner'],
    })

    if (post.post_status !== CarRentalPostStatus.PUBLISHED) {
      throw new BadRequestException('Post is not available')
    }

    if (post.owner_id === renter.id) {
      throw new BadRequestException('You can not rent your own car')
    }

    if (post.owner.id !== request.owner_id) {
      throw new BadRequestException('Owner is not correct')
    }

    const carContractData = new CarContract()
    carContractData.renter_id = request.renter_id
    carContractData.owner_id = request.owner_id
    carContractData.post_id = request.post_id
    carContractData.start_date = new Date(request.start_date_ts)
    carContractData.end_date = new Date(request.end_date_ts)
    carContractData.contract_status = CarContractStatus.WAITING_APPROVAL
    carContractData.car_info_snapshot = 'car_info_summary'
    carContractData.price_per_day = post.price_per_day
    carContractData.mortgage = post.mortgage
    carContractData.over_limit_fee = post.over_limit_fee
    carContractData.over_time_fee = post.over_time_fee
    carContractData.cleaning_fee = post.cleaning_fee
    carContractData.deodorization_fee = post.deodorization_fee
    carContractData.num_of_days = Math.ceil(
      (carContractData.end_date.getTime() - carContractData.start_date.getTime()) /
        (1000 * 3600 * 24),
    )

    const carContract = await this.carContractRepository.save(carContractData)

    return {
      id: carContract.id,
      post_id: carContract.post_id,
      owner: {
        id: post.owner.id,
        email: post.owner.email,
        username: post.owner.username,
        phone_number: post.owner.phone_number,
      },
      renter: {
        id: renter.id,
        email: renter.email,
        username: renter.username,
        phone_number: renter.phone_number,
      },
      contractFulfillment: null,
      contractTxHistories: [],
      contract_status: carContract.contract_status,
      start_date: carContract.start_date,
      end_date: carContract.end_date,
      renter_wallet_address: carContract.renter_wallet_address,
      owner_wallet_address: carContract.owner_wallet_address,
      car_info_snapshot: carContract.car_info_snapshot,
      price_per_day: carContract.price_per_day,
      mortgage: carContract.mortgage,
      over_limit_fee: carContract.over_limit_fee,
      over_time_fee: carContract.over_time_fee,
      cleaning_fee: carContract.cleaning_fee,
      deodorization_fee: carContract.deodorization_fee,
      num_of_days: carContract.num_of_days,
      created_at: carContract.created_at,
      updated_at: carContract.updated_at,
      reviews: [],
    }
  }

  async ownerRejectCarContract(contractId: number, owner: User) {
    const contract = await this.carContractRepository.findOne({
      where: {
        id: contractId,
      },
    })

    if (contract.is_processing) {
      throw new BadRequestException('Contract is processing, please wait a few minutes')
    }

    if (contract.owner_id !== owner.id) {
      throw new BadRequestException('You are not the owner of this contract')
    }

    if (contract.contract_status !== CarContractStatus.WAITING_APPROVAL) {
      throw new BadRequestException('Contract is not waiting for approval')
    }

    if (!contract.renter_wallet_address) {
      throw new BadRequestException('Renter wallet address is not available')
    }

    this.eventEmitter.emit(CALL_EVENTS.REFUND_OWNER_REJECTED, {
      contract_id: contract.id,
      renter_address: contract.renter_wallet_address,
      amount: contract.num_of_days * contract.price_per_day + contract.mortgage,
    })

    contract.is_processing = true
    await this.carContractRepository.save(contract)

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

    if (contract.is_processing) {
      throw new BadRequestException('Contract is processing, please wait a few minutes')
    }

    if (contract.owner_id !== owner.id) {
      throw new BadRequestException('You are not the owner of this contract')
    }

    if (contract.contract_status !== CarContractStatus.APPROVED) {
      throw new BadRequestException('Contract is not approved or started')
    }

    this.eventEmitter.emit(CALL_EVENTS.REFUND_OWNER_CANCELED, {
      contract_id: contract.id,
    })

    contract.is_processing = true
    await this.carContractRepository.save(contract)

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

    if (contract.is_processing) {
      throw new BadRequestException('Contract is processing, please wait a few minutes')
    }

    if (contract.renter_id !== renter.id) {
      throw new BadRequestException('You are not the renter of this contract')
    }

    if (contract.contract_status !== CarContractStatus.APPROVED) {
      throw new BadRequestException('Contract is not approved or started')
    }

    this.eventEmitter.emit(CALL_EVENTS.REFUND_RENTER_CANCELED, {
      contract_id: contract.id,
    })

    contract.is_processing = true
    await this.carContractRepository.save(contract)

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

    if (contract.is_processing) {
      throw new BadRequestException('Contract is processing, please wait a few minutes')
    }

    if (contract.renter_id !== renter.id) {
      throw new BadRequestException('You are not the renter of this contract')
    }

    if (contract.contract_status !== CarContractStatus.APPROVED) {
      throw new BadRequestException('Contract is not approved')
    }

    this.eventEmitter.emit(CALL_EVENTS.START_CAR_CONTRACT, {
      contract_id: contract.id,
    })

    contract.is_processing = true
    await this.carContractRepository.save(contract)

    return new SuccessRes('Contract started successfully!')
  }

  async endCarContractByOwner(contractId: number, owner: User, request: EndCarContractReq) {
    const contract = await this.carContractRepository.findOne({
      where: {
        id: contractId,
      },
    })

    if (contract.is_processing) {
      throw new BadRequestException('Contract is processing, please wait a few minutes')
    }

    if (contract.owner_id !== owner.id) {
      throw new BadRequestException('You are not the owner of this contract')
    }

    if (contract.contract_status !== CarContractStatus.STARTED) {
      throw new BadRequestException('Contract is not started')
    }

    this.eventEmitter.emit(CALL_EVENTS.END_CAR_CONTRACT, {
      contract_id: contract.id,
      surcharge: request,
    })

    contract.is_processing = true
    await this.carContractRepository.save(contract)

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

    if (contract.is_processing) {
      throw new BadRequestException('Contract is processing, please wait a few minutes')
    }

    if (contract.contract_status !== CarContractStatus.APPROVED) {
      throw new BadRequestException('Contract is not approved or started')
    }

    this.eventEmitter.emit(CALL_EVENTS.REFUND_ADMIN_CANCEL, contract.id)

    contract.is_processing = true
    await this.carContractRepository.save(contract)

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

    if (carContract.is_processing) {
      throw new BadRequestException('Contract is processing, please wait a few minutes')
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

      this.eventEmitter.emit(CALL_EVENTS.CREATE_CAR_CONTRACT, carContractSm)

      carContract.is_processing = true
    } else {
      const newNotification = new Notification()
      newNotification.user_id = carContract.owner_id
      newNotification.title = 'Bạn có đề xuất hợp đồng mới'
      newNotification.content = `${user.username} đã gửi yêu cầu thuê xe của bạn`
      newNotification.is_read = false
      newNotification.contract_id = carContract.id
      newNotification.type = NotificationType.WARNING

      const result = await this.notificationRepository.save(newNotification)

      if (result) {
        this.pusherService.trigger(`user-${carContract.owner_id}`, 'notification::new', {
          newNotification,
        })
      }
    }

    await this.carContractRepository.save(carContract)

    await this.contractTxHistoryRepository.save({
      contract_id: carContract.id,
      tx_hash: txHash,
      tx_type: ContractTransactionType.PAYMENT,
      tx_value: txInfo.value,
      created_at: new Date(txInfo.timestamp * 1000),
    })

    return new SuccessRes('Payment confirmed successfully!')
  }

  async setInProgress(contractId: number, user: User) {
    const contract = await this.carContractRepository.findOne({
      where: {
        id: contractId,
      },
    })

    if (!contract) {
      throw new BadRequestException('Contract not found')
    }

    if (contract.owner_id !== user.id && contract.renter_id !== user.id) {
      throw new BadRequestException('You are not the owner or renter of this contract')
    }

    contract.is_processing = false

    await this.carContractRepository.save(contract)

    return new SuccessRes('Contract in progress')
  }
}
