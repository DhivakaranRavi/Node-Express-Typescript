import { App } from './app/app';
import { getConnectionManager } from 'typeorm';
import { join } from 'path';
import { dbConfig } from './app/ormconfig';
import { config } from 'dotenv';
import { SchoolController } from './app/controllers';
import { logger } from './app/utils/logger';

config({ path: join(__dirname, '../.env') });
const log = logger();
const connectionManager = getConnectionManager();
const connection = connectionManager.create(dbConfig);
const app = new App([new SchoolController()], process.env.PORT);

// database connection
connection
  .connect()
  .then(() => {
    app.listen();
  })
  .catch(error => {
    log.info('database connection failed..', error);
  });
