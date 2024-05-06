import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContractIdNotification1714964688539 implements MigrationInterface {
    name = 'AddContractIdNotification1714964688539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "contract_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "contract_id"`);
    }

}
