"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";
import { Loader2, ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Horse } from "@phosphor-icons/react";

export default function EditGoatPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [description, setDescription] = useState("");
  const [weightRange, setWeightRange] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [priceEstimate, setPriceEstimate] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGoatDetails = async () => {
      try {
        const res = await fetch(`/api/admin/goats`);
        if (res.ok) {
          const list = await res.json();
          const item = list.find((g: any) => g._id === id);
          if (item) {
            setName(item.name);
            setBreed(item.breed);
            setDescription(item.description);
            setWeightRange(item.weightRange);
            setAgeRange(item.ageRange);
            setPriceEstimate(item.priceEstimate);
            setTagsInput(item.tags?.join(", ") || "");
            setImages(item.images || []);
            setIsFeatured(item.isFeatured || false);
            setIsActive(item.isActive !== false);
          } else {
            setError("Goat variety not found.");
          }
        } else {
          setError("Failed to load variety details.");
        }
      } catch (err) {
        setError("Failed to load variety details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchGoatDetails();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setIsSaving(true);
    setError("");

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      name,
      breed,
      description,
      weightRange,
      ageRange,
      priceEstimate,
      tags,
      images,
      isFeatured,
      isActive,
    };

    try {
      const res = await fetch(`/api/admin/goats/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/goats");
        router.refresh();
      } else {
        setError(data.error || "Failed to update goat variety.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Edit Goat Variety" />

      <div className="flex-1 p-3 md:p-6 w-full space-y-6">
        {/* Back Link */}
        <Link
          href="/admin/goats"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gray hover:text-brand-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Goat Varieties</span>
        </Link>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 md:p-4 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white border border-brand-border rounded-2xl shadow-card p-12 text-center text-brand-gray flex flex-col items-center gap-3">
            <div className="animate-spin text-goat-primary">
              <Horse size={40} weight="duotone" />
            </div>
            <p className="text-sm font-semibold">Loading details...</p>
          </div>
        ) : (
          /* Form Container */
          <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-2xl shadow-card p-3 md:p-6 space-y-6 animate-in fade-in duration-200" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                  Variety Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Boer Goat"
                  className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                />
              </div>

              {/* Breed */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                  Breed Type
                </label>
                <input
                  type="text"
                  required
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Boer"
                  className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                />
              </div>

              {/* Weight Class */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                  Weight Range
                </label>
                <input
                  type="text"
                  required
                  value={weightRange}
                  onChange={(e) => setWeightRange(e.target.value)}
                  placeholder="e.g. 25–35 kg"
                  className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                />
              </div>

              {/* Age Range */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                  Age Range
                </label>
                <input
                  type="text"
                  required
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  placeholder="e.g. 8–12 months"
                  className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                />
              </div>

              {/* Price Estimate */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                  Price / Estimate
                </label>
                <input
                  type="text"
                  required
                  value={priceEstimate}
                  onChange={(e) => setPriceEstimate(e.target.value)}
                  placeholder="e.g. ₹9,000 – ₹13,000"
                  className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Best for Bakrid, Premium, Heavy Weight"
                  className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of this variety, its care notes, features, etc."
                className="w-full bg-white border border-brand-border rounded-xl p-3 md:p-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary resize-y"
              ></textarea>
            </div>

            {/* Image Upload Dropzone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                Images (At least one is required)
              </label>
              <ImageUploadDropzone value={images} onChange={setImages} maxFiles={5} />
            </div>

            {/* Switches (Featured & Active) */}
            <div className="flex flex-wrap items-center gap-6 border-t border-brand-border pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-goat-primary focus:ring-goat-primary border-brand-border"
                />
                <span className="text-sm font-semibold text-brand-black">Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-goat-primary focus:ring-goat-primary border-brand-border"
                />
                <span className="text-sm font-semibold text-brand-black">Active (visible to public)</span>
              </label>
            </div>

            {/* Save Buttons */}
            <div className="flex justify-end gap-3 border-t border-brand-border pt-6">
              <Link
                href="/admin/goats"
                className="inline-flex items-center justify-center h-11 px-4 md:px-6 font-semibold text-sm rounded-xl border border-brand-border text-brand-black hover:bg-brand-light-gray transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 h-11 px-4 md:px-6 font-semibold text-sm rounded-xl bg-brand-black hover:bg-goat-primary text-white transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update Variety</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
