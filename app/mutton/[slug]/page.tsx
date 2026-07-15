import React from "react";
import { connectToDatabase } from "@/lib/db";
import MuttonPack from "@/models/MuttonPack";
import MuttonClientPage from "./MuttonClientPage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60; // Cache for 60 seconds

export async function generateStaticParams() {
  await connectToDatabase();
  const packs = await MuttonPack.find({ isActive: true }).select('slug').lean();
  return packs.map((pack) => ({
    slug: pack.slug,
  }));
}

export default async function MuttonDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  await connectToDatabase();
  const rawPack = await MuttonPack.findOne({ slug, isActive: true }).lean();

  if (!rawPack) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 md:px-6 py-24 text-center space-y-6">
          <h1 className="font-display text-3xl uppercase text-brand-black">Mutton Pack Not Found</h1>
          <p className="text-brand-gray text-sm">
            The mutton package you are looking for does not exist or has been deactivated.
          </p>
          <Link
            href="/mutton"
            className="inline-flex items-center gap-1.5 bg-brand-black text-white hover:bg-mutton-primary px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Catalog</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const initialPack = JSON.parse(JSON.stringify(rawPack));

  return <MuttonClientPage initialPack={initialPack} />;
}
