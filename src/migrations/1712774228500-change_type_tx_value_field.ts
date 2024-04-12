import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypeTxValueField1712774228500 implements MigrationInterface {
    name = 'ChangeTypeTxValueField1712774228500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" DROP COLUMN "tx_value"`);
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" ADD "tx_value" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" DROP COLUMN "tx_value"`);
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" ADD "tx_value" integer`);
    }

}
