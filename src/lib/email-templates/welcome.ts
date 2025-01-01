interface WelcomeEmailProps {
  username: string;
  loginUrl?: string;
}

export function getWelcomeEmailTemplate({
  username,
  loginUrl = 'https://testtiletracker.com/login',
}: WelcomeEmailProps) {
  return {
    subject: 'Welcome to Test Tile Tracker!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Test Tile Tracker</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #0f172a; margin-bottom: 20px;">Welcome to Test Tile Tracker! 🎨</h1>
            
            <p style="margin-bottom: 16px;">Hello ${username},</p>
            
            <p style="margin-bottom: 16px;">Welcome to Test Tile Tracker! We're excited to have you join our community of ceramic artists.</p>
            
            <p style="margin-bottom: 24px;">Ready to make every glaze day a good day?</p>
            
            <a href="${loginUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Get started</a>
            
            <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">If you have any questions, feel free to reply to this email.</p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">Best regards,<br>The Tile Tracker Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
