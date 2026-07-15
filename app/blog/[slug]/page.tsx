import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, Calendar, User, ArrowLeft } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import Link from "next/link";
import BlogShareSidebar from "@/components/blog/BlogShareSidebar";
import Image from "next/image";
import { SITE_URL } from "@/lib/siteUrl";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  
  let post = null;

  try {
    await connectToDatabase();
    post = await BlogPost.findOne({ slug, isPublished: true }).lean();
  } catch (error) {
    console.error("Failed to fetch blog post server-side:", error);
  }

  if (!post) {
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

  const p: any = post;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      {/* Dynamic JSON-LD structured schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": p.title,
            "description": p.excerpt,
            "image": p.coverImage ? [p.coverImage] : [],
            "datePublished": p.publishedAt || p.createdAt,
            "author": {
              "@type": "Person",
              "name": p.author || "Ragu Farm Team",
              "jobTitle": "Livestock & Farming Expert",
              "url": `${SITE_URL}/about`
            },
            "publisher": {
              "@type": "Organization",
              "name": "Ragu Goat Farm",
              "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/icon.svg`
              }
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${SITE_URL}/`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${SITE_URL}/blog`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": p.title,
                "item": `${SITE_URL}/blog/${p.slug}`
              }
            ]
          })
        }}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-12 w-full space-y-8 pb-20">
        {/* Visible breadcrumb (matches BreadcrumbList JSON-LD above) */}
        <nav aria-label="Breadcrumb" className="text-xs text-brand-gray">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-brand-black transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-brand-black transition-colors">Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-brand-black font-medium truncate max-w-[16rem]">{p.title}</li>
          </ol>
        </nav>

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
          {p.tags?.[0] && (
            <span className="bg-goat-tint text-goat-text text-xs uppercase font-bold px-3 py-1 rounded-lg border border-goat-primary/10">
              {p.tags[0]}
            </span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-brand-black uppercase leading-tight tracking-wide">
            {p.title}
          </h1>
          <p className="text-sm font-medium text-brand-gray leading-relaxed">{p.excerpt}</p>

          <div className="flex items-center gap-6 text-xs text-brand-gray border-y border-brand-border py-3 select-none">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-goat-tint text-goat-primary flex items-center justify-center font-bold">
                {p.author ? p.author.charAt(0) : "R"}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-brand-black text-sm">{p.author || "Ragu Farm Team"}</span>
                <span className="text-[10px] uppercase tracking-wider text-goat-text font-semibold">Farming Expert</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar size={14} className="text-neutral-400" />
              <span>
                {p.updatedAt
                  ? new Date(p.updatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : p.publishedAt
                  ? new Date(p.publishedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : new Date(p.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
              </span>
            </div>
          </div>
        </div>

        {/* Cover image */}
        {p.coverImage && (
          <div className="relative aspect-video border border-brand-border rounded-2xl overflow-hidden bg-brand-light-gray select-none shadow-sm">
            <Image
              src={p.coverImage}
              alt={p.title}
              fill
              className="object-cover"
              sizes="(max-w-768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Content & Social share wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Main rich text content */}
          <div className="md:col-span-3 space-y-6">
            <div
              className="prose max-w-none text-brand-black text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: p.content }}
            ></div>
          </div>

          {/* Share Sidebar (Client Component) */}
          <BlogShareSidebar title={p.title} slug={p.slug} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
