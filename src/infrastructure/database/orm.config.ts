import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
dotenv.config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_DATABASE'),
  entities: ['src/domain/entities/*.entity.ts'],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
