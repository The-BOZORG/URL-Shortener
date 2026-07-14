import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { config } from './config/index.js';

import router from './routes/index.js';

import errorHandler from './middlewares/errorHandler.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

const app = express();

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);

app.use(helmet());

app.use(
  cors({
    origin: config.CORS_WHITELIST,
    credentials: true,
  }),
);

app.use(morgan('dev'));

app.use(compression({ threshold: 1024 }));

app.use(cookieParser());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use(errorHandler);

app.use((req, res, next) => {
  const error = new Error('Route does not exist');
  error.statusCode = 404;
  next(error);
});

export default app;
