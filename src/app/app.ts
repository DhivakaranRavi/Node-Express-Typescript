import 'reflect-metadata';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { logger } from './utils/logger';
import { errorMiddleware } from './middlewares/index';
import * as redis from 'redis';

export class App {
  public app: express.Application;
  public port: number;
  public logger: any;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;
    this.logger = logger();

    this.initializeMiddlewares();
    this.initializeRedis();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  // initialize middlewares
  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: '50mb' }));
    process.env.NODE_ENV == 'development'
      ? this.app.use(
          '/api-docs',
          express.static(path.join(__dirname, './api-docs')),
        )
      : null;
    this.app.use(bodyParser.urlencoded({ extended: false }));
    process.env.NODE_ENV == 'development'
      ? this.app.get('/swagger.json', function(req, res) {
          res.setHeader('Content-Type', 'application/json');
          res.send(
            swaggerJSDoc({
              swaggerDefinition: require('./api-docs/swagger.json'),
              apis: ['**/*.ts'],
            }),
          );
        })
      : null;
  }

  // initialize error handling
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  // initialize controllers
  private initializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use('', controller.router);
    });
  }

  // initialize redis
  private initializeRedis() {
    this.app.use(
      '',
      (request: Request, response: Response, next: NextFunction) => {
        request['redis'] = redis.createClient(
          process.env.REDIS_PORT,
          process.env.REDIS_HOST,
        );
        // request['redis'].on('connect', () => {
        //   this.logger.info('connected to redis server.');
        // });
        // request['redis'].on('error', error => {
        //   this.logger.info(`error redis connection:${error}`);
        // });
        next();
      },
    );
  }

  // server listen
  public listen() {
    return this.app.listen(this.port, () => {
      this.logger.info(`Application running on url 📡: ${process.env.DOMAIN}/`);
      process.env.NODE_ENV == 'development'
        ? this.logger.info(
            `Explore runing on url 📕 : ${process.env.DOMAIN}/api-docs/`,
          )
        : null;
    });
  }
}
