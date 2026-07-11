import { CustomError } from './customError.js';
import { StatusCodes } from 'http-status-codes';

//400
export class BadRequestError extends CustomError {
  constructor(message, details) {
    super(message, StatusCodes.BAD_REQUEST, details);

    this.name = 'BadRequest';
  }

  serializeError() {
    return {
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}
