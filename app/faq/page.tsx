import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { connectToDatabase } from "@/lib/db";
import FAQ from "@/models/FAQ";
import FAQClient from "@/components/faq/FAQClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Ragu Goat Farm",
  description:
    "Find answers to common questions about booking live goats, mutton delivery, pricing, and our farming practices at Ragu Goat Farm.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function FAQPage() {
  await connectToDatabase();

  // Fetch active FAQs
  const dbFaqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
  
  // Serialize FAQs for the client
  const faqs = dbFaqs.map((faq: any) => ({
    _id: faq._id.toString(),
    question: faq.question,
    answer: faq.answer,
  }));

  // Generate JSON-LD Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-brand-light-gray flex flex-col font-body text-brand-black">
      <Navbar />

      <main className="flex-1 pt-16 md:pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-black uppercase tracking-wide mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-brand-gray text-lg md:text-xl">
              Everything you need to know about our premium livestock, fresh meat delivery, and sustainable farming practices.
            </p>
          </div>

          {faqs.length === 0 ? (
            <div className="text-center text-brand-gray bg-white p-12 rounded-2xl shadow-sm border border-brand-border">
              <p>Check back soon for answers to our most common questions!</p>
            </div>
          ) : (
            <FAQClient faqs={faqs} />
          )}

          <div className="mt-16 text-center">
            <p className="text-brand-gray mb-4">Still have questions?</p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-brand-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />

      {/* JSON-LD Script Injection for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
