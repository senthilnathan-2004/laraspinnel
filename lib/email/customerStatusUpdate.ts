export function getCustomerStatusUpdateEmailHtml(booking: any): string {
  const isGoat = booking.productType === "goat";
  const themeColor = isGoat ? "#1E8A4C" : "#C0392B";
  
  const statusColors = {
    pending: "#eab308",
    confirmed: "#1E8A4C",
    cancelled: "#ef4444",
    completed: "#3b82f6",
  };
  
  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
  };

  const currentStatusColor = statusColors[booking.status as keyof typeof statusColors] || themeColor;
  const currentStatusLabel = statusLabels[booking.status as keyof typeof statusLabels] || booking.status;
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ragugoatfarm.com";
  

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Status Update - Ragu Goat Farm</title>
      <style>
        body { font-family: sans-serif; color: #111111; line-height: 1.5; margin: 0; padding: 0; background-color: #f7f7f7; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #111111; color: #ffffff; padding: 24px; text-align: center; border-top: 4px solid ${currentStatusColor}; }
        .header img { max-height: 60px; margin-bottom: 12px; border-radius: 8px; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: ${currentStatusColor}; }
        .content { padding: 24px; }
        .ref-card { background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px; }
        .ref-label { font-size: 10px; text-transform: uppercase; color: #6b7280; font-weight: bold; }
        .ref-val { font-family: monospace; font-size: 18px; font-weight: bold; color: #111111; margin-top: 4px; display: block; }
        .status-badge { display: inline-block; padding: 4px 12px; background-color: ${currentStatusColor}; color: white; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-top: 12px; }
        .section-title { font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 24px; margin-bottom: 12px; font-weight: bold; }
        .notes-box { background-color: #f3f4f6; border-left: 4px solid #111; color: #374151; padding: 12px 16px; font-size: 13px; margin: 16px 0; }
        .footer { background-color: #111111; color: #9ca3af; text-align: center; padding: 16px; font-size: 11px; }
        
        @media only screen and (max-width: 600px) {
          .container { margin: 10px; border-radius: 8px; }
          .header { padding: 16px 12px; }
          .content { padding: 16px 12px; }
          .ref-card { padding: 12px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          
          <h1>Booking Status Update</h1>
        </div>
        <div class="content">
          <p>Dear ${booking.customerName},</p>
          <p>The status of your booking with Ragu Goat Farm has been updated.</p>

          <div class="ref-card">
            <span class="ref-label">Your Reference ID</span>
            <span class="ref-val">${booking.bookingRefId}</span>
            <span class="status-badge">${currentStatusLabel}</span>
          </div>

          ${booking.status === "confirmed" ? `
          <p style="font-size: 14px; font-weight: bold; color: #166534;">Great news! Your booking has been confirmed and scheduled for delivery/pickup.</p>
          ` : ""}
          
          ${booking.status === "cancelled" ? `
          <p style="font-size: 14px; font-weight: bold; color: #991b1b;">Your booking has been cancelled. If this was a mistake, please contact us.</p>
          ` : ""}

          ${booking.adminNotes ? `
          <h3 class="section-title">Message from Admin</h3>
          <div class="notes-box">
            ${booking.adminNotes}
          </div>
          ` : ""}

          <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">
            If you have any questions, please call or WhatsApp us at +91 98765 43210.
          </p>
        </div>
        <div class="footer">
          <p>Ragu Goat Farm &middot; Villupuram, Tamil Nadu &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
