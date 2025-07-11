import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1752250265213 implements MigrationInterface {
  name = 'Migration1752250265213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_184ce9e1457d72082097e3bc6dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "transactionId"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "source"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_source_enum"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "externalTransactionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "isReconciled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "balanceAfter"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "currency"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "exchangeRate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "exchangeRateSource"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "amountInWalletCurrency"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "walletName"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "accountNumber"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "walletType"`);
    await queryRunner.query(`DROP TYPE "public"."wallet_wallettype_enum"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "walletColor"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP COLUMN "initialBalance"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "operationMode"`);
    await queryRunner.query(`DROP TYPE "public"."wallet_operationmode_enum"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP COLUMN "walletConfigId"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "lastSynced"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "relatedAsset" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "metadata" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "transferGroupId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "pairedTransactionId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "relatedWalletId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "color" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_type_enum" AS ENUM('cash', 'bank', 'stock', 'crypto', 'foreign_stock', 'card', 'receivable', 'payable')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "type" "public"."wallet_type_enum" NOT NULL DEFAULT 'cash'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "provider" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" ADD "config" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."transaction_type_enum" RENAME TO "transaction_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('income', 'expense', 'transfer', 'buy', 'sell', 'dividend', 'interest', 'receivable_create', 'receivable_collect', 'receivable_write_off', 'payable_create', 'payable_payment')`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum" USING "type"::"text"::"public"."transaction_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" SET DEFAULT 'expense'`,
    );
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum_old"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "walletId"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "walletId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "wallet" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "wallet_config" DROP CONSTRAINT "FK_242eada57ff48d945e99245db14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "wallet_config" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "wallet_config" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_b9a4c348dfef04a2a9a00f78547" FOREIGN KEY ("relatedWalletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_config" ADD CONSTRAINT "FK_242eada57ff48d945e99245db14" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet_config" DROP CONSTRAINT "FK_242eada57ff48d945e99245db14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_b9a4c348dfef04a2a9a00f78547"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet_config" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "wallet_config" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_config" ADD CONSTRAINT "FK_242eada57ff48d945e99245db14" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "wallet" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "wallet" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "walletId"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "walletId" integer`);
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum_old" AS ENUM('income', 'expense')`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum_old" USING "type"::"text"::"public"."transaction_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" SET DEFAULT 'expense'`,
    );
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."transaction_type_enum_old" RENAME TO "transaction_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "config"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "provider"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."wallet_type_enum"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "color"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "relatedWalletId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "pairedTransactionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "transferGroupId"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "metadata"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "relatedAsset"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" ADD "lastSynced" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "walletConfigId" integer`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_operationmode_enum" AS ENUM('manual_only', 'sync_only', 'hybrid')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "operationMode" "public"."wallet_operationmode_enum" NOT NULL DEFAULT 'hybrid'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "initialBalance" numeric(15,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "walletColor" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_wallettype_enum" AS ENUM('manual', 'sync')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "walletType" "public"."wallet_wallettype_enum" NOT NULL DEFAULT 'manual'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "accountNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "walletName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "amountInWalletCurrency" numeric(18,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "exchangeRateSource" character varying NOT NULL DEFAULT 'manual'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "exchangeRate" numeric(18,6)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "currency" character varying NOT NULL DEFAULT 'TWD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "balanceAfter" numeric(15,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "isReconciled" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "externalTransactionId" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_source_enum" AS ENUM('manual', 'sync', 'import')`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "source" "public"."transaction_source_enum" NOT NULL DEFAULT 'manual'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "transactionId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_184ce9e1457d72082097e3bc6dc" FOREIGN KEY ("walletConfigId") REFERENCES "wallet_config"("configId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
