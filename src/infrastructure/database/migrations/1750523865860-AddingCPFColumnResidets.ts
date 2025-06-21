import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddingCPFColumnResidets1750523865860
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'residents',
      new TableColumn({
        name: 'cpf',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('residents', 'cpf');
  }
}
