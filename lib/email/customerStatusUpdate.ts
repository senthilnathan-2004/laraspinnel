import {
  DEFAULT_STATUS_EMAIL_SUBJECT_TEMPLATE,
  DEFAULT_STATUS_EMAIL_INTRO_TEMPLATE,
  DEFAULT_STATUS_EMAIL_FOOTER_TEMPLATE,
  renderEmailText,
} from "@/lib/emailTemplate";

type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending Verification",
  confirmed: "Confirmed",
  preparing: "Preparing / Crafting",
  ready: "Ready to Ship",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#eab308",
  confirmed: "#8FA88A",
  preparing: "#3b82f6",
  ready: "#8FA88A",
  delivered: "#111111",
  cancelled: "#ef4444",
};

interface StatusUpdateOrder {
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
}

interface GetStatusUpdateEmailOptions {
  shopName: string;
  subjectTemplate?: string;
  introTemplate?: string;
  footerTemplate?: string;
}

// Renders the order status-update email — same pattern as the order
// confirmation email: fixed HTML layout, admin-editable text blocks.
export function getOrderStatusUpdateEmail(
  order: StatusUpdateOrder,
  { shopName, subjectTemplate, introTemplate, footerTemplate }: GetStatusUpdateEmailOptions
): { subject: string; html: string } {
  const statusLabel = STATUS_LABELS[order.status] || order.status;
  const statusColor = STATUS_COLORS[order.status] || "#111111";

  const data = {
    customerName: order.customerName,
    shopName,
    orderNumber: order.orderNumber,
    totalAmount: 0,
    statusLabel,
  };

  const subject = renderEmailText(subjectTemplate || DEFAULT_STATUS_EMAIL_SUBJECT_TEMPLATE, data);
  const intro = renderEmailText(introTemplate || DEFAULT_STATUS_EMAIL_INTRO_TEMPLATE, data);
  const footer = renderEmailText(footerTemplate || DEFAULT_STATUS_EMAIL_FOOTER_TEMPLATE, data);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: sans-serif; color: #111111; line-height: 1.5; margin: 0; padding: 0; background-color: #f7f7f7;">
      <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; border-top: 4px solid ${statusColor};">
        <div style="background-color: #111111; color: #ffffff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Order Status Update</h1>
        </div>
        <div style="padding: 24px;">
          <p style="white-space: pre-line;">${intro}</p>

          <div style="background-color: #F7F7F7; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 10px; text-transform: uppercase; color: #6b7280; font-weight: bold;">Order Reference</span>
            <span style="font-family: monospace; font-size: 18px; font-weight: bold; color: #111111; margin-top: 4px; display: block;">
              #${order.orderNumber}
            </span>
            <span style="display: inline-block; margin-top: 12px; padding: 4px 12px; background-color: ${statusColor}; color: #ffffff; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase;">
              ${statusLabel}
            </span>
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
