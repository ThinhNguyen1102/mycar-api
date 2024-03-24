import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelations1711276445701 implements MigrationInterface {
    name = 'AddRelations1711276445701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "car_rental_post_addresses" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "post_id" integer NOT NULL, "district_name" character varying NOT NULL, "prefecture_name" character varying NOT NULL, CONSTRAINT "REL_501311c6a083496c651e19143c" UNIQUE ("post_id"), CONSTRAINT "PK_43e2efa763cace03f121b8439b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_images" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "post_id" integer NOT NULL, "image_url" character varying NOT NULL, CONSTRAINT "PK_f7870496c0b0f5a8894cab2bde3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "contract_id" integer`);
        await queryRunner.query(`ALTER TABLE "contract_fulfillments" ADD "other_fee" integer`);
        await queryRunner.query(`ALTER TABLE "contract_fulfillments" ADD "other_fee_detail" text`);
        await queryRunner.query(`ALTER TABLE "contract_fulfillments" ADD CONSTRAINT "UQ_a25bbc5758e00a16defa06d26c9" UNIQUE ("contract_id")`);
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
        await queryRunner.query(`ALTER TABLE "contract_fulfillments" DROP CONSTRAINT "UQ_a25bbc5758e00a16defa06d26c9"`);
        await queryRunner.query(`ALTER TABLE "contract_fulfillments" DROP COLUMN "other_fee_detail"`);
        await queryRunner.query(`ALTER TABLE "contract_fulfillments" DROP COLUMN "other_fee"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "contract_id"`);
        await queryRunner.query(`DROP TABLE "car_images"`);
        await queryRunner.query(`DROP TABLE "car_rental_post_addresses"`);
    }

}
