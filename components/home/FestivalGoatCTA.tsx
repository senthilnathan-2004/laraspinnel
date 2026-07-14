import React from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { CalendarHeart, CheckCircle2, Info } from "lucide-react";
import { MdOutlineTempleHindu, MdOutlineMosque, MdOutlineChurch } from "react-icons/md";

export default async function FestivalGoatCTA() {
  await connectToDatabase();
  
  // Fetch festival settings
  const settingsList = await SiteSettings.find({
    key: { $in: ["festival_title", "festival_subtitle", "festival_hindu_desc", "festival_muslim_desc", "festival_christian_desc"] }
  });
  
  const settings = settingsList.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const title = settings.festival_title || "READY TO ORDER FRESH QUALITY LIVESTOCK?";
  const subtitle = settings.festival_subtitle || "Book your live goats or fresh mutton packages online. Our team will contact you to verify details and arrange scheduling.";
  const hinduDesc = settings.festival_hindu_desc || "Spotless, unblemished goats specifically chosen for Mariamman and Karuppasamy temple functions (Kidavettu). We ensure correct pallu (teeth) and color preferences according to tradition.";
  const muslimDesc = settings.festival_muslim_desc || "Healthy, age-appropriate (minimum 1 year old / 2 teeth) livestock fulfilling all Islamic requirements for Bakrid Qurbani and Aqeeqah ceremonies. Hand-fed and well-cared for.";
  const christianDesc = settings.festival_christian_desc || "Premium quality meat goats for church feasts, Christmas, and Easter celebrations. Available as live goats or bulk processed fresh mutton delivered to your venue.";

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden border-t border-brand-border">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-10">
          <div className="w-12 h-12 rounded-full bg-brand-light-gray border border-brand-border flex items-center justify-center text-brand-black mb-4 shadow-sm">
            <CalendarHeart size={24} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black text-brand-black uppercase tracking-tight mb-4 leading-none">
            {title}
          </h2>
          <p className="text-brand-gray text-base md:text-lg font-medium leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Two Column Layout for Details & Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 w-full mx-auto items-stretch">
          
          {/* Left Side: Functions We Supply */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-brand-black mb-1">Special Function Goats</h3>
              <p className="text-brand-gray text-sm">We handpick and reserve the finest livestock specifically meeting the traditional requirements of your festivals and religious functions.</p>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {/* Hindu Function */}
              <div className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-white border border-brand-border hover:shadow-sm transition-shadow flex-1">
                <div className="w-10 h-10 rounded-full bg-brand-light-gray border border-brand-border flex items-center justify-center text-brand-black shrink-0">
                  <MdOutlineTempleHindu size={22} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-black mb-1">Hindu Temple Functions</h4>
                  <p className="text-brand-gray text-sm leading-relaxed">
                    {hinduDesc}
                  </p>
                </div>
              </div>

              {/* Muslim Function */}
              <div className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-white border border-brand-border hover:shadow-sm transition-shadow flex-1">
                <div className="w-10 h-10 rounded-full bg-brand-light-gray border border-brand-border flex items-center justify-center text-brand-black shrink-0">
                  <MdOutlineMosque size={22} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-black mb-1">Muslim Festivals (Qurbani / Aqeeqah)</h4>
                  <p className="text-brand-gray text-sm leading-relaxed">
                    {muslimDesc}
                  </p>
                </div>
              </div>

              {/* Christian Function */}
              <div className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-white border border-brand-border hover:shadow-sm transition-shadow flex-1">
                <div className="w-10 h-10 rounded-full bg-brand-light-gray border border-brand-border flex items-center justify-center text-brand-black shrink-0">
                  <MdOutlineChurch size={22} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-black mb-1">Christian Feast Days</h4>
                  <p className="text-brand-gray text-sm leading-relaxed">
                    {christianDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Booking Information CTA */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-brand-light-gray/30 border border-brand-border rounded-[1.5rem] p-4 md:p-8 flex flex-col h-full sticky top-24">
              <h3 className="text-xl font-bold text-brand-black mb-4">Booking Information</h3>
              
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand-black shrink-0 mt-0.5" />
                  <span className="text-brand-black font-medium text-sm">Choose exactly what you need (Weight, Color, Age/Teeth).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand-black shrink-0 mt-0.5" />
                  <span className="text-brand-black font-medium text-sm">Schedule precise delivery date and timing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-brand-black shrink-0 mt-0.5" />
                  <span className="text-brand-black font-medium text-sm">Our team will verify your exact requirements before confirming.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Info size={18} className="text-brand-gray shrink-0 mt-0.5" />
                  <span className="text-brand-gray text-sm">No payment required upfront. We will contact you with pricing after reviewing your request.</span>
                </li>
              </ul>

              <div>
                <Link 
                  href="/festival-booking" 
                  className="bg-brand-black hover:bg-neutral-800 text-white w-full h-12 rounded-full flex items-center justify-center font-bold text-base transition-all"
                >
                  Start Booking Now
                </Link>
                <p className="text-center text-xs text-brand-gray mt-3">
                  Fast & easy process. Usually confirmed within 24 hours.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
