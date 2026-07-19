export function getCustomerContactConfirmationEmailHtml(message: any): string {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://laraspinnal.com";
  

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We've Received Your Message - Lara's Pinnal</title>
      <style>
        body { font-family: sans-serif; color: #111111; line-height: 1.5; margin: 0; padding: 0; background-color: #f7f7f7; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #111111; color: #ffffff; padding: 24px; text-align: center; border-top: 4px solid #1E8A4C; }
        .header img { max-height: 60px; margin-bottom: 12px; border-radius: 8px; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: #1E8A4C; }
        .content { padding: 24px; }
        .message-box { background-color: #f9fafb; border-left: 4px solid #1E8A4C; padding: 16px; border-radius: 0 8px 8px 0; font-size: 14px; margin: 16px 0; white-space: pre-wrap; font-style: italic; color: #4b5563; }
        .footer { background-color: #f9fafb; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center; padding: 16px; font-size: 11px; }
        
        @media only screen and (max-width: 600px) {
          .container { margin: 10px; border-radius: 8px; }
          .header { padding: 16px 12px; }
          .content { padding: 16px 12px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          
          <h1>Message Received</h1>
        </div>
        <div class="content">
          <p>Dear ${message.name},</p>
          <p>Thank you for reaching out to Lara's Pinnal. This email is to confirm that we have successfully received your message.</p>
          <p>Our team will review your inquiry and get back to you as soon as possible.</p>

          <h3 style="font-size: 14px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 24px; margin-bottom: 12px; font-weight: bold;">Your Message Summary</h3>
          <div style="font-size: 14px;"><strong>Subject:</strong> ${message.subject}</div>
          <div class="message-box">${message.message}</div>

          <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">
            If you need immediate assistance, please call or WhatsApp us at +91 9442379832.
          </p>
        </div>
        <div class="footer">
          <p>Lara's Pinnal &middot; Tamil Nadu, India &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
