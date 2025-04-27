import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatingInitialTables1745630257039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'addressId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'roleId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'enum',
            enum: ['ADMIN', 'USER', 'GUEST'],
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'rolePermissions',
        columns: [
          {
            name: 'roleId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'permissionId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'permissionName',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'address',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'cep',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'country',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'district',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'street',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'number',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'complement',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['addressId'],
        referencedTableName: 'address',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedTableName: 'role',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'rolePermissions',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedTableName: 'role',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'rolePermissions',
      new TableForeignKey({
        columnNames: ['permissionId'],
        referencedTableName: 'permissions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableUsers = await queryRunner.getTable('users');
    if (tableUsers) {
      const foreignKeyAddress = tableUsers.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('addressId') !== -1,
      );
      const foreignKeyRole = tableUsers.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('roleId') !== -1,
      );
      if (foreignKeyAddress) {
        await queryRunner.dropForeignKey('users', foreignKeyAddress);
      }
      if (foreignKeyRole) {
        await queryRunner.dropForeignKey('users', foreignKeyRole);
      }
    }

    const tableRolePermissions = await queryRunner.getTable('rolePermissions');
    if (tableRolePermissions) {
      const foreignKeyRolePermissionsRole =
        tableRolePermissions.foreignKeys.find(
          (fk) => fk.columnNames.indexOf('roleId') !== -1,
        );
      const foreignKeyRolePermissionsPermission =
        tableRolePermissions.foreignKeys.find(
          (fk) => fk.columnNames.indexOf('permissionId') !== -1,
        );
      if (foreignKeyRolePermissionsRole) {
        await queryRunner.dropForeignKey(
          'rolePermissions',
          foreignKeyRolePermissionsRole,
        );
      }
      if (foreignKeyRolePermissionsPermission) {
        await queryRunner.dropForeignKey(
          'rolePermissions',
          foreignKeyRolePermissionsPermission,
        );
      }
    }

    await queryRunner.dropTable('rolePermissions');
    await queryRunner.dropTable('permissions');
    await queryRunner.dropTable('address');
    await queryRunner.dropTable('role');
    await queryRunner.dropTable('users');
  }
}
