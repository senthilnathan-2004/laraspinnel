"use client";

import React, { useState, useEffect } from "react";
import { Link2, CheckCircle2 } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaXTwitter, FaLinkedin, FaInstagram } from "react-icons/fa6";

interface BlogShareSidebarProps {
  title: string;
  slug: string;
}

export default function BlogShareSidebar({ title, slug }: BlogShareSidebarProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = encodeURIComponent(`Check out this article: ${title} at Ragu Goat Farm`);
  const shareUrl = encodeURIComponent(currentUrl);

  return (
    <div className="pt-8 mt-10 border-t border-brand-border space-y-4 select-none">
      <h4 className="text-xs font-bold text-brand-black uppercase tracking-wider">Share Article</h4>
      
      {/* Mobile: 2 columns grid. Desktop: flex wrap */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 border border-brand-border hover:bg-brand-light-gray rounded-xl text-sm font-semibold text-brand-black transition-colors cursor-pointer w-full md:w-auto"
        >
          {copied ? (
            <>
              <CheckCircle2 size={16} className="text-green-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Link2 size={16} />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 border border-black/20 bg-black/5 hover:bg-black/10 rounded-xl text-sm font-semibold text-black transition-colors w-full md:w-auto"
        >
          <FaXTwitter size={16} />
          <span>X (Twitter)</span>
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 border border-[#0a66c2]/20 bg-[#0a66c2]/5 hover:bg-[#0a66c2]/10 rounded-xl text-sm font-semibold text-[#0a66c2] transition-colors w-full md:w-auto"
        >
          <FaLinkedin size={16} />
          <span>LinkedIn</span>
        </a>

        {/* Instagram (Redirects to App/Site since no native web share link exists) */}
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 border border-[#E1306C]/20 bg-[#E1306C]/5 hover:bg-[#E1306C]/10 rounded-xl text-sm font-semibold text-[#E1306C] transition-colors w-full md:w-auto"
        >
          <FaInstagram size={16} />
          <span>Instagram</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 border border-[#25D366]/20 bg-[#25D366]/5 hover:bg-[#25D366]/10 rounded-xl text-sm font-semibold text-[#25D366] transition-colors w-full md:w-auto"
        >
          <FaWhatsapp size={16} />
          <span>WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 border border-[#3b5998]/20 bg-[#3b5998]/5 hover:bg-[#3b5998]/10 rounded-xl text-sm font-semibold text-[#3b5998] transition-colors w-full md:w-auto"
        >
          <FaFacebook size={16} />
          <span>Facebook</span>
        </a>
      </div>
    </div>
  );
}
