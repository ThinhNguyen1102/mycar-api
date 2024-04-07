import { MigrationInterface, QueryRunner } from "typeorm";

export class CarRentalPostsRequireYearConsumptionField1712504130661 implements MigrationInterface {
    name = 'CarRentalPostsRequireYearConsumptionField1712504130661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ALTER COLUMN "consumption" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ALTER COLUMN "year" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ALTER COLUMN "year" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ALTER COLUMN "consumption" DROP NOT NULL`);
    }

}
