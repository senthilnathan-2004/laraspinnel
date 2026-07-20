import {
  DEFAULT_EMAIL_SUBJECT_TEMPLATE,
  DEFAULT_EMAIL_INTRO_TEMPLATE,
  DEFAULT_EMAIL_FOOTER_TEMPLATE,
  renderEmailText,
} from "@/lib/emailTemplate";

interface OrderConfirmationOrder {
  orderNumber: string;
  customerName: string;
  address: string;
  city: string;
  pincode: string;
  totalAmount: number;
  items: {
    name: string;
    price: number;
    quantity: number;
    customText?: string;
  }[];
}

interface GetOrderConfirmationEmailOptions {
  shopName: string;
  subjectTemplate?: string;
  introTemplate?: string;
  footerTemplate?: string;
}

function buildItemsTableRows(items: OrderConfirmationOrder["items"]): string {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: bold; color: #111111; font-size: 13px;">${item.name}</div>
            ${item.customText ? `<div style="font-size: 11px; color: #56695A; font-style: italic; margin-top: 2px;">Customization: ${item.customText}</div>` : ""}
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 13px; color: #111111;">
            ${item.quantity}
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; font-size: 13px; color: #111111;">
            ₹${item.price * item.quantity}
          </td>
        </tr>`
    )
    .join("");
}

// Renders the customer order-confirmation email — a fixed HTML layout
// (safe from admin typos) with three text blocks (subject/intro/footer)
// substituted from admin-editable templates, defaulting when unset.
export function getOrderConfirmationEmail(
  order: OrderConfirmationOrder,
  { shopName, subjectTemplate, introTemplate, footerTemplate }: GetOrderConfirmationEmailOptions
): { subject: string; html: string } {
  const data = {
    customerName: order.customerName,
    shopName,
    orderNumber: order.orderNumber,
    totalAmount: order.totalAmount,
  };

  const subject = renderEmailText(subjectTemplate || DEFAULT_EMAIL_SUBJECT_TEMPLATE, data);
  const intro = renderEmailText(introTemplate || DEFAULT_EMAIL_INTRO_TEMPLATE, data);
  const footer = renderEmailText(footerTemplate || DEFAULT_EMAIL_FOOTER_TEMPLATE, data);

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
          <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Order Confirmation</h1>
        </div>
        <div style="padding: 24px;">
          <p style="white-space: pre-line;">${intro}</p>

          <div style="background-color: #F7F7F7; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 10px; text-transform: uppercase; color: #6b7280; font-weight: bold;">Order Reference</span>
            <span style="font-family: monospace; font-size: 18px; font-weight: bold; color: #111111; margin-top: 4px; display: block;">
              #${order.orderNumber}
            </span>
          </div>

          <h3 style="font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; font-weight: bold;">
            Ordered Items
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            <thead>
              <tr>
                <th style="text-align: left; font-size: 11px; color: #6b7280; padding-bottom: 6px;">Product</th>
                <th style="text-align: center; font-size: 11px; color: #6b7280; padding-bottom: 6px;">Qty</th>
                <th style="text-align: right; font-size: 11px; color: #6b7280; padding-bottom: 6px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${buildItemsTableRows(order.items)}
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; padding-top: 16px; font-size: 15px; font-weight: bold;">
            <span>Total Amount</span>
            <span>₹${order.totalAmount}</span>
          </div>

          <h3 style="font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 24px; font-weight: bold;">
            Delivery Address
          </h3>
          <p style="font-size: 13px; color: #111111; margin-top: 8px;">
            ${order.address}, ${order.city} - ${order.pincode}
          </p>

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
