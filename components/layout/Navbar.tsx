"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import { useSettings } from "@/hooks/useSettings";
import { Phone, Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function Navbar() {
  const pathname = usePathname();
  const { visible, isScrolled } = useScrollNavbar();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone = settings.contact_phone || "+91 9442379832";
  const whatsapp = settings.contact_whatsapp || "+91 9442379832";
  // Format whatsapp link
  const whatsappFormatted = whatsapp.replace(/[^\d+]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappFormatted}`;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Live Goats", href: "/goats" },
    { name: "Mutton", href: "/mutton" },
    { name: "Blog", href: "/blog" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform translate-y-0 ${
          isScrolled
            ? "bg-white/85 backdrop-blur-md shadow-navbar border-b border-brand-border"
            : "bg-white border-b border-brand-border/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {settings.logo_url && (
              <Image
                src={settings.logo_url}
                alt={settings.farm_name || "Ragu Goat Farm"}
                width={200}
                height={40}
                className="h-10 w-auto object-contain"
              />
            )}
            <span className="font-display text-2xl tracking-wider text-brand-black group-hover:text-goat-primary transition-colors uppercase">
              {settings.farm_name || "RAGU FARM"}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold relative py-1 transition-colors ${
                    isActive
                      ? "text-goat-primary"
                      : "text-brand-black hover:text-goat-primary"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-goat-primary rounded-full animate-in fade-in duration-300"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Phone */}
            <a
              href={`tel:${phone}`}
              className="p-2 text-brand-black hover:text-goat-primary hover:bg-brand-light-gray rounded-full transition-all border border-transparent hover:border-brand-border"
              title="Call Us"
              aria-label="Call Us"
            >
              <Phone size={18} strokeWidth={1.8} />
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#25D366] hover:bg-[#25D366]/10 rounded-full transition-all border border-transparent hover:border-[#25D366]/20"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>

            {/* Book Now */}
            <Link
              href="/book"
              className="bg-brand-black hover:bg-goat-primary text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm hover:shadow transition-all duration-200"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href={`tel:${phone}`}
              className="p-2 text-brand-black hover:bg-brand-light-gray rounded-full transition-colors"
              aria-label="Call Us"
            >
              <Phone size={18} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-black hover:bg-brand-light-gray rounded-full transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to push page content down */}
      <div className="h-16"></div>

      {/* Mobile Slide-in Panel */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 top-16 bg-brand-black/60 z-30 backdrop-blur-sm lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      ></div>

      {/* Drawer starts below the main header */}
      <div 
        className={`fixed inset-y-0 top-16 right-0 w-full sm:max-w-sm bg-white/95 backdrop-blur-xl z-40 shadow-2xl flex flex-col justify-between p-3 md:p-6 lg:hidden border-l border-brand-border/40 transition-transform duration-300 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-5 py-4 text-lg font-bold rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-goat-tint text-goat-primary translate-x-1" 
                    : "text-brand-black hover:bg-brand-light-gray hover:text-goat-primary hover:translate-x-1"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-brand-border pt-6 space-y-4">
          <div className="flex items-center justify-around">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm font-semibold text-brand-black"
            >
              <Phone size={16} />
              <span>Call Us</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-[#25D366]"
            >
              <FaWhatsapp size={18} />
              <span>WhatsApp</span>
            </a>
          </div>
          <Link
            href="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center py-3 bg-brand-black hover:bg-goat-primary text-white font-semibold rounded-full shadow transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </>
  );
}
