import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/index';

export function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  response.status(error.code ? error.code : 400).send({
    message: error.message ? error.message : 'Invaild JSON Format',
  });
}
