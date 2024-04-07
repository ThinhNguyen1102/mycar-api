import { MigrationInterface, QueryRunner } from "typeorm";

export class CarRentalPostsAddYearConsumptionField1712503835160 implements MigrationInterface {
    name = 'CarRentalPostsAddYearConsumptionField1712503835160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "consumption" integer`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "year" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "consumption"`);
    }

}
