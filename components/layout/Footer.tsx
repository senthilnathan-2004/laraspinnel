"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";
import { Phone, Mail, MapPin, Clock, Lock } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const { settings } = useSettings();

  const farmName = settings.farm_name || "Ragu Goat Farm";
  const tagline = settings.tagline || "Fresh, healthy, farm-raised live goats & bulk mutton";
  const phone = settings.contact_phone || "+91 9442379832";
  const whatsapp = settings.contact_whatsapp || "+91 9442379832";
  const email = settings.contact_email || "senthilraguanthan2004@gmail.com";
  const address = settings.contact_address || "2/90 MettuStreet, Therkunam, Villupuram, Tamil Nadu - 604102";
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
              <Image
                src={settings.logo_url}
                alt={farmName}
                width={200}
                height={40}
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
            {settings.social_facebook && (
              <a
                href={settings.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
            )}
            {settings.social_instagram && (
              <a
                href={settings.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
            )}
            {settings.social_youtube && (
              <a
                href={settings.social_youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={20} />
              </a>
            )}
            {settings.social_x && (
              <a
                href={settings.social_x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={20} />
              </a>
            )}
            {whatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-[#25D366] transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
            )}
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
          <address className="not-italic">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="shrink-0 mt-0.5 text-neutral-500" />
                <a href={`tel:${phone}`} itemProp="telephone" className="hover:text-white transition-colors">
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
                <a href={`mailto:${email}`} itemProp="email" className="hover:text-white transition-colors">
                  Email Us
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="shrink-0 mt-1 text-neutral-500" />
                <span itemProp="address" className="text-xs leading-relaxed">{address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="shrink-0 mt-0.5 text-neutral-500" />
                <span className="text-xs">{businessHours}</span>
              </li>
            </ul>
          </address>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <p className="text-neutral-600">
            &copy; {new Date().getFullYear()} {farmName}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3 text-neutral-600">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>|</span>
            <Link href="/editorial-policy" className="hover:text-white transition-colors">Editorial Policy</Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <a
            href="https://www.fiverr.com/senthilragu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-neutral-200 transition-colors"
          >
            Developed by <span className="font-medium">Senthil</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
