import nodemailer from 'nodemailer';
import { nodemailerConfig } from './nodeMailer.js';

export const sendEmail = async ({ to, subject, html }) => {
  let account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"URL Shorter <shorter@service.com>',
    to,
    subject,
    html,
  });
};
