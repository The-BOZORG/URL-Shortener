import { CustomError } from './customError.js';
import { StatusCodes } from 'http-status-codes';

//404
export class NotFoundError extends CustomError {
  constructor(message, details) {
    super(message, StatusCodes.NOT_FOUND, details);

    this.name = 'NotFound';
  }

  serializeError() {
    return {
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}
