import { logger } from '../utils/logger.js';
import { CustomError } from '../errors/customError.js';
import { BadRequestError } from '../errors/badRequest.js';
import { NotFoundError } from '../errors/notFound.js';
import { UnauthenticatedError } from '../errors/unAuthenticated.js';

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
  });

  // Validation Error
  if (err.name === 'ValidationError') {
    err = new BadRequestError(
      Object.values(err.errors)
        .map((item) => item.message)
        .join(', '),
    );
  }

  // Duplicate Error
  if (err.code === 11000) {
    err = new BadRequestError(
      `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`,
    );
  }

  // Cast Error
  if (err.name === 'CastError') {
    err = new NotFoundError(`No item found with id: ${err.value}`);
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    err = new UnauthenticatedError('Invalid token, please login again');
  }

  if (err.name === 'TokenExpiredError') {
    err = new UnauthenticatedError('Token expired, please login again');
  }

  // Invalid JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    err = new BadRequestError('Invalid JSON format');
  }

  if (err instanceof CustomError) {
    return res.status(err.status).json(err.serializeError());
  }

  return res.status(500).json({
    message: 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

export default errorHandler;
