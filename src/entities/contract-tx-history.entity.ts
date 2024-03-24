import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {CarContract} from './car-contract.entity'

@Entity({name: 'contract_tx_histories'})
export class ContractTxHistory extends CommonEntity {
  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  contract_id: number

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  tx_hash: string

  // relation
  @ManyToOne(() => CarContract, carContract => carContract.contractTxHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'contract_id'})
  carContract: CarContract
}
