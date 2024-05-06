import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeNotification1714974021363 implements MigrationInterface {
    name = 'AddTypeNotification1714974021363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('error', 'warning', 'info', 'success')`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'info'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    }

}
