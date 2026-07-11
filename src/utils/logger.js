import winston from 'winston';
const { combine, timestamp, colorize, align, errors, printf, json } =
  winston.format;

import { config } from '../config/index.js';

const transports = [];

if (config.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        align(),
        errors({ stack: true }),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta, null, 2)}`
            : '';

          return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
        }),
      ),
    }),
  );
} else {
  transports.push(
    new winston.transports.File({
      filename: 'logs/app.log',
    }),
  );
}

export const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
    errors({ stack: true }),
    json(),
  ),
  transports,
  silent: config.NODE_ENV === 'test',
});
