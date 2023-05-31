export class CustomError extends Error {
  status = 400;
  constructor(message: string, status: number) {
    super();
    this.message = message;
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}
