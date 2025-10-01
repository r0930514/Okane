import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1759312548325 implements MigrationInterface {
    name = 'Migration1759312548325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 先新增臨時欄位儲存舊的 type 值
        await queryRunner.query(`ALTER TABLE "account" ADD "type_temp" character varying`);
        await queryRunner.query(`UPDATE "account" SET "type_temp" = "type"::text`);

        // 遷移 accountableData 到對應的欄位
        await queryRunner.query(`ALTER TABLE "account" ADD "bankName" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ADD "accountNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ADD "notes" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ADD "walletAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ADD "network" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ADD "protocol" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ADD "publicKey" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ADD "walletType" character varying`);

        // 遷移銀行帳戶資料
        await queryRunner.query(`
            UPDATE "account"
            SET "bankName" = "accountableData"->>'bankName',
                "accountNumber" = "accountableData"->>'accountNumber'
            WHERE "type" = 'bank'
        `);

        // 遷移現金帳戶資料
        await queryRunner.query(`
            UPDATE "account"
            SET "location" = "accountableData"->>'location',
                "notes" = "accountableData"->>'notes'
            WHERE "type" = 'cash'
        `);

        // 遷移加密貨幣帳戶資料
        await queryRunner.query(`
            UPDATE "account"
            SET "walletAddress" = "accountableData"->>'walletAddress',
                "network" = "accountableData"->>'network',
                "protocol" = "accountableData"->>'protocol',
                "publicKey" = "accountableData"->>'publicKey',
                "walletType" = "accountableData"->>'walletType'
            WHERE "type" = 'crypto'
        `);

        // 刪除 accountableData 欄位
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountableData"`);

        // 更新餘額預設值
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "balance" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "availableBalance" SET DEFAULT '0'`);

        // 刪除舊的 type 欄位和 enum 類型
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."account_type_enum"`);

        // 將臨時欄位改名為 type
        await queryRunner.query(`ALTER TABLE "account" RENAME COLUMN "type_temp" TO "type"`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "type" SET NOT NULL`);

        // 建立索引
        await queryRunner.query(`CREATE INDEX "IDX_3c76f178c5065d1ab304b5832e" ON "account" ("type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3c76f178c5065d1ab304b5832e"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."account_type_enum" AS ENUM('bank', 'cash', 'crypto')`);
        await queryRunner.query(`ALTER TABLE "account" ADD "type" "public"."account_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "availableBalance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "balance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "walletType"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "publicKey"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "protocol"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "network"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "walletAddress"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountNumber"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "bankName"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "accountableData" jsonb`);
    }

}
