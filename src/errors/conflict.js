import { CustomError } from './customError.js';
import { StatusCodes } from 'http-status-codes';

//409
export class ConflictError extends CustomError {
  constructor(message, details) {
    super(message, StatusCodes.CONFLICT, details);

    this.name = 'Conflict';
  }

  serializeError() {
    return {
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}
