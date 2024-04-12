import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm'
import {CommonEntity} from './common.entity'
import {ApiResponseProperty} from '@nestjs/swagger'
import {CarContract} from './car-contract.entity'
import {ContractTransactionType} from 'src/common/enums/contract-tx-history.enum'

@Entity({name: 'contract_tx_histories'})
export class ContractTxHistory extends CommonEntity {
  @ApiResponseProperty({type: Number})
  @Column({type: Number, nullable: false})
  contract_id: number

  @ApiResponseProperty({type: String})
  @Column({type: String, nullable: false})
  tx_hash: string

  @ApiResponseProperty({type: ContractTransactionType})
  @Column({type: 'enum', enum: ContractTransactionType, nullable: false})
  tx_type: ContractTransactionType

  @ApiResponseProperty({type: Number})
  @Column({type: 'double precision', nullable: true})
  tx_value: number

  // relation
  @ManyToOne(() => CarContract, carContract => carContract.contractTxHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'contract_id'})
  carContract: CarContract
}
