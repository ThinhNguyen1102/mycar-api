import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeOwnerNullableInCarContract1711297850092 implements MigrationInterface {
    name = 'ChangeOwnerNullableInCarContract1711297850092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP CONSTRAINT "FK_e9abab32d7a70b957575cd0fe7b"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ALTER COLUMN "owner_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ALTER COLUMN "owner_wallet_address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD CONSTRAINT "FK_e9abab32d7a70b957575cd0fe7b" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP CONSTRAINT "FK_e9abab32d7a70b957575cd0fe7b"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ALTER COLUMN "owner_wallet_address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ALTER COLUMN "owner_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD CONSTRAINT "FK_e9abab32d7a70b957575cd0fe7b" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
