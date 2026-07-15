"use client";

import React, { useState, useEffect } from "react";
import { Link2, CheckCircle2 } from "lucide-react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa6";

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
      <div className="flex flex-wrap gap-4">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 border border-brand-border hover:bg-brand-light-gray rounded-xl text-sm font-semibold text-brand-black transition-colors cursor-pointer"
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

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-[#25D366]/20 bg-[#25D366]/5 hover:bg-[#25D366]/10 rounded-xl text-sm font-semibold text-[#25D366] transition-colors"
        >
          <FaWhatsapp size={16} />
          <span>WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-[#3b5998]/20 bg-[#3b5998]/5 hover:bg-[#3b5998]/10 rounded-xl text-sm font-semibold text-[#3b5998] transition-colors"
        >
          <FaFacebook size={16} />
          <span>Facebook</span>
        </a>
      </div>
    </div>
  );
}
