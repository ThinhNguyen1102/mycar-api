import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaInit1715961244649 implements MigrationInterface {
    name = 'SchemaInit1715961244649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_login_informations" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "access_token" text, "refresh_token" text, "reset_password_token" text, CONSTRAINT "REL_dc7101df15cc2eaa46cdf4d95e" UNIQUE ("user_id"), CONSTRAINT "PK_281ed2226317b7169dd9834cb95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_rental_post_addresses" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "post_id" integer NOT NULL, "district_name" character varying NOT NULL, "prefecture_name" character varying NOT NULL, CONSTRAINT "REL_501311c6a083496c651e19143c" UNIQUE ("post_id"), CONSTRAINT "PK_43e2efa763cace03f121b8439b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_images" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "post_id" integer NOT NULL, "image_url" character varying NOT NULL, CONSTRAINT "PK_f7870496c0b0f5a8894cab2bde3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_features" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "detail" character varying NOT NULL, CONSTRAINT "PK_3170f28e047ca7806f4be877c45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_rental_post_features" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "post_id" integer NOT NULL, "car_feature_id" integer NOT NULL, CONSTRAINT "PK_b8270ab5aba0ec763100990b61a" PRIMARY KEY ("post_id", "car_feature_id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "post_id" integer NOT NULL, "star" integer NOT NULL, "comment" text NOT NULL, "contract_id" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract_fulfillments" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "contract_id" integer NOT NULL, "has_over_limit_fee" boolean NOT NULL, "has_over_time_fee" boolean NOT NULL, "has_cleaning_fee" boolean NOT NULL, "has_deodorization_fee" boolean NOT NULL, "over_time_hours" integer NOT NULL, "over_limit_km" integer NOT NULL, "other_fee" integer, "other_fee_detail" text, CONSTRAINT "REL_a25bbc5758e00a16defa06d26c" UNIQUE ("contract_id"), CONSTRAINT "PK_12395758c629bc5a43b6ac70ad3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."contract_tx_histories_tx_type_enum" AS ENUM('pay', 'createContract', 'refund', 'refundOwnerReject', 'refundOwnerCancel', 'refundRentalCancel', 'startContract', 'endContract')`);
        await queryRunner.query(`CREATE TABLE "contract_tx_histories" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "contract_id" integer NOT NULL, "tx_hash" character varying NOT NULL, "tx_type" "public"."contract_tx_histories_tx_type_enum" NOT NULL, "tx_value" double precision NOT NULL, CONSTRAINT "PK_db8f50f4bd78fb0746d4e4498d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."car_contracts_contract_status_enum" AS ENUM('approved', 'started', 'ended', 'canceled', 'rejected', 'waiting_approval')`);
        await queryRunner.query(`CREATE TABLE "car_contracts" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "renter_id" integer NOT NULL, "owner_id" integer NOT NULL, "post_id" integer NOT NULL, "contract_status" "public"."car_contracts_contract_status_enum" NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "renter_wallet_address" character varying, "owner_wallet_address" character varying, "car_info_snapshot" text NOT NULL, "price_per_day" double precision NOT NULL, "mortgage" double precision NOT NULL, "over_limit_fee" double precision NOT NULL, "over_time_fee" double precision NOT NULL, "cleaning_fee" double precision NOT NULL, "deodorization_fee" double precision NOT NULL, "num_of_days" integer NOT NULL, "is_processing" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d4e073c1f54a7db8b5a88f13975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."car_rental_posts_post_status_enum" AS ENUM('registering', 'published', 'hidden')`);
        await queryRunner.query(`CREATE TYPE "public"."car_rental_posts_fuel_enum" AS ENUM('gasoline', 'diesel', 'electric')`);
        await queryRunner.query(`CREATE TYPE "public"."car_rental_posts_transmission_enum" AS ENUM('auto', 'manual')`);
        await queryRunner.query(`CREATE TABLE "car_rental_posts" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "owner_id" integer NOT NULL, "post_status" "public"."car_rental_posts_post_status_enum" NOT NULL, "model" character varying NOT NULL, "seats" integer NOT NULL, "fuel" "public"."car_rental_posts_fuel_enum" NOT NULL, "consumption" integer NOT NULL, "year" integer NOT NULL, "description" text NOT NULL, "transmission" "public"."car_rental_posts_transmission_enum" NOT NULL, "brand" character varying NOT NULL, "license_plate" character varying NOT NULL, "price_per_day" double precision NOT NULL, "mortgage" double precision NOT NULL, "over_limit_fee" double precision NOT NULL, "over_time_fee" double precision NOT NULL, "cleaning_fee" double precision NOT NULL, "deodorization_fee" double precision NOT NULL, CONSTRAINT "PK_7cc9e3989f16f241f0c48c2a3d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('error', 'warning', 'info', 'success')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "contract_id" integer, "is_read" boolean NOT NULL, "content" character varying NOT NULL, "title" character varying NOT NULL, "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'info', CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'blocked')`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, "hash_password" character varying(255) NOT NULL, "phone_number" character varying(12) NOT NULL, "role" "public"."users_role_enum" NOT NULL, "status" "public"."users_status_enum" NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_login_informations" ADD CONSTRAINT "FK_dc7101df15cc2eaa46cdf4d95ed" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_rental_post_addresses" ADD CONSTRAINT "FK_501311c6a083496c651e19143ce" FOREIGN KEY ("post_id") REFERENCES "car_rental_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_images" ADD CONSTRAINT "FK_d00718b0489fdd56b8234ca0ded" FOREIGN KEY ("post_id") REFERENCES "car_rental_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_rental_post_features" ADD CONSTRAINT "FK_17c45b16455f1659b4ccce94f50" FOREIGN KEY ("post_id") REFERENCES "car_rental_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_rental_post_features" ADD CONSTRAINT "FK_58c7eef2701347bbdf7d133d94c" FOREIGN KEY ("car_feature_id") REFERENCES "car_features"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_9a032e4aa0c5b665fbcf3044dc2" FOREIGN KEY ("post_id") REFERENCES "car_rental_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_d524fbe85d4619f66b10a664487" FOREIGN KEY ("contract_id") REFERENCES "car_contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_fulfillments" ADD CONSTRAINT "FK_a25bbc5758e00a16defa06d26c9" FOREIGN KEY ("contract_id") REFERENCES "car_contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" ADD CONSTRAINT "FK_02b80f536e1943b05cd161c138d" FOREIGN KEY ("contract_id") REFERENCES "car_contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD CONSTRAINT "FK_bb8c1ab7e24ef93deb463fd8516" FOREIGN KEY ("post_id") REFERENCES "car_rental_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD CONSTRAINT "FK_e9abab32d7a70b957575cd0fe7b" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_contracts" ADD CONSTRAINT "FK_a672dc38662010b2c51f336505f" FOREIGN KEY ("renter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" ADD CONSTRAINT "FK_080171afcaaaef4ab29c16df869" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "car_rental_posts" DROP CONSTRAINT "FK_080171afcaaaef4ab29c16df869"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP CONSTRAINT "FK_a672dc38662010b2c51f336505f"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP CONSTRAINT "FK_e9abab32d7a70b957575cd0fe7b"`);
        await queryRunner.query(`ALTER TABLE "car_contracts" DROP CONSTRAINT "FK_bb8c1ab7e24ef93deb463fd8516"`);
        await queryRunner.query(`ALTER TABLE "contract_tx_histories" DROP CONSTRAINT "FK_02b80f536e1943b05cd161c138d"`);
        await queryRunner.query(`ALTER TABLE "contract_fulfillments" DROP CONSTRAINT "FK_a25bbc5758e00a16defa06d26c9"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_d524fbe85d4619f66b10a664487"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_9a032e4aa0c5b665fbcf3044dc2"`);
        await queryRunner.query(`ALTER TABLE "car_rental_post_features" DROP CONSTRAINT "FK_58c7eef2701347bbdf7d133d94c"`);
        await queryRunner.query(`ALTER TABLE "car_rental_post_features" DROP CONSTRAINT "FK_17c45b16455f1659b4ccce94f50"`);
        await queryRunner.query(`ALTER TABLE "car_images" DROP CONSTRAINT "FK_d00718b0489fdd56b8234ca0ded"`);
        await queryRunner.query(`ALTER TABLE "car_rental_post_addresses" DROP CONSTRAINT "FK_501311c6a083496c651e19143ce"`);
        await queryRunner.query(`ALTER TABLE "user_login_informations" DROP CONSTRAINT "FK_dc7101df15cc2eaa46cdf4d95ed"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "car_rental_posts"`);
        await queryRunner.query(`DROP TYPE "public"."car_rental_posts_transmission_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_rental_posts_fuel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_rental_posts_post_status_enum"`);
        await queryRunner.query(`DROP TABLE "car_contracts"`);
        await queryRunner.query(`DROP TYPE "public"."car_contracts_contract_status_enum"`);
        await queryRunner.query(`DROP TABLE "contract_tx_histories"`);
        await queryRunner.query(`DROP TYPE "public"."contract_tx_histories_tx_type_enum"`);
        await queryRunner.query(`DROP TABLE "contract_fulfillments"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "car_rental_post_features"`);
        await queryRunner.query(`DROP TABLE "car_features"`);
        await queryRunner.query(`DROP TABLE "car_images"`);
        await queryRunner.query(`DROP TABLE "car_rental_post_addresses"`);
        await queryRunner.query(`DROP TABLE "user_login_informations"`);
    }

}
