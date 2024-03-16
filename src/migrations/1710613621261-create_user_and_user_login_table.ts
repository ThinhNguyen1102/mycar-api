import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAndUserLoginTable1710613621261 implements MigrationInterface {
    name = 'CreateUserAndUserLoginTable1710613621261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_login_informations" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "access_token" text, "refresh_token" text, "reset_password_token" text, CONSTRAINT "REL_dc7101df15cc2eaa46cdf4d95e" UNIQUE ("user_id"), CONSTRAINT "PK_281ed2226317b7169dd9834cb95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, "hash_password" character varying(255) NOT NULL, "phone_number" character varying(12) NOT NULL, "role" "public"."users_role_enum" NOT NULL, "status" "public"."users_status_enum" NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_login_informations" ADD CONSTRAINT "FK_dc7101df15cc2eaa46cdf4d95ed" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_login_informations" DROP CONSTRAINT "FK_dc7101df15cc2eaa46cdf4d95ed"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_login_informations"`);
    }

}
