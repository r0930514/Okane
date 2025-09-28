import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759050680006 implements MigrationInterface {
  name = 'Migration1759050680006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."account_classification_enum" AS ENUM('asset', 'liability')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_status_enum" AS ENUM('active', 'draft', 'disabled', 'pending_deletion')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_type_enum" AS ENUM('bank', 'cash', 'crypto')`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "balance" numeric(15,2) NOT NULL, "availableBalance" numeric(15,2) NOT NULL, "currency" character varying(3) NOT NULL, "classification" "public"."account_classification_enum", "status" "public"."account_status_enum" NOT NULL DEFAULT 'active', "type" "public"."account_type_enum" NOT NULL, "accountableData" jsonb, "userId" uuid, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(20) NOT NULL, "email" character varying NOT NULL, "password" jsonb NOT NULL, "primaryCurrency" character varying(10) NOT NULL DEFAULT 'TWD', "preferences" jsonb, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(15,2) NOT NULL, "description" character varying NOT NULL, "metadata" jsonb DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_3d6e89b14baa44a71870450d14d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_3d6e89b14baa44a71870450d14d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TYPE "public"."account_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."account_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."account_classification_enum"`);
  }
}
