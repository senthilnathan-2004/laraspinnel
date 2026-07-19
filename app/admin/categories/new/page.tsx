"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopbar from "@/components/admin/AdminTopbar";
import Link from "next/link";
import { ArrowLeft, Save, Upload, AlertCircle } from "lucide-react";

export default function NewCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        setUploadError(data.error || "Failed to upload image");
      }
    } catch (err) {
      setUploadError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin/categories");
      } else {
        setError(data.error || "Failed to create category");
      }
    } catch (err) {
      setError("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Add New Category" />

      <div className="flex-1 p-3 md:p-6 space-y-6 w-full max-w-none animate-in fade-in">
        <div>
          <Link href="/admin/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-black hover:text-goat-primary transition-colors">
            <ArrowLeft size={16} /> Back to Categories
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-2xl p-5 md:p-8 space-y-6 shadow-card w-full">
          <h2 className="text-lg font-bold text-brand-black uppercase tracking-wider border-b border-brand-border pb-3">
            Category Details
          </h2>

          {error && (
            <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </p>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-bold text-brand-black uppercase">Category Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Crochet Bouquets"
              className="w-full h-11 px-4 bg-brand-light-gray/30 border border-brand-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-bold text-brand-black uppercase">Description</label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a brief summary of what this category contains..."
              className="w-full p-4 bg-brand-light-gray/30 border border-brand-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all resize-none"
            />
          </div>

          {/* Device Image Upload + Image URL Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-brand-light-gray/20 border border-brand-border rounded-2xl">
            {/* Device file upload */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-brand-black uppercase block">Upload Image from Device</span>
              
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  id="category-file-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="category-file-upload"
                  className="flex items-center justify-center gap-2 border border-dashed border-neutral-300 hover:border-goat-primary bg-white rounded-xl py-6 px-4 cursor-pointer transition-all text-sm font-semibold text-brand-black"
                >
                  <Upload size={18} className={isUploading ? "animate-bounce text-goat-primary" : "text-brand-gray"} />
                  {isUploading ? "Uploading file..." : "Click to select device file"}
                </label>
                {uploadError && (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle size={12} /> {uploadError}
                  </p>
                )}
              </div>
            </div>

            {/* Manual URL entry */}
            <div className="space-y-3">
              <label htmlFor="image" className="text-xs font-bold text-brand-black uppercase block">Or Enter Image URL</label>
              <input
                type="text"
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/... or /images/..."
                className="w-full h-11 px-4 bg-white border border-brand-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
              />
              {formData.image && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-brand-gray truncate max-w-xs block font-mono">Loaded: {formData.image}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4.5 h-4.5 text-goat-primary border-brand-border rounded focus:ring-goat-primary"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-brand-black uppercase cursor-pointer">
              Active & Published (Visible on Public Website)
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-brand-border flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="bg-brand-black hover:bg-goat-primary text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 shadow-sm text-sm disabled:bg-neutral-400"
            >
              {isSubmitting ? "Saving..." : <><Save size={16} /> Save Category</>}
            </button>
            <Link
              href="/admin/categories"
              className="bg-white hover:bg-brand-light-gray text-brand-black border border-brand-border font-bold py-2.5 px-6 rounded-xl transition-all text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
