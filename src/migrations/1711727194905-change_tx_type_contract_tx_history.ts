import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTxTypeContractTxHistory1711727194905 implements MigrationInterface {
    name = 'ChangeTxTypeContractTxHistory1711727194905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."contract_tx_histories_tx_type_enum" RENAME TO "contract_tx_histories_tx_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."contract_tx_histories_tx_type_enum" AS ENUM('pay', 'createContract', 'refund', 'refundOwnerReject', 'refundOwnerCancel', 'refundRentalCancel', 'startContract', 'endContract')`);
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" ALTER COLUMN "tx_type" TYPE "public"."contract_tx_histories_tx_type_enum" USING "tx_type"::"text"::"public"."contract_tx_histories_tx_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."contract_tx_histories_tx_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contract_tx_histories_tx_type_enum_old" AS ENUM('payment', 'car_contract_create', 'refund_owner_reject', 'refund_owner_cancel', 'CANCEL', 'REFUND', 'OVERDUE')`);
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" ALTER COLUMN "tx_type" TYPE "public"."contract_tx_histories_tx_type_enum_old" USING "tx_type"::"text"::"public"."contract_tx_histories_tx_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."contract_tx_histories_tx_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."contract_tx_histories_tx_type_enum_old" RENAME TO "contract_tx_histories_tx_type_enum"`);
    }

}
