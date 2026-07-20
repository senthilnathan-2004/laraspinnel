import {
  DEFAULT_CONTACT_CONFIRMATION_SUBJECT_TEMPLATE,
  DEFAULT_CONTACT_CONFIRMATION_INTRO_TEMPLATE,
  DEFAULT_CONTACT_CONFIRMATION_FOOTER_TEMPLATE,
  renderEmailText,
} from "@/lib/emailTemplate";

interface ContactMessageInput {
  name: string;
  subject: string;
  message: string;
}

interface GetContactConfirmationEmailOptions {
  shopName: string;
  subjectTemplate?: string;
  introTemplate?: string;
  footerTemplate?: string;
}

// Renders the "we received your message" email sent back to whoever submits
// the public contact form — same admin-editable-text pattern as the order
// emails: fixed layout, editable subject/intro/footer.
export function getContactConfirmationEmail(
  contact: ContactMessageInput,
  { shopName, subjectTemplate, introTemplate, footerTemplate }: GetContactConfirmationEmailOptions
): { subject: string; html: string } {
  const data = {
    customerName: contact.name,
    shopName,
    messageSubject: contact.subject,
  };

  const subject = renderEmailText(subjectTemplate || DEFAULT_CONTACT_CONFIRMATION_SUBJECT_TEMPLATE, data);
  const intro = renderEmailText(introTemplate || DEFAULT_CONTACT_CONFIRMATION_INTRO_TEMPLATE, data);
  const footer = renderEmailText(footerTemplate || DEFAULT_CONTACT_CONFIRMATION_FOOTER_TEMPLATE, data);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: sans-serif; color: #111111; line-height: 1.5; margin: 0; padding: 0; background-color: #f7f7f7;">
      <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background-color: #8FA88A; color: #ffffff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Message Received</h1>
        </div>
        <div style="padding: 24px;">
          <p style="white-space: pre-line;">${intro}</p>

          <div style="background-color: #F7F7F7; border-left: 4px solid #8FA88A; border-radius: 6px; padding: 14px 16px; margin: 20px 0;">
            <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: bold;">Your Message — ${contact.subject}</p>
            <p style="margin: 0; font-size: 13px; color: #374151; white-space: pre-wrap;">${contact.message}</p>
          </div>

          <p style="white-space: pre-line; font-size: 13px; color: #374151; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">${footer}</p>
        </div>
        <div style="background-color: #111111; color: #9ca3af; text-align: center; padding: 16px; font-size: 11px;">
          <p style="margin: 0;">${shopName} &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
