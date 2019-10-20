import { ConnectionOptions } from 'typeorm';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(__dirname, '../../.env') });

// orm configuration
export const dbConfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/entities/*{.ts,.js}'],
};
