import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1752706474858 implements MigrationInterface {
  name = 'Migration1752706474858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_b9a4c348dfef04a2a9a00f78547"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "category"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "relatedAsset"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "transferGroupId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "pairedTransactionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "relatedWalletId"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "color"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."wallet_type_enum"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "provider"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "config"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "metadata" jsonb DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "metadata" SET DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "metadata" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "metadata"`);
    await queryRunner.query(`ALTER TABLE "wallet" ADD "config" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "provider" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_type_enum" AS ENUM('cash', 'bank', 'stock', 'crypto', 'foreign_stock', 'card', 'receivable', 'payable')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "type" "public"."wallet_type_enum" NOT NULL DEFAULT 'cash'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "color" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "relatedWalletId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "pairedTransactionId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "transferGroupId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "relatedAsset" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "category" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('income', 'expense', 'transfer', 'buy', 'sell', 'dividend', 'interest', 'receivable_create', 'receivable_collect', 'receivable_write_off', 'payable_create', 'payable_payment')`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "type" "public"."transaction_type_enum" NOT NULL DEFAULT 'expense'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_b9a4c348dfef04a2a9a00f78547" FOREIGN KEY ("relatedWalletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
