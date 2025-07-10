import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751906333310 implements MigrationInterface {
  name = 'Migration1751906333310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "currency" character varying NOT NULL DEFAULT 'TWD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "exchangeRate" numeric(18,6)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "exchangeRateSource" character varying NOT NULL DEFAULT 'manual'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "amountInWalletCurrency" numeric(18,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "currency" character varying NOT NULL DEFAULT 'TWD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "secondaryCurrency" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP COLUMN "secondaryCurrency"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "currency"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "amountInWalletCurrency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "exchangeRateSource"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "exchangeRate"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "currency"`);
  }
}
