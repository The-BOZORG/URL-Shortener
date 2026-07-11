import { CustomError } from './customError.js';
import { StatusCodes } from 'http-status-codes';

//500
export class InternalServerError extends CustomError {
  constructor(message, details) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, details);

    this.name = 'InternalServer';
  }

  serializeError() {
    return {
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}
