import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDbTables1711225962367 implements MigrationInterface {
    name = 'CreateDbTables1711225962367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_login_informations" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "access_token" text, "refresh_token" text, "reset_password_token" text, CONSTRAINT "REL_dc7101df15cc2eaa46cdf4d95e" UNIQUE ("user_id"), CONSTRAINT "PK_281ed2226317b7169dd9834cb95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, "hash_password" character varying(255) NOT NULL, "phone_number" character varying(12) NOT NULL, "role" "public"."users_role_enum" NOT NULL, "status" "public"."users_status_enum" NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "post_id" integer NOT NULL, "star" integer NOT NULL, "comment" text NOT NULL, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "is_read" boolean NOT NULL, "content" character varying NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_features" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "detail" character varying NOT NULL, CONSTRAINT "PK_3170f28e047ca7806f4be877c45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract_tx_histories" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "contract_id" integer NOT NULL, "tx_hash" character varying NOT NULL, CONSTRAINT "PK_db8f50f4bd78fb0746d4e4498d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract_fulfillments" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "contract_id" integer NOT NULL, "has_over_limit_fee" boolean NOT NULL, "has_over_time_fee" boolean NOT NULL, "has_cleaning_fee" boolean NOT NULL, "has_deodorization_fee" boolean NOT NULL, "over_time_hours" integer NOT NULL, CONSTRAINT "PK_12395758c629bc5a43b6ac70ad3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_rental_posts" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "owner_id" integer NOT NULL, "post_status" "public"."car_rental_posts_post_status_enum" NOT NULL, "model" character varying NOT NULL, "seats" integer NOT NULL, "fuel" "public"."car_rental_posts_fuel_enum" NOT NULL, "description" text NOT NULL, "transmission" "public"."car_rental_posts_transmission_enum" NOT NULL, "brand" character varying NOT NULL, "license_plate" character varying NOT NULL, "price_per_day" integer NOT NULL, "mortgage" integer NOT NULL, "over_limit_fee" integer NOT NULL, "over_time_fee" integer NOT NULL, "cleaning_fee" integer NOT NULL, "deodorization_fee" integer NOT NULL, CONSTRAINT "PK_7cc9e3989f16f241f0c48c2a3d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_rental_post_images" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "post_id" integer NOT NULL, "image_url" character varying NOT NULL, CONSTRAINT "PK_32296dd4d66ad3e5e94ee996168" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_rental_post_features" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "post_id" integer NOT NULL, "car_feature_id" integer NOT NULL, CONSTRAINT "PK_b8270ab5aba0ec763100990b61a" PRIMARY KEY ("post_id", "car_feature_id"))`);
        await queryRunner.query(`CREATE TABLE "car_contracts" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "renter_id" integer NOT NULL, "owner_id" integer NOT NULL, "post_id" integer NOT NULL, "contract_status" "public"."car_contracts_contract_status_enum" NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "renter_wallet_address" character varying NOT NULL, "owner_wallet_address" character varying NOT NULL, "car_info_snapshot" text NOT NULL, "price_per_day" integer NOT NULL, "mortgage" integer NOT NULL, "over_limit_fee" integer NOT NULL, "over_time_fee" integer NOT NULL, "cleaning_fee" integer NOT NULL, "deodorization_fee" integer NOT NULL, "num_of_days" integer NOT NULL, CONSTRAINT "PK_d4e073c1f54a7db8b5a88f13975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_login_informations" ADD CONSTRAINT "FK_dc7101df15cc2eaa46cdf4d95ed" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_login_informations" DROP CONSTRAINT "FK_dc7101df15cc2eaa46cdf4d95ed"`);
        await queryRunner.query(`DROP TABLE "car_contracts"`);
        await queryRunner.query(`DROP TABLE "car_rental_post_features"`);
        await queryRunner.query(`DROP TABLE "car_rental_post_images"`);
        await queryRunner.query(`DROP TABLE "car_rental_posts"`);
        await queryRunner.query(`DROP TABLE "contract_fulfillments"`);
        await queryRunner.query(`DROP TABLE "contract_tx_histories"`);
        await queryRunner.query(`DROP TABLE "car_features"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_login_informations"`);
    }

}
