import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751904802670 implements MigrationInterface {
  name = 'Migration1751904802670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('income', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_source_enum" AS ENUM('manual', 'sync', 'import')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "transactionId" integer, "date" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(15,2) NOT NULL, "description" character varying NOT NULL, "type" "public"."transaction_type_enum" NOT NULL DEFAULT 'expense', "category" character varying, "source" "public"."transaction_source_enum" NOT NULL DEFAULT 'manual', "externalTransactionId" character varying, "isReconciled" boolean NOT NULL DEFAULT false, "balanceAfter" numeric(15,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "walletId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet_modules" ("moduleId" SERIAL NOT NULL, "moduleName" character varying(100) NOT NULL, "moduleConfigFormat" jsonb NOT NULL, "moduleCallURL" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_25d239e3a0485bef355a49d53ac" PRIMARY KEY ("moduleId")); COMMENT ON COLUMN "wallet_modules"."moduleConfigFormat" IS '存放該模組設定檔格式，如銀行帳號密碼或交易所Token的格式等'`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet_config" ("configId" SERIAL NOT NULL, "moduleId" integer NOT NULL, "userId" integer NOT NULL, "moduleConfigData" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a1dbf406f4a88960ba5aa03b66c" PRIMARY KEY ("configId")); COMMENT ON COLUMN "wallet_config"."moduleConfigData" IS '以關聯之錢包模組Format所存放之設定檔，如銀行帳號密碼或交易所Token等'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_wallettype_enum" AS ENUM('manual', 'sync')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_operationmode_enum" AS ENUM('manual_only', 'sync_only', 'hybrid')`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "walletName" character varying NOT NULL, "accountNumber" character varying NOT NULL, "walletType" "public"."wallet_wallettype_enum" NOT NULL DEFAULT 'manual', "walletColor" character varying, "initialBalance" numeric(15,2) NOT NULL DEFAULT '0', "operationMode" "public"."wallet_operationmode_enum" NOT NULL DEFAULT 'hybrid', "walletConfigId" integer, "lastSynced" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(20) NOT NULL, "email" character varying NOT NULL, "password" jsonb NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_config" ADD CONSTRAINT "FK_c76a5150ad50115c0aa84f4a21b" FOREIGN KEY ("moduleId") REFERENCES "wallet_modules"("moduleId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_config" ADD CONSTRAINT "FK_242eada57ff48d945e99245db14" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_184ce9e1457d72082097e3bc6dc" FOREIGN KEY ("walletConfigId") REFERENCES "wallet_config"("configId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_184ce9e1457d72082097e3bc6dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_config" DROP CONSTRAINT "FK_242eada57ff48d945e99245db14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_config" DROP CONSTRAINT "FK_c76a5150ad50115c0aa84f4a21b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
    await queryRunner.query(`DROP TYPE "public"."wallet_operationmode_enum"`);
    await queryRunner.query(`DROP TYPE "public"."wallet_wallettype_enum"`);
    await queryRunner.query(`DROP TABLE "wallet_config"`);
    await queryRunner.query(`DROP TABLE "wallet_modules"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_source_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
  }
}
