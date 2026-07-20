interface NewContactMessage {
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
}

// Internal ops notification to the shop owner when a new contact message
// comes in — a fixed system alert, not customer-facing brand copy, so it's
// not part of the admin-editable template settings (unlike the customer
// confirmation email in customerContactConfirmation.ts).
export function getAdminNewContactEmailHtml(message: NewContactMessage): string {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://laraspinnal.com";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message</title>
    </head>
    <body style="font-family: sans-serif; color: #111111; line-height: 1.5; margin: 0; padding: 0; background-color: #f7f7f7;">
      <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background-color: #111111; color: #ffffff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; color: #8FA88A;">New Contact Message</h1>
        </div>
        <div style="padding: 24px;">
          <p>A new message was submitted via the contact form on the website.</p>

          <h3 style="font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 12px; font-weight: bold;">
            Sender Details
          </h3>
          <div style="display: table; width: 100%; margin-top: 8px;">
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 6px 0; color: #6b7280; font-size: 13px; width: 35%;">Name:</div>
              <div style="display: table-cell; padding: 6px 0; font-weight: bold; color: #111111; font-size: 13px;">${message.name}</div>
            </div>
            ${message.email ? `
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 6px 0; color: #6b7280; font-size: 13px;">Email:</div>
              <div style="display: table-cell; padding: 6px 0; font-weight: bold; font-size: 13px;"><a href="mailto:${message.email}" style="color:#8FA88A; text-decoration:none;">${message.email}</a></div>
            </div>` : ""}
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 6px 0; color: #6b7280; font-size: 13px;">Phone:</div>
              <div style="display: table-cell; padding: 6px 0; font-weight: bold; font-size: 13px;"><a href="tel:${message.phone}" style="color:#8FA88A; text-decoration:none;">${message.phone}</a></div>
            </div>
            <div style="display: table-row;">
              <div style="display: table-cell; padding: 6px 0; color: #6b7280; font-size: 13px;">Subject:</div>
              <div style="display: table-cell; padding: 6px 0; font-weight: bold; color: #111111; font-size: 13px;">${message.subject}</div>
            </div>
          </div>

          <h3 style="font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 24px; font-weight: bold;">
            Message
          </h3>
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; font-size: 14px; margin: 12px 0; white-space: pre-wrap;">${message.message}</div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${siteUrl}/admin/messages" style="background-color: #111111; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">View in Admin Panel</a>
          </div>
        </div>
        <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center; padding: 16px; font-size: 11px;">
          <p style="margin: 0;">System Generated Email &middot; Admin Notification</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
