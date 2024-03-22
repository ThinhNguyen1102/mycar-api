import {TransactionResponse} from '@ethersproject/abstract-provider'
import {Inject, Injectable} from '@nestjs/common'
import {BigNumber, ethers} from 'ethers'
import {CONTRACT_CONFIG_TOKEN, ContractConfig} from 'src/common/types/contract'
import {CarContractSM} from 'src/contract/types'

@Injectable()
export class ContractService {
  private contract: ethers.Contract
  private provider: ethers.providers.JsonRpcProvider
  private signer: ethers.Wallet
  private options: Record<string, any>

  constructor(@Inject(CONTRACT_CONFIG_TOKEN) contractConfig: ContractConfig) {
    this.provider = new ethers.providers.JsonRpcProvider(contractConfig.rpc_provider_url)
    this.signer = new ethers.Wallet(contractConfig.signer_private_key, this.provider)
    this.contract = new ethers.Contract(
      contractConfig.constract_address,
      contractConfig.constract_abi,
      this.signer,
    )
    this.options = contractConfig.options

    this.listentCarContractEvent()
  }

  async getAllCarContract() {
    try {
      const response = await this.contract.functions.getCarContracts()

      return this.handleListContractResponse(response[0])
    } catch (e) {
      console.log(e)
    }
  }

  async getCarContractWithId(contractId: number) {
    try {
      const response = await this.contract.functions.getCarContractWithId(contractId)

      return this.handleListContractResponse(response)
    } catch (e) {
      console.log(e)
    }
  }

  async pay() {
    try {
      const tx = await this.contract.functions.createContract(
        2,
        'acc1@gmail.com',
        '0x2374d179C5f9fF0EAB3D4FAB8e9cF468a7b589fF',
        'acc2@gmail.com',
        '0xDaf584176486351708388B0aB2a67E2975b26989',
        this._toWei(0.02),
        this._toWei(0.01),
        this._toWei(0.01),
        this._toWei(0.01),
        this._toWei(0.01),
        3,
        1711035479856,
        1711035479856 + 86400000 * 3,
        'Toyota',
        '1234',
        {
          ...this.options,
        },
      )

      return this._handleTransactionResponse(tx)
    } catch (e) {
      console.log(e)
    }
  }

  listentCarContractEvent() {
    this.contract.on('PaymentReceived', (contract_id, owner, renter, amount, event) => {
      console.log('here')
      console.log('PaymentReceived', contract_id, owner, renter, amount, event)
    })
  }

  handleListContractResponse(response: any[]): CarContractSM[] {
    return response.map(r => {
      return this.handleContractResponse(r)
    })
  }

  handleContractResponse(response: any[]): CarContractSM {
    const carContractSm: CarContractSM = {
      contract_id: this._toNumber(response[0]),
      owner_address: response[1],
      owner_email: response[2],
      renter_address: response[3],
      renter_email: response[4],
      rental_price_per_day: this._toEther(response[5]),
      mortgage: this._toEther(response[6]),
      over_limit_fee: this._toEther(response[7]),
      over_time_fee: this._toEther(response[8]),
      cleaning_fee: this._toEther(response[9]),
      deodorization_fee: this._toEther(response[10]),
      num_of_days: this._toNumber(response[11]),
      start_date: new Date(this._toNumber(response[12])),
      end_date: new Date(this._toNumber(response[13])),
      car_model: response[14],
      car_plate: response[15],
      status: response[16],
      created_at: new Date(this._toNumber(response[17]) * 1000),
    }

    return carContractSm
  }

  _handleTransactionResponse = async (tx: TransactionResponse) => {
    const recept = await tx.wait()
    return recept
  }

  _numberToEth = (amount: number) => {
    return ethers.utils.parseEther(amount.toString())
  }

  _toNumber = (bigNumber: BigNumber) => {
    try {
      return bigNumber.toNumber()
    } catch (er) {
      return Number.parseFloat(ethers.utils.formatEther(bigNumber))
    }
  }

  _toEther = (bigNumber: BigNumber) => {
    return Number.parseFloat(ethers.utils.formatEther(bigNumber))
  }

  _toWei = (amount: number) => {
    return ethers.utils.parseUnits(amount.toString())
  }
}
