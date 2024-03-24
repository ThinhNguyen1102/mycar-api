import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDatatypeCarCotractCarRentalPost1711293632269 implements MigrationInterface {
    name = 'ChangeDatatypeCarCotractCarRentalPost1711293632269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "price_per_day"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "price_per_day" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "mortgage"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "mortgage" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "over_limit_fee"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "over_limit_fee" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "over_time_fee"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "over_time_fee" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "cleaning_fee"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "cleaning_fee" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "deodorization_fee"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "deodorization_fee" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "price_per_day"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "price_per_day" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "mortgage"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "mortgage" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "over_limit_fee"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "over_limit_fee" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "over_time_fee"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "over_time_fee" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "cleaning_fee"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "cleaning_fee" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "deodorization_fee"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "deodorization_fee" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "deodorization_fee"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "deodorization_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "cleaning_fee"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "cleaning_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "over_time_fee"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "over_time_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "over_limit_fee"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "over_limit_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "mortgage"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "mortgage" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP COLUMN "price_per_day"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD "price_per_day" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "deodorization_fee"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "deodorization_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "cleaning_fee"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "cleaning_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "over_time_fee"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "over_time_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "over_limit_fee"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "over_limit_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "mortgage"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "mortgage" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP COLUMN "price_per_day"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD "price_per_day" integer NOT NULL`);
    }

}
