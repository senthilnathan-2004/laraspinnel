"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";
import { Loader2, ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Beef } from "lucide-react";

export default function EditMuttonPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [weightOptionsInput, setWeightOptionsInput] = useState("");
  const [districtsInput, setDistrictsInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackDetails = async () => {
      try {
        const res = await fetch(`/api/admin/mutton`);
        if (res.ok) {
          const list = await res.json();
          const item = list.find((p: any) => p._id === id);
          if (item) {
            setName(item.name);
            setDescription(item.description);
            setPrice(item.price);
            setWeightOptionsInput(item.weightOptions?.join(", ") || "");
            setDistrictsInput(item.districtsAvailable?.join(", ") || "");
            setImages(item.images || []);
            setIsFeatured(item.isFeatured || false);
            setIsActive(item.isActive !== false);
          } else {
            setError("Mutton pack not found.");
          }
        } else {
          setError("Failed to load pack details.");
        }
      } catch (err) {
        setError("Failed to load pack details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPackDetails();
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

    const weightOptions = weightOptionsInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const districtsAvailable = districtsInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      name,
      description,
      price,
      weightOptions,
      districtsAvailable,
      images,
      isFeatured,
      isActive,
    };

    try {
      const res = await fetch(`/api/admin/mutton/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/mutton");
        router.refresh();
      } else {
        setError(data.error || "Failed to update mutton pack.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Edit Mutton Pack" />

      <div className="flex-1 p-3 md:p-6 w-full space-y-6">
        {/* Back Link */}
        <Link
          href="/admin/mutton"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gray hover:text-brand-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Mutton Packs</span>
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
            <div className="animate-spin text-mutton-primary">
              <Beef size={40} />
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
                  Pack Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 5kg Family Pack"
                  className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-mutton-primary"
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                  Price (e.g. Rate per kg or fixed rate)
                </label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. ₹450/kg or ₹2,250"
                  className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-mutton-primary"
                />
              </div>

              {/* Weight Options */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                  Weight Options (comma separated)
                </label>
                <input
                  type="text"
                  value={weightOptionsInput}
                  onChange={(e) => setWeightOptionsInput(e.target.value)}
                  placeholder="e.g. 5kg, 10kg, 15kg"
                  className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-mutton-primary"
                />
              </div>

              {/* Districts Override */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                  Districts Available (comma separated)
                </label>
                <input
                  type="text"
                  value={districtsInput}
                  onChange={(e) => setDistrictsInput(e.target.value)}
                  placeholder="e.g. Coimbatore, Tiruppur (leave blank to inherit settings)"
                  className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-mutton-primary"
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
                placeholder="Provide a detailed description of this mutton package, custom cuts information, fresh guarantees, etc."
                className="w-full bg-white border border-brand-border rounded-xl p-3 md:p-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-mutton-primary resize-y"
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
                  className="w-4 h-4 rounded text-mutton-primary focus:ring-mutton-primary border-brand-border"
                />
                <span className="text-sm font-semibold text-brand-black">Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-mutton-primary focus:ring-mutton-primary border-brand-border"
                />
                <span className="text-sm font-semibold text-brand-black">Active (visible to public)</span>
              </label>
            </div>

            {/* Save Buttons */}
            <div className="flex justify-end gap-3 border-t border-brand-border pt-6">
              <Link
                href="/admin/mutton"
                className="inline-flex items-center justify-center h-11 px-4 md:px-6 font-semibold text-sm rounded-xl border border-brand-border text-brand-black hover:bg-brand-light-gray transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 h-11 px-4 md:px-6 font-semibold text-sm rounded-xl bg-brand-black hover:bg-mutton-primary text-white transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update Pack</span>
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
