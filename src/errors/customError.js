export class CustomError extends Error {
  constructor(message, status, details) {
    super(message);

    this.status = status;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  serializeError() {
    throw new Error('serializeError() must be implemented');
  }
}
