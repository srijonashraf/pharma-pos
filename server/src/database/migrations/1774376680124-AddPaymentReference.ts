import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentReference1774376680124 implements MigrationInterface {
    name = 'AddPaymentReference1774376680124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD "reference" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "reference"`);
    }

}
