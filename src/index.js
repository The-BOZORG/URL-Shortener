import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';

import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(
  compression({
    threshold: 1024,
  }),
);

app.use(morgan('common'));

app.use(errorHandler);

export default app;
