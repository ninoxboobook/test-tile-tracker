import { sendEmail } from '../ses';
import { getWelcomeEmailTemplate } from './welcome';
import { getResetPasswordEmailTemplate } from './reset-password';

export async function sendWelcomeEmail(email: string, username: string, loginUrl?: string) {
  const template = getWelcomeEmailTemplate({ username, loginUrl });
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendPasswordResetEmail(email: string, username: string, resetToken: string) {
  const resetLink = `https://testtiletracker.com/reset-password?token=${resetToken}`;
  const template = getResetPasswordEmailTemplate({ username, resetLink });
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}
