import {TransactionResponse} from '@ethersproject/abstract-provider'
import {Inject, Injectable} from '@nestjs/common'
import {BigNumber, ethers} from 'ethers'
import {CONTRACT_CONFIG_TOKEN, ContractConfig} from 'src/common/types/contract'

@Injectable()
export class ContractService {
  private contract: ethers.Contract
  private provider: ethers.providers.JsonRpcProvider
  private signer: ethers.Wallet
  private options: Record<string, any>

  constructor(@Inject(CONTRACT_CONFIG_TOKEN) contractConfig: ContractConfig) {
    this.contract = new ethers.Contract(
      contractConfig.constract_address,
      contractConfig.constract_abi,
    )
    this.provider = new ethers.providers.JsonRpcProvider(contractConfig.rpc_provider_url)
    this.signer = new ethers.Wallet(contractConfig.signer_private_key, this.provider)
    this.options = contractConfig.options
  }

  _handleTransactionResponse = async (tx: TransactionResponse) => {
    const recept = await tx.wait()
    return recept.transactionHash
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
