export function getAdminNewContactEmailHtml(message: any): string {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://laraspinnal.com";
  

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message - Lara's Pinnal</title>
      <style>
        body { font-family: sans-serif; color: #111111; line-height: 1.5; margin: 0; padding: 0; background-color: #f7f7f7; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #111111; color: #ffffff; padding: 24px; text-align: center; }
        .header img { max-height: 60px; margin-bottom: 12px; border-radius: 8px; }
        .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; color: #1E8A4C; }
        .content { padding: 24px; }
        .section-title { font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 12px; margin-bottom: 12px; font-weight: bold; }
        .data-grid { display: table; width: 100%; }
        .data-row { display: table-row; }
        .data-label { display: table-cell; padding: 6px 0; color: #6b7280; font-size: 13px; width: 35%; font-weight: 500; }
        .data-value { display: table-cell; padding: 6px 0; font-weight: bold; color: #111111; font-size: 13px; }
        .message-box { background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; font-size: 14px; margin: 16px 0; white-space: pre-wrap; }
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
          
          <h1>New Contact Message</h1>
        </div>
        <div class="content">
          <p>A new message was submitted via the contact form on the website.</p>

          <h3 class="section-title">Sender Details</h3>
          <div class="data-grid">
            <div class="data-row">
              <div class="data-label">Name:</div>
              <div class="data-value">${message.name}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Email:</div>
              <div class="data-value"><a href="mailto:${message.email}" style="color:#1E8A4C; text-decoration:none;">${message.email}</a></div>
            </div>
            <div class="data-row">
              <div class="data-label">Phone:</div>
              <div class="data-value"><a href="tel:${message.phone}" style="color:#1E8A4C; text-decoration:none;">${message.phone}</a></div>
            </div>
            <div class="data-row">
              <div class="data-label">Subject:</div>
              <div class="data-value">${message.subject}</div>
            </div>
          </div>

          <h3 class="section-title">Message</h3>
          <div class="message-box">${message.message}</div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${siteUrl}/admin/messages" style="background-color: #111111; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">View in Admin Panel</a>
          </div>
        </div>
        <div class="footer">
          <p>System Generated Email &middot; Lara's Pinnal Admin</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
