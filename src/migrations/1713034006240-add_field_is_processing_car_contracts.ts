import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldIsProcessingCarContracts1713034006240 implements MigrationInterface {
    name = 'AddFieldIsProcessingCarContracts1713034006240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "is_processing" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" ALTER COLUMN "tx_value" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" ALTER COLUMN "tx_value" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "is_processing"`);
    }

}
