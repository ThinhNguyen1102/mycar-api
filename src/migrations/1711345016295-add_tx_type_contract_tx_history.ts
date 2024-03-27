import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTxTypeContractTxHistory1711345016295 implements MigrationInterface {
    name = 'AddTxTypeContractTxHistory1711345016295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contract_tx_histories_tx_type_enum" AS ENUM('payment', 'car_contract_create', 'refund_owner_reject', 'refund_owner_cancel', 'CANCEL', 'REFUND', 'OVERDUE')`);
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" ADD "tx_type" "public"."contract_tx_histories_tx_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" DROP COLUMN "tx_type"`);
        await queryRunner.query(`DROP TYPE "public"."contract_tx_histories_tx_type_enum"`);
    }

}
