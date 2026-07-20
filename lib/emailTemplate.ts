// Shared between the admin "Order Email" settings page (editor + live
// preview) and the actual confirmation email sent on checkout, so both
// always agree on placeholder syntax and default copy. Only the text
// blocks (subject/intro/footer) are admin-editable — the surrounding HTML
// layout and the itemized order table are generated in code, so an admin
// typo can't break the email's structure.

export const DEFAULT_EMAIL_SUBJECT_TEMPLATE = `Order Confirmation - #{{orderNumber}} - {{shopName}}`;

export const DEFAULT_EMAIL_INTRO_TEMPLATE = `Hi {{customerName}}, thank you for your order! We've received your request and will begin crafting it with care. Here is a summary of your order:`;

export const DEFAULT_EMAIL_FOOTER_TEMPLATE = `Kindly complete your payment so we can begin crafting and dispatch your order. If you have any questions, simply reply to this email or message us on WhatsApp.

Thank you for supporting handmade! 🌸`;

export const EMAIL_TEMPLATE_PLACEHOLDERS: { token: string; description: string }[] = [
  { token: "{{customerName}}", description: "Customer's name" },
  { token: "{{shopName}}", description: "Your business name (from Branding settings)" },
  { token: "{{orderNumber}}", description: "Order reference number" },
  { token: "{{totalAmount}}", description: "Order total (number only, no ₹ symbol)" },
];

export interface EmailTemplateData {
  customerName: string;
  shopName: string;
  orderNumber?: string;
  totalAmount?: number;
  statusLabel?: string;
  messageSubject?: string;
}

export function renderEmailText(template: string, data: EmailTemplateData): string {
  return template
    .replace(/{{\s*customerName\s*}}/g, data.customerName)
    .replace(/{{\s*shopName\s*}}/g, data.shopName)
    .replace(/{{\s*orderNumber\s*}}/g, data.orderNumber || "")
    .replace(/{{\s*totalAmount\s*}}/g, data.totalAmount !== undefined ? String(data.totalAmount) : "")
    .replace(/{{\s*statusLabel\s*}}/g, data.statusLabel || "")
    .replace(/{{\s*messageSubject\s*}}/g, data.messageSubject || "");
}

// --- Order status update email ---

export const DEFAULT_STATUS_EMAIL_SUBJECT_TEMPLATE = `Order #{{orderNumber}} Update - {{statusLabel}} - {{shopName}}`;

export const DEFAULT_STATUS_EMAIL_INTRO_TEMPLATE = `Hi {{customerName}}, there's an update on your order! Your order is now:`;

export const DEFAULT_STATUS_EMAIL_FOOTER_TEMPLATE = `If you have any questions about this update, simply reply to this email or message us on WhatsApp.

Thank you for supporting handmade! 🌸`;

export const STATUS_EMAIL_TEMPLATE_PLACEHOLDERS: { token: string; description: string }[] = [
  { token: "{{customerName}}", description: "Customer's name" },
  { token: "{{shopName}}", description: "Your business name (from Branding settings)" },
  { token: "{{orderNumber}}", description: "Order reference number" },
  { token: "{{statusLabel}}", description: "The new order status (e.g. Confirmed, Ready to Ship)" },
];

// --- Contact form confirmation email (sent to the person who submitted the form) ---

export const DEFAULT_CONTACT_CONFIRMATION_SUBJECT_TEMPLATE = `We received your message - {{shopName}}`;

export const DEFAULT_CONTACT_CONFIRMATION_INTRO_TEMPLATE = `Hi {{customerName}}, thank you for reaching out to {{shopName}}! We've received your message and will get back to you shortly.`;

export const DEFAULT_CONTACT_CONFIRMATION_FOOTER_TEMPLATE = `If your query is urgent, feel free to call or WhatsApp us directly.

Thank you for your patience! 🌸`;

export const CONTACT_CONFIRMATION_PLACEHOLDERS: { token: string; description: string }[] = [
  { token: "{{customerName}}", description: "Sender's name" },
  { token: "{{shopName}}", description: "Your business name (from Branding settings)" },
  { token: "{{messageSubject}}", description: "The subject line they submitted" },
];
