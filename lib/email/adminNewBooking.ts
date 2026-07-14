export function getAdminNewBookingEmailHtml(booking: any): string {
  const isGoat = booking.productType === "goat";
  const themeColor = isGoat ? "#1E8A4C" : "#C0392B";
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://ragugoatform.com";
  

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Received - Admin Alert</title>
      <style>
        body { font-family: sans-serif; color: #111111; line-height: 1.5; margin: 0; padding: 0; background-color: #f7f7f7; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #111111; color: #ffffff; padding: 24px; text-align: center; }
        .header img { max-height: 60px; margin-bottom: 12px; border-radius: 8px; }
        .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; color: ${themeColor}; }
        .content { padding: 24px; }
        .ref-card { background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px; }
        .ref-label { font-size: 10px; text-transform: uppercase; color: #6b7280; font-weight: bold; }
        .ref-val { font-family: monospace; font-size: 18px; font-weight: bold; color: #111111; margin-top: 4px; display: block; }
        .section-title { font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 24px; margin-bottom: 12px; font-weight: bold; }
        .data-grid { display: table; width: 100%; }
        .data-row { display: table-row; }
        .data-label { display: table-cell; padding: 6px 0; color: #6b7280; font-size: 13px; width: 35%; font-weight: 500; }
        .data-value { display: table-cell; padding: 6px 0; font-weight: bold; color: #111111; font-size: 13px; }
        .notes-box { background-color: #fef9c3; border: 1px solid #fde047; color: #854d0e; padding: 12px; border-radius: 8px; font-size: 13px; margin: 16px 0; }
        .footer { background-color: #f9fafb; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center; padding: 16px; font-size: 11px; }
        
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
          
          <h1>New Booking Received</h1>
        </div>
        <div class="content">
          <div class="ref-card">
            <span class="ref-label">Booking Reference ID</span>
            <span class="ref-val">${booking.bookingRefId}</span>
          </div>

          <h3 class="section-title">Order Summary</h3>
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
              <div class="data-label">Delivery Date:</div>
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

          <h3 class="section-title">Customer Details</h3>
          <div class="data-grid">
            <div class="data-row">
              <div class="data-label">Name:</div>
              <div class="data-value">${booking.customerName}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Phone:</div>
              <div class="data-value"><a href="tel:${booking.phone}" style="color:${themeColor}; text-decoration:none;">${booking.phone}</a></div>
            </div>
            ${booking.altPhone ? `
            <div class="data-row">
              <div class="data-label">Alt Phone:</div>
              <div class="data-value"><a href="tel:${booking.altPhone}" style="color:${themeColor}; text-decoration:none;">${booking.altPhone}</a></div>
            </div>` : ""}
            ${booking.email ? `
            <div class="data-row">
              <div class="data-label">Email:</div>
              <div class="data-value"><a href="mailto:${booking.email}" style="color:${themeColor}; text-decoration:none;">${booking.email}</a></div>
            </div>` : ""}
          </div>

          <h3 class="section-title">Delivery Address</h3>
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; font-size: 13px; white-space: pre-wrap;">
            ${booking.deliveryAddress}
          </div>

          ${booking.notes ? `
          <h3 class="section-title">Customer Notes</h3>
          <div class="notes-box">${booking.notes}</div>` : ""}

          <div style="text-align: center; margin-top: 32px;">
            <a href="${siteUrl}/admin/bookings/${booking._id}" style="background-color: #111111; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Manage Booking</a>
          </div>
        </div>
        <div class="footer">
          <p>System Generated Email &middot; Ragu Goat Farm Admin</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
