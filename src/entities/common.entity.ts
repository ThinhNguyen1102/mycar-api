import {ApiResponseProperty} from '@nestjs/swagger'
import {Type} from 'class-transformer'
import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'

export class TimestampEntity {
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date
}

export class CommonEntity extends TimestampEntity {
  @ApiResponseProperty({type: Number})
  @PrimaryGeneratedColumn({type: 'int'})
  @Type(() => Number)
  id: number
}
