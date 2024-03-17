import {ModuleMetadata} from '@nestjs/common'

export class ContractConfig {
  constract_address: string
  constract_abi: string
  rpc_provider_url: string
  signer_private_key: string
  singer_address: string
  options: Record<string, any>
}

export interface ContractAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[]
  useFactory?: (...args: any[]) => Promise<ContractConfig> | ContractConfig
}

export const CONTRACT_CONFIG_TOKEN = 'CONTRACT_CONFIG'
