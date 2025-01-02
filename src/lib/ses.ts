import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.AWS_SES_FROM_EMAIL!,
}: SendEmailParams) {
  console.log('Starting email send process...');
  console.log('Configuration:', {
    region: process.env.AWS_REGION,
    fromEmail: process.env.AWS_SES_FROM_EMAIL,
    to,
    subject,
  });

  const recipients = Array.isArray(to) ? to : [to];

  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: from,
  });

  try {
    console.log('Attempting to send email with SES...');
    const result = await sesClient.send(command);
    console.log('Email sent successfully:', {
      messageId: result.MessageId,
      recipients,
      subject,
    });
    return { success: true, messageId: result.MessageId };
  } catch (error: any) {
    console.error('Failed to send email:', {
      error: error.message,
      code: error.Code,
      type: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId,
      recipients,
      subject,
    });
    throw error;
  }
}
