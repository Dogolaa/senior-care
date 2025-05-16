import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InsertInitialData1745630257040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await bcrypt.hash('Admin@123', 10);

    await queryRunner.query(`
      INSERT INTO "role" ("id", "name") VALUES
      ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'ADMIN'),
      ('11111111-1111-1111-1111-111111111112', 'USER'),
      ('11111111-1111-1111-1111-111111111113', 'GUEST');
    `);

    await queryRunner.query(`
        INSERT INTO "permissions" ("id", "permissionName") VALUES
        ('11111111-1111-1111-1111-111111111114', 'READ'),
        ('11111111-1111-1111-1111-111111111115', 'WRITE'),
        ('11111111-1111-1111-1111-111111111116', 'DELETE');
      `);

    await queryRunner.query(`
      INSERT INTO "address" ("id", "cep", "country", "state", "city", "district", "street", "number", "complement") VALUES
      ('d290f1ee-6c54-4b01-90e6-d701748f0851', '12345678', 'Brasil', 'SP', 'São Paulo', 'Centro', 'Rua A', 100, 'Apto 101');
    `);

    await queryRunner.query(`
      INSERT INTO "users" ("id", "name", "email", "cpf", "phone", "isActive", "password", "addressId", "roleId") VALUES
      ('11111111-1111-1111-1111-111111111118', 'João da Silva', 'joao@exemplo.com', '50894118837' , '999999999', true, '${password}', 
      (SELECT "id" FROM "address" WHERE "cep" = '12345678' LIMIT 1), 
      (SELECT "id" FROM "role" WHERE "name" = 'ADMIN' LIMIT 1));
    `);

    await queryRunner.query(`
      INSERT INTO "rolePermissions" ("roleId", "permissionId") VALUES
      ((SELECT "id" FROM "role" WHERE "name" = 'ADMIN' LIMIT 1), 
      (SELECT "id" FROM "permissions" WHERE "permissionName" = 'READ' LIMIT 1)),
      ((SELECT "id" FROM "role" WHERE "name" = 'ADMIN' LIMIT 1), 
      (SELECT "id" FROM "permissions" WHERE "permissionName" = 'WRITE' LIMIT 1)),
      ((SELECT "id" FROM "role" WHERE "name" = 'USER' LIMIT 1), 
      (SELECT "id" FROM "permissions" WHERE "permissionName" = 'READ' LIMIT 1));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "rolePermissions";');
    await queryRunner.query('DELETE FROM "users";');
    await queryRunner.query('DELETE FROM "address";');
    await queryRunner.query('DELETE FROM "permissions";');
    await queryRunner.query('DELETE FROM "role";');
  }
}
