export function adminNewFestivalBookingTemplate(data: any): string {
  const {
    bookingRefId,
    functionCategory,
    weightRequired,
    preferredColor,
    unwantedColor,
    preferredAge,
    deliveryDate,
    deliveryTiming,
    customerName,
    phone,
    email,
    address,
    notes,
  } = data;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Festival Booking</h1>
        <p style="color: #94a3b8; margin-top: 5px; font-size: 14px;">Reference: ${bookingRefId}</p>
      </div>
      
      <div style="padding: 24px;">
        <h2 style="color: #0f172a; font-size: 18px; border-bottom: 2px solid #22c55e; padding-bottom: 8px;">Order Requirements</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b; width: 40%;">Function Type</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${functionCategory}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b;">Weight Required</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${weightRequired}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b;">Preferred Color</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${preferredColor}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b;">Unwanted Color</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${unwantedColor}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b;">Preferred Age</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${preferredAge}</td></tr>
        </table>

        <h2 style="color: #0f172a; font-size: 18px; border-bottom: 2px solid #22c55e; padding-bottom: 8px; margin-top: 24px;">Delivery Logistics</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b; width: 40%;">Delivery Date</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${deliveryDate}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b;">Timing</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${deliveryTiming}</td></tr>
        </table>

        <h2 style="color: #0f172a; font-size: 18px; border-bottom: 2px solid #22c55e; padding-bottom: 8px; margin-top: 24px;">Customer Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b; width: 40%;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${customerName}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b;">Phone</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${phone}</td></tr>
          ${email ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${email}</td></tr>` : ''}
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b;">Address</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${address}</td></tr>
          ${notes ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #64748b;">Notes</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0f172a;">${notes}</td></tr>` : ''}
        </table>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/festival-bookings" style="background-color: #22c55e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View in Dashboard</a>
        </div>
      </div>
    </div>
  `;
}
