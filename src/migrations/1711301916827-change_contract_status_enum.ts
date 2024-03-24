import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeContractStatusEnum1711301916827 implements MigrationInterface {
    name = 'ChangeContractStatusEnum1711301916827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."car_contracts_contract_status_enum" RENAME TO "car_contracts_contract_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."car_contracts_contract_status_enum" AS ENUM('approved', 'started', 'ended', 'canceled', 'rejected', 'waiting_approval')`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ALTER COLUMN "contract_status" TYPE "public"."car_contracts_contract_status_enum" USING "contract_status"::"text"::"public"."car_contracts_contract_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_contracts_contract_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."car_contracts_contract_status_enum_old" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ALTER COLUMN "contract_status" TYPE "public"."car_contracts_contract_status_enum_old" USING "contract_status"::"text"::"public"."car_contracts_contract_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."car_contracts_contract_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."car_contracts_contract_status_enum_old" RENAME TO "car_contracts_contract_status_enum"`);
    }

}
