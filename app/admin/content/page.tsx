"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";

export default function AdminContentPage() {
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load content settings", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update content.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-goat-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Page Content Manager" />

      <div className="flex-1 p-3 md:p-6 space-y-6 w-full">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 md:p-4 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-3 md:p-4 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 size={18} className="shrink-0 text-green-600 mt-0.5" />
            <span className="font-medium">Content updated successfully!</span>
          </div>
        )}

        <div className="flex space-x-2 border-b border-brand-border pb-2">
          {["home", "about", "contact"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-xl font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? "bg-brand-black text-white"
                  : "bg-transparent text-brand-gray hover:text-brand-black"
              }`}
            >
              {tab} Page
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="bg-white border border-brand-border rounded-2xl shadow-card p-3 md:p-6 space-y-8" noValidate>
          
          {/* HOME TAB */}
          {activeTab === "home" && (
            <div className="space-y-8 animate-in fade-in">
              {/* Category Section */}
              <div className="space-y-4">
                <h3 className="font-display text-lg text-brand-black border-b border-brand-border pb-2">Category Section</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Title</label>
                    <input
                      type="text"
                      value={settings.home_shop_title || ""}
                      onChange={(e) => handleChange("home_shop_title", e.target.value)}
                      placeholder="What Are You Looking For?"
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Subtitle</label>
                    <input
                      type="text"
                      value={settings.home_shop_subtitle || ""}
                      onChange={(e) => handleChange("home_shop_subtitle", e.target.value)}
                      placeholder="Choose a category to browse crochet bouquets, amigurumi plush, keychains, and custom gift hampers."
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-black uppercase block">Bouquets Category Image</label>
                      <ImageUploadDropzone
                        value={settings.home_shop_image_1 ? [settings.home_shop_image_1] : []}
                        onChange={(urls) => handleChange("home_shop_image_1", urls[0] || "")}
                        maxFiles={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-brand-black uppercase block">Amigurumi Category Image</label>
                      <ImageUploadDropzone
                        value={settings.home_shop_image_2 ? [settings.home_shop_image_2] : []}
                        onChange={(urls) => handleChange("home_shop_image_2", urls[0] || "")}
                        maxFiles={1}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials Section */}
              <div className="space-y-4">
                <h3 className="font-display text-lg text-brand-black border-b border-brand-border pb-2">Testimonials Section</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Title</label>
                    <input
                      type="text"
                      value={settings.home_testimonials_title || ""}
                      onChange={(e) => handleChange("home_testimonials_title", e.target.value)}
                      placeholder="What Our Customers Say"
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Subtitle</label>
                    <input
                      type="text"
                      value={settings.home_testimonials_subtitle || ""}
                      onChange={(e) => handleChange("home_testimonials_subtitle", e.target.value)}
                      placeholder="Stories of joy from gift-givers, brides, and happy families."
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Stat 1</label>
                    <input
                      type="text"
                      value={settings.home_stat_1 || ""}
                      onChange={(e) => handleChange("home_stat_1", e.target.value)}
                      placeholder="500+ Happy Customers"
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Stat 2</label>
                    <input
                      type="text"
                      value={settings.home_stat_2 || ""}
                      onChange={(e) => handleChange("home_stat_2", e.target.value)}
                      placeholder="Tamil Nadu Wide Delivery"
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Stat 3</label>
                    <input
                      type="text"
                      value={settings.home_stat_3 || ""}
                      onChange={(e) => handleChange("home_stat_3", e.target.value)}
                      placeholder="Handmade Quality Guaranteed"
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="space-y-8 animate-in fade-in">
              {/* Intro Section */}
              <div className="space-y-4">
                <h3 className="font-display text-lg text-brand-black border-b border-brand-border pb-2">About Intro Section</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Title</label>
                    <input
                      type="text"
                      value={settings.about_intro_title || ""}
                      onChange={(e) => handleChange("about_intro_title", e.target.value)}
                      placeholder="About Lara's Pinnal"
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Subtitle</label>
                    <input
                      type="text"
                      value={settings.about_intro_subtitle || ""}
                      onChange={(e) => handleChange("about_intro_subtitle", e.target.value)}
                      placeholder="Handcrafting heartfelt crochet gifts and flowers, one stitch at a time..."
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Paragraph 1</label>
                    <textarea
                      rows={3}
                      value={settings.about_intro_p1 || ""}
                      onChange={(e) => handleChange("about_intro_p1", e.target.value)}
                      placeholder="At Lara's Pinnal, we believe that a meaningful gift begins with premium milk cotton yarn and careful handwork..."
                      className="w-full border border-brand-border rounded-xl p-3 md:p-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Paragraph 2</label>
                    <textarea
                      rows={3}
                      value={settings.about_intro_p2 || ""}
                      onChange={(e) => handleChange("about_intro_p2", e.target.value)}
                      placeholder="We started with a vision to bring handmade, personalised crochet gifts to every celebration..."
                      className="w-full border border-brand-border rounded-xl p-3 md:p-4 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Side Image</label>
                    <ImageUploadDropzone
                      value={settings.about_intro_image ? [settings.about_intro_image] : []}
                      onChange={(urls) => handleChange("about_intro_image", urls[0] || "")}
                      maxFiles={1}
                    />
                  </div>
                </div>
              </div>

              {/* Why Choose Section */}
              <div className="space-y-4">
                <h3 className="font-display text-lg text-brand-black border-b border-brand-border pb-2">Why Choose Us Section</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Section Title</label>
                    <input
                      type="text"
                      value={settings.about_why_title || ""}
                      onChange={(e) => handleChange("about_why_title", e.target.value)}
                      placeholder="Why Choose Lara's Pinnal?"
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Section Subtitle</label>
                    <input
                      type="text"
                      value={settings.about_why_subtitle || ""}
                      onChange={(e) => handleChange("about_why_subtitle", e.target.value)}
                      placeholder="We stand by rigorous handmade quality markers..."
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  {/* Values */}
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-3 md:p-4 bg-brand-light-gray/50 rounded-xl space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-brand-black uppercase block">Value {i} Title</label>
                        <input
                          type="text"
                          value={settings[`about_why_${i}_title`] || ""}
                          onChange={(e) => handleChange(`about_why_${i}_title`, e.target.value)}
                          placeholder={i===1 ? "Premium Milk Cotton Yarn" : i===2 ? "Custom & Personalised Designs" : "Safe Nationwide Delivery"}
                          className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-brand-black uppercase block">Value {i} Description</label>
                        <textarea
                          rows={2}
                          value={settings[`about_why_${i}_desc`] || ""}
                          onChange={(e) => handleChange(`about_why_${i}_desc`, e.target.value)}
                          placeholder={i===1 ? "We use soft, skin-friendly premium milk cotton yarn for every piece..." : i===2 ? "We craft custom bouquets, frames, and amigurumi to match your occasion..." : "We pack every order securely for safe delivery across India..."}
                          className="w-full border border-brand-border rounded-xl p-3 md:p-4 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Section */}
              <div className="space-y-4">
                <h3 className="font-display text-lg text-brand-black border-b border-brand-border pb-2">Bottom Stats Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-3 md:p-4 border border-brand-border rounded-xl space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-brand-black uppercase block">Stat {i} Number</label>
                        <input
                          type="text"
                          value={settings[`about_stat_${i}_val`] || ""}
                          onChange={(e) => handleChange(`about_stat_${i}_val`, e.target.value)}
                          placeholder={i===1 ? "100% HANDMADE" : i===2 ? "1,200+" : i===3 ? "4.9/5" : "3,500+"}
                          className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-brand-black uppercase block">Stat {i} Label</label>
                        <input
                          type="text"
                          value={settings[`about_stat_${i}_label`] || ""}
                          onChange={(e) => handleChange(`about_stat_${i}_label`, e.target.value)}
                          placeholder={i===1 ? "Crafted by Hand" : i===2 ? "Gifts Crafted" : i===3 ? "Customer Rating" : "Deliveries Completed"}
                          className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === "contact" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="space-y-4">
                <h3 className="font-display text-lg text-brand-black border-b border-brand-border pb-2">Contact Map</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Google Maps Embed URL (src)</label>
                    <textarea
                      rows={5}
                      value={settings.contact_map_url || ""}
                      onChange={(e) => handleChange("contact_map_url", e.target.value)}
                      className="w-full border border-brand-border rounded-xl p-3 md:p-4 text-sm font-mono text-xs"
                      placeholder="e.g. https://www.google.com/maps/embed?pb=!1m18..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-6">
                <h3 className="font-display text-lg text-brand-black border-b border-brand-border pb-2">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Facebook URL</label>
                    <input
                      type="url"
                      value={settings.social_facebook || ""}
                      onChange={(e) => handleChange("social_facebook", e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">Instagram URL</label>
                    <input
                      type="url"
                      value={settings.social_instagram || ""}
                      onChange={(e) => handleChange("social_instagram", e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">YouTube URL</label>
                    <input
                      type="url"
                      value={settings.social_youtube || ""}
                      onChange={(e) => handleChange("social_youtube", e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase block">X (Twitter) URL</label>
                    <input
                      type="url"
                      value={settings.social_x || ""}
                      onChange={(e) => handleChange("social_x", e.target.value)}
                      placeholder="https://x.com/..."
                      className="w-full h-11 border border-brand-border rounded-xl px-4 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-brand-border flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 bg-brand-black hover:bg-goat-primary text-white font-semibold text-sm h-11 px-4 md:px-6 rounded-xl transition-colors duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span>{isSaving ? "Saving..." : "Save Content"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
