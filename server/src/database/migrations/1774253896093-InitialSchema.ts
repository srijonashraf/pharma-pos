import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1774253896093 implements MigrationInterface {
  name = 'InitialSchema1774253896093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(20) NOT NULL DEFAULT 'individual', "name" character varying(200) NOT NULL, "display_name" character varying(200), "phone" character varying(20), "email" character varying(150), "address" text, "is_walking" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_number" character varying(30) NOT NULL, "customer_id" uuid, "subtotal" numeric(12,2) NOT NULL, "discount_amount" numeric(12,2) NOT NULL DEFAULT '0', "vat_amount" numeric(12,2) NOT NULL DEFAULT '0', "adjustment" numeric(12,2) NOT NULL DEFAULT '0', "total_amount" numeric(12,2) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'draft', "note" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_75eba1c6b1a66b09f2a97e6927b" UNIQUE ("order_number"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "method" character varying(20) NOT NULL, "amount_taken" numeric(12,2) NOT NULL DEFAULT '0', "amount_paid" numeric(12,2) NOT NULL, "amount_return" numeric(12,2) NOT NULL DEFAULT '0', "amount_due" numeric(12,2) NOT NULL DEFAULT '0', "status" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medicines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "generic_name" character varying(200), "barcode" character varying(100), "brand" character varying(150), "category" character varying(100), "unit" character varying(30) NOT NULL DEFAULT 'Pcs', "price" numeric(10,2) NOT NULL, "discount_pct" numeric(5,2) NOT NULL DEFAULT '0', "stock" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5b1334d794bdf0ec82799a832f7" UNIQUE ("barcode"), CONSTRAINT "PK_77b93851766f7ab93f71f44b18b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "medicine_id" uuid NOT NULL, "medicine_name" character varying(200) NOT NULL, "unit" character varying(30) NOT NULL, "unit_price" numeric(10,2) NOT NULL, "discount_pct" numeric(5,2) NOT NULL DEFAULT '0', "quantity" integer NOT NULL, "subtotal" numeric(12,2) NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_fd56e1272f31809a76488cb65de" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_fd56e1272f31809a76488cb65de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_b2f7b823a21562eeca20e72b006"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`,
    );
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "medicines"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
