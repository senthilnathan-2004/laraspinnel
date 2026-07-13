"use client";

import React from "react";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { Phone, Mail, MapPin, Clock, Lock } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  const { settings } = useSettings();

  const farmName = settings.farm_name || "Ragu Goat Farm";
  const tagline = settings.tagline || "Fresh, healthy, farm-raised live goats & bulk mutton";
  const phone = settings.contact_phone || "+91 98765 43210";
  const whatsapp = settings.contact_whatsapp || "+91 98765 43210";
  const email = settings.contact_email || "info@ragugoatfarm.com";
  const address = settings.contact_address || "123 Farm Road, Villupuram, Tamil Nadu - 642001";
  const businessHours = settings.business_hours || "Monday - Sunday: 6:00 AM - 8:00 PM";
  
  const districts = settings.mutton_districts 
    ? settings.mutton_districts.split(",") 
    : ["Coimbatore", "Tiruppur", "Erode", "Villupuram"];

  const whatsappFormatted = whatsapp.replace(/[^\d+]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappFormatted}`;

  return (
    <footer className="bg-brand-black text-neutral-400 pt-16 pb-8 border-t border-neutral-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            {settings.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logo_url}
                alt={farmName}
                className="h-10 w-auto object-contain"
              />
            )}
            <span className="font-display text-white text-2xl tracking-wider uppercase">
              {farmName}
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-neutral-500 max-w-xs">
            {tagline}
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube size={20} />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-[#25D366] transition-colors"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/goats" className="hover:text-white transition-colors">
                Live Goats
              </Link>
            </li>
            <li>
              <Link href="/mutton" className="hover:text-white transition-colors">
                Bulk Mutton
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog Articles
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-white transition-colors">
                Farm Gallery
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Service Areas */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
            Service Areas
          </h4>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-white font-semibold block text-xs uppercase tracking-wider text-goat-primary">
                Live Goats
              </span>
              <span className="text-xs text-neutral-500 mt-0.5 block">
                Delivered across all districts of Tamil Nadu
              </span>
            </div>
            <div>
              <span className="text-white font-semibold block text-xs uppercase tracking-wider text-mutton-primary">
                Bulk Mutton
              </span>
              <span className="text-xs text-neutral-500 mt-0.5 block">
                Available in: {districts.join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Column 4: Contact Info */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone size={15} className="shrink-0 mt-0.5 text-neutral-500" />
              <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                {phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <FaWhatsapp size={15} className="shrink-0 mt-0.5 text-[#25D366]" />
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366] transition-colors"
              >
                WhatsApp Chat
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={15} className="shrink-0 mt-0.5 text-neutral-500" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="shrink-0 mt-1 text-neutral-500" />
              <span className="text-xs leading-relaxed">{address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={15} className="shrink-0 mt-0.5 text-neutral-500" />
              <span className="text-xs">{businessHours}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 border-t border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p className="text-neutral-600">
          &copy; {new Date().getFullYear()} {farmName}. All Rights Reserved.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <a
            href="https://www.fiverr.com/senthilragu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-neutral-200 transition-colors"
          >
            Developed by <span className="font-medium">Senthil</span>
          </a>
          <Link
            href="/admin"
            className="text-neutral-700 hover:text-white flex items-center gap-1.5 transition-colors font-medium"
          >
            <Lock size={12} />
            <span>Admin Login</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
