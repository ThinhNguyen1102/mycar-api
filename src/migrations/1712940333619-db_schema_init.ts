import { MigrationInterface, QueryRunner } from "typeorm";

export class DbSchemaInit1712940333619 implements MigrationInterface {
    name = 'DbSchemaInit1712940333619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_fulfillments" ADD "over_limit_km" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_fulfillments" DROP COLUMN "over_limit_km"`);
    }

}
