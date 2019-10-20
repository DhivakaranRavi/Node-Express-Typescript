export class HttpException extends Error {
  public code: number;
  public message: any;
  constructor(code: number, message: any) {
    super(message);
    this.code = code;
  }
}
