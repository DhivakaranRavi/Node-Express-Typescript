import { HttpException } from './index';

export class Exception extends HttpException {
  constructor(code: number, message: string) {
    super(code, message);
  }
}
