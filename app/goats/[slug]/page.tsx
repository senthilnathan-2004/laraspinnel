import React from "react";
import { connectToDatabase } from "@/lib/db";
import GoatVariety from "@/models/GoatVariety";
import GoatClientPage from "./GoatClientPage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60; // Cache for 60 seconds

export async function generateStaticParams() {
  await connectToDatabase();
  const goats = await GoatVariety.find({ isActive: true }).select('slug').lean();
  return goats.map((goat) => ({
    slug: goat.slug,
  }));
}

export default async function GoatDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  await connectToDatabase();
  const rawGoat = await GoatVariety.findOne({ slug, isActive: true }).lean();

  if (!rawGoat) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 md:px-6 py-24 text-center space-y-6">
          <h1 className="font-display text-3xl md:text-3xl uppercase text-brand-black">Goat Variety Not Found</h1>
          <p className="text-brand-gray text-sm">
            The goat variety you are looking for does not exist or has been deactivated.
          </p>
          <Link
            href="/goats"
            className="inline-flex items-center gap-1.5 bg-brand-black text-white hover:bg-goat-primary px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Catalog</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const initialGoat = JSON.parse(JSON.stringify(rawGoat));

  return <GoatClientPage initialGoat={initialGoat} />;
}
