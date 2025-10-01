import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759313510440 implements MigrationInterface {
  name = 'Migration1759313510440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP COLUMN "availableBalance"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ADD "availableBalance" numeric(15,2) NOT NULL DEFAULT '0'`,
    );
  }
}
