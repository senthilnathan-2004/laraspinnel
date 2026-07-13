"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { Loader2, ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CreateBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [author, setAuthor] = useState("Ragu Farm Team");
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || content === "<p></p>") {
      setError("Please write some content for the article.");
      return;
    }

    setIsSaving(true);
    setError("");

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      title,
      excerpt,
      content,
      coverImage: coverImage[0] || "",
      author,
      tags,
      isPublished,
      metaTitle: title,
      metaDescription: excerpt,
    };

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/blog");
        router.refresh();
      } else {
        setError(data.error || "Failed to save blog post.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Write Article" />

      <div className="flex-1 p-3 md:p-6 w-full space-y-6">
        {/* Back Link */}
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gray hover:text-brand-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </Link>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 md:p-4 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-2xl shadow-card p-3 md:p-6 space-y-6" noValidate>
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
              Article Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to Care for Boer Goats in Summer"
              className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Author */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                Author
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ragu Farm Team"
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
                placeholder="e.g. Farming Tips, Summer Care, Boer Breed"
                className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
              Short Excerpt (Shows in listing card, max 2 lines)
            </label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary of the article to capture readers' interest."
              className="w-full bg-white border border-brand-border rounded-xl p-3 md:p-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary resize-none"
            ></textarea>
          </div>

          {/* Cover Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
              Cover Image
            </label>
            <ImageUploadDropzone value={coverImage} onChange={setCoverImage} maxFiles={1} />
          </div>

          {/* Rich Content Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
              Article Content
            </label>
            <TiptapEditor value={content} onChange={setContent} />
          </div>

          {/* Publication Toggle */}
          <div className="flex items-center gap-6 border-t border-brand-border pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-goat-primary focus:ring-goat-primary border-brand-border"
              />
              <span className="text-sm font-semibold text-brand-black">Publish article immediately</span>
            </label>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 border-t border-brand-border pt-6">
            <Link
              href="/admin/blog"
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
                  <span>Save Article</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
