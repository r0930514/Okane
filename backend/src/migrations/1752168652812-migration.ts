import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1752168652812 implements MigrationInterface {
  name = 'Migration1752168652812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "exchange_rates" ("id" SERIAL NOT NULL, "fromCurrency" character varying(10) NOT NULL, "toCurrency" character varying(10) NOT NULL, "rate" numeric(20,8) NOT NULL, "bidRate" numeric(20,8), "askRate" numeric(20,8), "midRate" numeric(20,8), "rateType" character varying NOT NULL DEFAULT 'mid', "timestamp" TIMESTAMP NOT NULL, "validUntil" TIMESTAMP, "metadata" jsonb, "providerId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_33a614bad9e61956079d817ebe2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bdf46c79913ede923722ea676e" ON "exchange_rates" ("fromCurrency", "toCurrency", "providerId", "timestamp") `,
    );
    await queryRunner.query(
      `CREATE TABLE "exchange_rate_providers" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "displayName" character varying(200) NOT NULL, "description" character varying(500), "apiUrl" character varying(200), "apiConfig" jsonb, "isActive" boolean NOT NULL DEFAULT true, "priority" integer NOT NULL DEFAULT '0', "reliabilityScore" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1ac58cfd51b40bb31b7926ce086" UNIQUE ("name"), CONSTRAINT "PK_ad82e7a5f0b4a4c77ad3a5f7de1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "primaryCurrency" character varying(10) NOT NULL DEFAULT 'TWD'`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "preferences" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" ADD CONSTRAINT "FK_e222930b705702af88ecdf08d4f" FOREIGN KEY ("providerId") REFERENCES "exchange_rate_providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" DROP CONSTRAINT "FK_e222930b705702af88ecdf08d4f"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "preferences"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "primaryCurrency"`);
    await queryRunner.query(`DROP TABLE "exchange_rate_providers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bdf46c79913ede923722ea676e"`,
    );
    await queryRunner.query(`DROP TABLE "exchange_rates"`);
  }
}
