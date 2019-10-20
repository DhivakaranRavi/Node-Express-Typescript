import { ConnectionOptions } from 'typeorm';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(__dirname, '../../.env') });

// orm configuration
export const dbConfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/entities/*{.ts,.js}'],
};
