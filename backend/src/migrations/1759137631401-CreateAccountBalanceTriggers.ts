import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountBalanceTriggers1759137631401
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 創建重新計算帳戶餘額的函數
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION recalculate_account_balance()
      RETURNS TRIGGER AS $$
      DECLARE
        account_id_to_update UUID;
        total_balance DECIMAL(15,2);
      BEGIN
        -- 根據觸發器類型決定要更新的帳戶 ID
        IF TG_OP = 'DELETE' THEN
          account_id_to_update := OLD."accountId";
        ELSE
          account_id_to_update := NEW."accountId";
        END IF;

        -- 計算該帳戶的總餘額（所有交易金額的總和）
        SELECT COALESCE(SUM(amount), 0)
        INTO total_balance
        FROM transaction
        WHERE "accountId" = account_id_to_update;

        -- 更新帳戶的餘額欄位
        UPDATE account
        SET balance = total_balance
        WHERE id = account_id_to_update;

        -- 回傳適當的記錄
        IF TG_OP = 'DELETE' THEN
          RETURN OLD;
        ELSE
          RETURN NEW;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 創建交易新增時的觸發器
    await queryRunner.query(`
      CREATE TRIGGER transaction_insert_trigger
      AFTER INSERT ON transaction
      FOR EACH ROW
      EXECUTE FUNCTION recalculate_account_balance();
    `);

    // 創建交易更新時的觸發器
    await queryRunner.query(`
      CREATE TRIGGER transaction_update_trigger
      AFTER UPDATE ON transaction
      FOR EACH ROW
      EXECUTE FUNCTION recalculate_account_balance();
    `);

    // 創建交易刪除時的觸發器
    await queryRunner.query(`
      CREATE TRIGGER transaction_delete_trigger
      AFTER DELETE ON transaction
      FOR EACH ROW
      EXECUTE FUNCTION recalculate_account_balance();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 移除觸發器
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS transaction_delete_trigger ON transaction;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS transaction_update_trigger ON transaction;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS transaction_insert_trigger ON transaction;`,
    );

    // 移除函數
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS recalculate_account_balance();`,
    );
  }
}
