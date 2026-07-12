import { config } from '../config';
import nodemailer from 'nodemailer';

export const nodemailerConfig = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: config.SMPT_AUTH_USERNAME,
    pass: config.SMPT_AUTH_PASS,
  },
});
