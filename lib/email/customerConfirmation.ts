export function getCustomerConfirmationEmailHtml(booking: any): string {
  const isGoat = booking.productType === "goat";
  const themeColor = isGoat ? "#1E8A4C" : "#C0392B";
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://ragugoatform.com";
   // Fallback to local logo

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Booking Confirmation - Ragu Goat Farm</title>
      <style>
        body { font-family: sans-serif; color: #111111; line-height: 1.5; margin: 0; padding: 0; background-color: #f7f7f7; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: ${themeColor}; color: #ffffff; padding: 24px; text-align: center; }
        .header img { max-height: 60px; margin-bottom: 12px; border-radius: 8px; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 24px; }
        .ref-card { background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px; }
        .ref-label { font-size: 10px; text-transform: uppercase; color: #6b7280; font-weight: bold; }
        .ref-val { font-family: monospace; font-size: 18px; font-weight: bold; color: #111111; margin-top: 4px; display: block; }
        .section-title { font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 24px; margin-bottom: 12px; font-weight: bold; }
        .data-grid { display: table; width: 100%; }
        .data-row { display: table-row; }
        .data-label { display: table-cell; padding: 6px 0; color: #6b7280; font-size: 13px; width: 40%; font-weight: 500; }
        .data-value { display: table-cell; padding: 6px 0; font-weight: bold; color: #111111; font-size: 13px; }
        .info-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px; border-radius: 8px; font-size: 13px; margin: 16px 0; }
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
          
          <h1>Booking Request Received</h1>
        </div>
        <div class="content">
          <p>Dear ${booking.customerName},</p>
          <p>We have successfully received your booking reservation request. Here is a summary of your order details:</p>

          <div class="ref-card">
            <span class="ref-label">Your Reference ID</span>
            <span class="ref-val">${booking.bookingRefId}</span>
          </div>

          <div class="info-box">
            <strong>What's Next?</strong><br>
            Our farm coordinator will call you shortly on <strong>${booking.phone}</strong> to confirm your weight selections, schedule, and finalize delivery arrangements.
          </div>

          <h3 class="section-title">Order Details</h3>
          <div class="data-grid">
            <div class="data-row">
              <div class="data-label">Product Type:</div>
              <div class="data-value">${isGoat ? "Live Goat" : "Bulk Mutton"}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Variety/Pack:</div>
              <div class="data-value">${booking.varietyOrPackName}</div>
            </div>
            ${booking.weightSelection ? `
            <div class="data-row">
              <div class="data-label">Weight/KG:</div>
              <div class="data-value">${booking.weightSelection}</div>
            </div>` : ""}
            <div class="data-row">
              <div class="data-label">Quantity:</div>
              <div class="data-value">${booking.quantity}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Preferred Date:</div>
              <div class="data-value">
                ${new Date(booking.preferredDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              </div>
            </div>
            ${booking.deliveryTiming ? `
            <div class="data-row">
              <div class="data-label">Delivery Timing:</div>
              <div class="data-value">${booking.deliveryTiming}</div>
            </div>` : ""}
            ${booking.district ? `
            <div class="data-row">
              <div class="data-label">District:</div>
              <div class="data-value">${booking.district}</div>
            </div>` : ""}
          </div>

          <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">
            If you need to make changes to your booking, please call or WhatsApp us at +91 9442379832.
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
