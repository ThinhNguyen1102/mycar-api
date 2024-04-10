import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTxValueField1712761120252 implements MigrationInterface {
    name = 'AddTxValueField1712761120252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" ADD "tx_value" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" DROP COLUMN "tx_value"`);
    }

}
