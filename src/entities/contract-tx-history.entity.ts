import {Column, Entity} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'

@Entity({name: 'contract_tx_histories'})
export class ContractTxHistory extends CommonEntity {
  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  contract_id: number

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  tx_hash: string
}
