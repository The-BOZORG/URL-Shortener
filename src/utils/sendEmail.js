import nodemailer from 'nodemailer';
import { nodemailerConfig } from './nodeMailer.js';

export const sendEmail = async ({ to, subject, html }) => {
  const account = await nodemailer.createTestAccount();

  return nodemailerConfig.sendMail({
    from: '"URL Shortener" <shorter@service.com>',
    to,
    subject,
    html,
  });
};
