import { NextFunction, Request, Response } from 'express';

export function redisMiddleware() {
  return (request: Request, response: Response, next: NextFunction) => {
    let key = process.env.REDIS_KEY + request.originalUrl || request.url;
    request['redis_key'] = key;
    request['redis'].get(key, (err, reply) => {
      if (reply) {
        response.status(200).json(JSON.parse(reply));
      } else {
        next();
      }
    });
  };
}
