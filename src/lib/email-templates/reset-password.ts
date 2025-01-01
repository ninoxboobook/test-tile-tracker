interface ResetPasswordEmailProps {
  username: string;
  resetLink: string;
}

export function getResetPasswordEmailTemplate({
  username,
  resetLink,
}: ResetPasswordEmailProps) {
  return {
    subject: 'Reset Your Test Tile Tracker Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #0f172a; margin-bottom: 20px;">Password Reset Request</h1>
            
            <p style="margin-bottom: 16px;">Hello ${username},</p>
            
            <p style="margin-bottom: 16px;">We received a request to reset your Test Tile Tracker password. Click the button below to create a new password:</p>
            
            <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
            
            <p style="margin-top: 24px; margin-bottom: 16px;">This link will expire in 1 hour. If you didn't request this change, you can safely ignore this email.</p>
            
            <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">For security reasons, please don't forward this email to anyone.</p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">Best regards,<br>The Test Tile Tracker Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
