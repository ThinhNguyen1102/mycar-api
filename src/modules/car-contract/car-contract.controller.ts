import {Body, Controller, Get, HttpStatus, Param, Post, UseGuards} from '@nestjs/common'
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'
import {CarContractService} from './car-contract.service'
import {JwtAuthGuard} from 'src/common/guards/jwt-auth.guard'
import {CreateCarContractReq} from './dto/create-car-contract.req'
import {CurrentUser} from 'src/common/decorators/current-user.decorator'
import {User} from 'src/entities/user.entity'
import {CarContractIdParam} from './dto/car-contract.param'

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
  async getAllCarContract() {
    return await this.carContractService.getAllCarContract()
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
  })
  @ApiOperation({
    operationId: 'create-car-contract',
    summary: 'Create car contract',
    description: 'Create car contract',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':contractId/reject')
  async rejectCarContract(@CurrentUser() user: User, @Param() {contractId}: CarContractIdParam) {
    return await this.carContractService.ownerRejectCarContract(contractId, user)
  }
}
