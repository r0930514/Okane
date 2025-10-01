import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759153196804 implements MigrationInterface {
  name = 'Migration1759153196804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ADD "color" character varying NOT NULL DEFAULT '#374151'`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD "icon" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "icon"`);
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "color"`);
  }
}
