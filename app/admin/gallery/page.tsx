"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, Image as ImageIcon, Save, X, Loader2 } from "lucide-react";

interface GalleryImage {
  _id: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  category: "goat" | "mutton" | "farm" | "event";
  order: number;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<"goat" | "mutton" | "farm" | "event">("goat");
  const [order, setOrder] = useState(0);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      } else {
        setError("Failed to fetch gallery images");
      }
    } catch (err) {
      setError("Failed to fetch gallery images");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openAddForm = () => {
    setEditingImageId(null);
    setImageUrl([]);
    setAltText("");
    setCaption("");
    setCategory("goat");
    setOrder(images.length);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (img: GalleryImage) => {
    setEditingImageId(img._id);
    setImageUrl([img.imageUrl]);
    setAltText(img.altText);
    setCaption(img.caption || "");
    setCategory(img.category);
    setOrder(img.order);
    setError("");
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const doDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setImages(images.filter((img) => img._id !== id));
      } else {
        setError("Failed to delete gallery image");
      }
    } catch (err) {
      setError("Failed to delete gallery image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.length === 0) {
      setError("Please upload an image.");
      return;
    }

    setIsSaving(true);
    setError("");

    const payload = {
      imageUrl: imageUrl[0],
      altText: altText || caption || "Ragu Goat Farm Image",
      caption,
      category,
      order: Number(order),
    };

    const url = editingImageId ? `/api/admin/gallery/${editingImageId}` : "/api/admin/gallery";
    const method = editingImageId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsFormOpen(false);
        fetchImages();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save image.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Delete Gallery Image"
        message="Are you sure you want to delete this gallery image? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={doDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <AdminTopbar title="Gallery Manager" />

      <div className="flex-1 p-3 md:p-6 space-y-6 w-full">
        {/* Header Controls */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-brand-gray">
            Upload images of goats, mutton packs, the farm, or farm events for the public gallery.
          </p>
          {!isFormOpen && (
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 bg-brand-black hover:bg-goat-primary text-white font-semibold text-sm h-10 px-4 rounded-xl transition-colors duration-200 shadow-sm"
            >
              <Plus size={16} />
              <span>Upload Image</span>
            </button>
          )}
        </div>

        {/* Modal / Form Inline */}
        {isFormOpen && (
          <div className="bg-white border border-brand-border rounded-2xl shadow-card p-3 md:p-6 space-y-6 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <h3 className="font-display text-lg text-brand-black tracking-wide">
                {editingImageId ? "Edit Image Details" : "Upload Gallery Image"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-brand-gray hover:text-brand-black"
              >
                <X size={18} />
              </button>
            </div>

            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                    Gallery Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                  >
                    <option value="goat">Live Goats</option>
                    <option value="mutton">Mutton / Bulk Meat</option>
                    <option value="farm">Our Farm</option>
                    <option value="event">Events / Celebrations</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                  />
                </div>

                {/* Caption */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                    Caption / Title
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="e.g. Feeding sessions at the farm"
                    className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                  />
                </div>

                {/* Alt Text */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                    Alt Text (For accessibility & SEO)
                  </label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="e.g. Boer goats feeding in open paddock"
                    className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                  />
                </div>
              </div>

              {/* Image Upload Dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                  Image file
                </label>
                <ImageUploadDropzone value={imageUrl} onChange={setImageUrl} maxFiles={1} />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-brand-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-10 px-5 text-sm font-semibold border border-brand-border rounded-xl text-brand-black hover:bg-brand-light-gray"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold bg-brand-black hover:bg-goat-primary text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Save Image</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Images Masonry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full p-12 text-center text-brand-gray flex flex-col items-center gap-3">
              <Loader2 size={36} className="animate-spin text-goat-primary" />
              <p className="text-sm font-semibold">Loading gallery images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="col-span-full p-12 text-center text-brand-gray border border-brand-border rounded-2xl bg-white">
              <ImageIcon size={40} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm font-semibold">No images uploaded</p>
              <p className="text-xs mt-1">Upload photos to show them in the gallery page.</p>
            </div>
          ) : (
            images.map((img) => (
              <div
                key={img._id}
                className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-card flex flex-col group relative"
              >
                {/* Image */}
                <div className="relative aspect-square bg-brand-light-gray">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageUrl}
                    alt={img.altText}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="bg-brand-black/75 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                      {img.category}
                    </span>
                    <span className="bg-neutral-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                      #{img.order}
                    </span>
                  </div>
                </div>

                {/* Overlay hover actions */}
                <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openEditForm(img)}
                    className="w-9 h-9 flex items-center justify-center bg-white text-brand-black hover:text-goat-primary rounded-full shadow transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="w-9 h-9 flex items-center justify-center bg-white text-brand-black hover:text-red-600 rounded-full shadow transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Caption below image if exists */}
                {img.caption && (
                  <div className="p-3 border-t border-brand-border bg-white text-xs font-semibold text-brand-black truncate">
                    {img.caption}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
