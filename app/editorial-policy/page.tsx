import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { connectToDatabase } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export const metadata = {
  title: "Editorial Policy | Ragu Goat Farm",
  description: "Editorial Policy and Content Guidelines for Ragu Goat Farm.",
};

const DEFAULT_CONTENT = `
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3">1. Author Expertise & Integrity</h2>
  <p>All content published on the Ragu Goat Farm website, including blog articles, livestock care guides, and nutritional information, is written, reviewed, and approved by our internal team of experienced agricultural specialists, farmers, and veterinary consultants. We are committed to sharing accurate, safe, and reliable farming practices.</p>
</section>
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3 mt-8">2. Content Review Process</h2>
  <p>Our content undergoes a strict review process to ensure that all animal husbandry advice aligns with modern veterinary science and sustainable agricultural practices before it is published.</p>
</section>
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3 mt-8">3. Corrections and Updates</h2>
  <p>We frequently review older content to ensure it remains accurate and up-to-date. If errors are discovered, we will promptly correct the content and note the date of modification.</p>
</section>
`;

export default async function EditorialPolicyPage() {
  let content = DEFAULT_CONTENT;

  let updatedAt = new Date("2024-07-01"); // fallback

  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne({ key: "editorial_policy_content" }).lean();
    if (settings) {
      if (settings.value && settings.value.trim() !== "") {
        content = settings.value;
      }
      if (settings.updatedAt) {
        updatedAt = new Date(settings.updatedAt);
      }
    }
  } catch (error) {
    console.error("Error loading editorial policy:", error);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-body">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 pt-5 md:pt-12 pb-14 md:pb-24 w-full">
        <h1 className="font-display text-3xl md:text-5xl text-brand-black mb-4 uppercase tracking-wide border-b border-neutral-200 pb-6">Editorial Policy</h1>
        <p className="text-sm text-brand-gray mb-10 italic">Last Updated: {updatedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div 
          className="space-y-6 text-brand-gray leading-relaxed text-sm md:text-base prose prose-sm max-w-none text-justify [&_p]:text-justify! prose-p:text-brand-gray prose-a:text-goat-primary [&_:is(h1,h2,h3,h4,h5,h6)]:!text-xl md:[&_:is(h1,h2,h3,h4,h5,h6)]:!text-2xl [&_:is(h1,h2,h3,h4,h5,h6)]:!font-bold [&_:is(h1,h2,h3,h4,h5,h6)]:!text-brand-black [&_:is(h1,h2,h3,h4,h5,h6)]:!mt-8 [&_:is(h1,h2,h3,h4,h5,h6)]:!mb-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>
      <Footer />
    </div>
  );
}
