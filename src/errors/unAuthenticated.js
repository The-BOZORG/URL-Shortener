import { CustomError } from './customError.js';
import { StatusCodes } from 'http-status-codes';

//401
export class UnAuthenticatedError extends CustomError {
  constructor(message, details) {
    super(message, StatusCodes.UNAUTHORIZED, details);

    this.name = 'UnAuthenticated';
  }

  serializeError() {
    return {
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}
