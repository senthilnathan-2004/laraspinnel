export function customerFestivalConfirmationTemplate(data: any, settings: any): string {
  const {
    bookingRefId,
    functionCategory,
    weightRequired,
    preferredColor,
    preferredAge,
    deliveryDate,
    deliveryTiming,
    customerName,
  } = data;

  const farmName = settings?.farm_name || "Lara's Pinnal";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #22c55e; padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Festival Order Received!</h1>
        <p style="color: #f0fdf4; margin-top: 10px; font-size: 16px;">Thank you for choosing ${farmName}</p>
      </div>
      
      <div style="padding: 30px 24px;">
        <p style="color: #334155; font-size: 16px; margin-top: 0;">Dear <strong>${customerName}</strong>,</p>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">We have successfully received your custom festival crochet gift requirement. Our team is reviewing your specific needs and will contact you shortly to confirm availability and exact pricing.</p>
        
        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Reference ID</p>
          <p style="color: #0f172a; font-size: 20px; font-family: monospace; font-weight: bold; margin: 0;">${bookingRefId}</p>
        </div>

        <h2 style="color: #0f172a; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Your Requirements Summary</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 40%;">Occasion</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${functionCategory}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Weight Required</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${weightRequired}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Color Preference</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${preferredColor}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Age Preference</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${preferredAge}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Delivery Date</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${deliveryDate}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Delivery Timing</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${deliveryTiming}</td></tr>
        </table>

        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-top: 24px; text-align: center;">
          If you have any questions or need to modify your requirement, please contact us immediately.
        </p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ${farmName}. All rights reserved.</p>
      </div>
    </div>
  `;
}
