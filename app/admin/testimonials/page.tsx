"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { Plus, Loader2, Edit, Trash2, Quote } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentTestimonial, setCurrentTestimonial] = useState<any>({
    name: "",
    location: "",
    review: "",
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Failed to load testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    setCurrentTestimonial({ name: "", location: "", review: "", isActive: true });
    setError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: any) => {
    setModalMode("edit");
    setCurrentTestimonial(t);
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const url =
        modalMode === "create"
          ? "/api/admin/testimonials"
          : `/api/admin/testimonials/${currentTestimonial._id}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentTestimonial),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTestimonials();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save testimonial");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen relative">
      <AdminTopbar title="Testimonials Manager" />

      <div className="flex-1 p-3 md:p-6 space-y-6 w-full">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-display text-brand-black">Customer Reviews</h2>
            <p className="text-sm text-brand-gray font-medium">Manage testimonials shown on the homepage.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-brand-black hover:bg-goat-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            <Plus size={18} />
            <span>Add Testimonial</span>
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-goat-primary" size={32} />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-white border border-brand-border rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-brand-light-gray rounded-full flex items-center justify-center mx-auto text-brand-gray">
              <Quote size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-brand-black">No Testimonials Found</h3>
              <p className="text-brand-gray text-sm">Add your first customer review to display on the homepage.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className={`bg-white rounded-2xl border ${
                  t.isActive ? "border-brand-border" : "border-red-200 opacity-60"
                } p-3 md:p-6 shadow-sm flex flex-col relative group transition-all hover:shadow-md`}
              >
                {!t.isActive && (
                  <span className="absolute top-4 right-4 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    Inactive
                  </span>
                )}
                
                <div className="flex-1 space-y-4">
                  <Quote size={24} className="text-goat-primary/20" />
                  <div 
                    className="text-sm text-brand-gray leading-relaxed italic line-clamp-4 space-y-1"
                    dangerouslySetInnerHTML={{ __html: `"${t.review}"` }}
                  />
                </div>
                
                <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-light-gray flex items-center justify-center text-xs font-bold text-brand-black border border-brand-border">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-black leading-tight">{t.name}</p>
                      <p className="text-xs text-brand-gray leading-tight">{t.location}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 text-brand-gray hover:text-goat-primary transition-colors bg-brand-light-gray rounded-md hover:bg-white"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(t._id)}
                      className="p-1.5 text-brand-gray hover:text-red-500 transition-colors bg-brand-light-gray rounded-md hover:bg-white"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-3 md:p-6 border-b border-brand-border bg-brand-light-gray">
              <h3 className="text-xl font-display text-brand-black">
                {modalMode === "create" ? "Add New Testimonial" : "Edit Testimonial"}
              </h3>
            </div>
            
            <form onSubmit={handleSave} className="p-3 md:p-6 overflow-y-auto space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase block">Customer Name</label>
                <input
                  type="text"
                  required
                  value={currentTestimonial.name}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                  className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase block">Location</label>
                <input
                  type="text"
                  required
                  value={currentTestimonial.location}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, location: e.target.value })}
                  className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                  placeholder="e.g. Coimbatore, TN"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-black uppercase block">Review Text</label>
                <textarea
                  required
                  rows={4}
                  value={currentTestimonial.review}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, review: e.target.value })}
                  className="w-full border border-brand-border rounded-xl p-3 md:p-4 text-sm resize-none"
                  placeholder="What did they say about the farm?"
                />
                <span className="text-xs text-brand-gray mt-1 block">Supports HTML tags like &lt;strong&gt; and &lt;br/&gt;</span>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 md:p-4 border border-brand-border rounded-xl bg-brand-light-gray/30 hover:bg-brand-light-gray transition-colors">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={currentTestimonial.isActive}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, isActive: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-goat-primary"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-black">Active (Visible)</p>
                  <p className="text-xs text-brand-gray mt-0.5">Show this testimonial on the public homepage</p>
                </div>
              </label>

              <div className="pt-4 border-t border-brand-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 md:px-6 h-11 rounded-xl text-sm font-semibold text-brand-gray hover:bg-brand-light-gray transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-brand-black hover:bg-goat-primary text-white px-4 md:px-6 h-11 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70"
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  <span>{isSaving ? "Saving..." : "Save Testimonial"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
