"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, Calendar, User, Link2, CheckCircle2, ArrowLeft } from "lucide-react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa6";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  tags?: string[];
  publishedAt?: string;
  slug: string;
}

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: post, error, isLoading } = useSWR<BlogPost>(
    slug ? `/api/blog/${slug}` : null,
    fetcher
  );

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = post ? encodeURIComponent(`Check out this article: ${post.title} at Ragu Goat Farm`) : "";
  const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="h-8 w-8 rounded-full border-4 border-neutral-200 border-t-goat-primary animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 md:px-6 py-24 text-center space-y-6">
          <h1 className="font-display text-3xl uppercase text-brand-black">Article Not Found</h1>
          <p className="text-brand-gray text-sm">
            The article you are looking for does not exist or has been archived.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 bg-brand-black text-white hover:bg-goat-primary px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-12 w-full space-y-8 pb-20">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-gray hover:text-brand-black transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Blog Articles</span>
        </Link>

        {/* Article Header block */}
        <div className="space-y-4">
          {post.tags?.[0] && (
            <span className="bg-goat-tint text-goat-text text-xs uppercase font-bold px-3 py-1 rounded-lg border border-goat-primary/10">
              {post.tags[0]}
            </span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-brand-black uppercase leading-tight tracking-wide">
            {post.title}
          </h1>
          <p className="text-sm font-medium text-brand-gray leading-relaxed">{post.excerpt}</p>

          <div className="flex items-center gap-6 text-xs text-brand-gray border-y border-brand-border py-3 select-none">
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-neutral-400" />
              <span className="font-semibold text-brand-black">{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar size={14} className="text-neutral-400" />
              <span>
                {new Date(post.publishedAt || "").toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] border border-brand-border rounded-2xl overflow-hidden bg-brand-light-gray select-none shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content & Social share wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Main rich text content */}
          <div className="md:col-span-3 space-y-6">
            <div
              className="prose max-w-none text-brand-black text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </div>

          {/* Sticky Social share sidebar */}
          <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-brand-border pt-6 md:pt-0 md:pl-6 h-fit space-y-4 md:sticky md:top-24">
            <h4 className="text-xs font-bold text-brand-black uppercase tracking-wider">Share Article</h4>
            <div className="flex md:flex-col gap-2.5">
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-3 py-2 border border-brand-border hover:bg-brand-light-gray rounded-xl text-xs font-semibold text-brand-black transition-colors flex-1 md:flex-none cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={14} className="text-green-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 size={14} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 border border-[#25D366]/20 bg-[#25D366]/5 hover:bg-[#25D366]/10 rounded-xl text-xs font-semibold text-[#25D366] transition-colors flex-1 md:flex-none"
              >
                <FaWhatsapp size={15} />
                <span>WhatsApp</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 border border-[#3b5998]/20 bg-[#3b5998]/5 hover:bg-[#3b5998]/10 rounded-xl text-xs font-semibold text-[#3b5998] transition-colors flex-1 md:flex-none"
              >
                <FaFacebook size={15} />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
