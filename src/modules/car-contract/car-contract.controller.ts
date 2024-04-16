import {Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards} from '@nestjs/common'
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'
import {CarContractService} from './car-contract.service'
import {JwtAuthGuard} from 'src/common/guards/jwt-auth.guard'
import {CreateCarContractReq} from './dto/create-car-contract.req'
import {CurrentUser} from 'src/common/decorators/current-user.decorator'
import {User} from 'src/entities/user.entity'
import {CarContractIdParam} from './dto/car-contract.param'
import {SuccessRes} from 'src/common/types/response'
import {EndCarContractReq} from './dto/end-car-contract.req'
import {PaymentConfirmReq} from './dto/payment-confirm.req'
import {GetContractsQuery} from './dto/get-contracts.query'

@ApiTags('Contract')
@Controller('car-contracts')
export class CarContractController {
  constructor(private readonly carContractService: CarContractService) {}

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-all-car-contract',
    summary: 'Get all car contract',
    description: 'Get all car contract',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAllCarContract(@CurrentUser() user: User, @Query() query: GetContractsQuery) {
    return await this.carContractService.getAllCarContract(user, query)
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'get-car-contract-detail',
    summary: 'Get car contract detail',
    description: 'Get car contract detail',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':contractId/detail')
  async getCarContractDetail(@CurrentUser() user: User, @Param() {contractId}: CarContractIdParam) {
    return await this.carContractService.getCarContractWithId(contractId, user)
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({
    operationId: 'create-car-contract',
    summary: 'Create car contract',
    description: 'Create car contract',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createCarContact(@Body() request: CreateCarContractReq, @CurrentUser() user: User) {
    return await this.carContractService.createCarContract(request, user)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'reject-car-contract',
    summary: 'Reject car contract',
    description: 'Reject car contract',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':contractId/reject')
  async rejectCarContract(@CurrentUser() user: User, @Param() {contractId}: CarContractIdParam) {
    return await this.carContractService.ownerRejectCarContract(contractId, user)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'owner-cancel-car-contract',
    summary: 'Owner cancel car contract',
    description: 'Owner cancel car contract',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':contractId/owner/cancel')
  async cancelCarContractByOwner(
    @CurrentUser() user: User,
    @Param() {contractId}: CarContractIdParam,
  ) {
    return await this.carContractService.cancelCarContractByOwner(contractId, user)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'renter-cancel-car-contract',
    summary: 'Renter cancel car contract',
    description: 'Renter cancel car contract',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':contractId/renter/cancel')
  async cancelCarContractByRenter(
    @CurrentUser() user: User,
    @Param() {contractId}: CarContractIdParam,
  ) {
    return await this.carContractService.cancelCarContractByRenter(contractId, user)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'start-car-contract',
    summary: 'Start car contract',
    description: 'Start car contract',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':contractId/start')
  async startCarContract(@CurrentUser() user: User, @Param() {contractId}: CarContractIdParam) {
    return await this.carContractService.startCarContractByRenter(contractId, user)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'end-car-contract',
    summary: 'End car contract',
    description: 'End car contract',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':contractId/end')
  async endCarContract(
    @CurrentUser() user: User,
    @Param() {contractId}: CarContractIdParam,
    @Body() request: EndCarContractReq,
  ) {
    return await this.carContractService.endCarContractByOwner(contractId, user, request)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'admin-cancel-contract',
    summary: 'Admin cancel contract',
    description: 'Admin cancel contract',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':contractId/admin/cancel')
  async adminCancelContract(@CurrentUser() user: User, @Param() {contractId}: CarContractIdParam) {
    return await this.carContractService.cancelCarContractByAdmin(contractId, user)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessRes,
  })
  @ApiOperation({
    operationId: 'payment',
    summary: 'Payment',
    description: 'Payment',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':contractId/payment/confirm')
  async confirmPayment(
    @CurrentUser() user: User,
    @Param() {contractId}: CarContractIdParam,
    @Body() {tx_hash}: PaymentConfirmReq,
  ) {
    return await this.carContractService.confirmPayment(contractId, user, tx_hash)
  }
}
