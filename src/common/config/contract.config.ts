import * as process from 'process'
import * as dotenv from 'dotenv'

dotenv.config()

const contractConfig = {
  signer_address: process.env.SIGNER_ADDRESS,
  signer_private_key: process.env.SIGNER_PRIVATE_KEY,
  contract_address: process.env.CONTRACT_ADDRESS,
  bsc_testnet_rpc: process.env.BSC_TESTNET_RPC,
  gas_limit: process.env.GAS_LIMIT,
}

export {contractConfig}
