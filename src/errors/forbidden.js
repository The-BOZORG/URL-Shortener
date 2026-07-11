import { CustomError } from './customError.js';
import { StatusCodes } from 'http-status-codes';

//403
export class ForbiddenError extends CustomError {
  constructor(message, details) {
    super(message, StatusCodes.FORBIDDEN, details);

    this.name = 'Forbidden';
  }

  serializeError() {
    return {
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}
