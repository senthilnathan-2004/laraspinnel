"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";
import { Save, Loader2, AlertCircle, CheckCircle, Info, Landmark, Briefcase, Map, Globe, Image as ImageIcon } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"branding" | "business" | "districts" | "seo" | "animations">("branding");
  const [settings, setSettings] = useState<any>({
    farm_name: "",
    tagline: "",
    logo_url: "",
    favicon_url: "",
    contact_phone: "",
    contact_whatsapp: "",
    contact_email: "",
    contact_address: "",
    business_hours: "",
    mutton_districts: "",
    seo_title: "",
    seo_description: "",
    variety_marquee_images: "[]",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          // Merge fetched settings with default placeholders
          setSettings((prev: any) => ({ ...prev, ...data }));
        } else {
          setError("Failed to load site settings.");
        }
      } catch (err) {
        setError("Failed to load site settings.");
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
    if (!settings.farm_name || !settings.contact_phone || !settings.contact_whatsapp || !settings.contact_email || !settings.contact_address || !settings.business_hours || !settings.mutton_districts || !settings.seo_title || !settings.seo_description) {
      setError("Please fill in all required fields.");
      return;
    }
    
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
        setError(data.error || "Failed to update settings.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Site Settings" />

      <div className="flex-1 p-3 md:p-6 w-full space-y-6">
        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 md:p-4 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-3 md:p-4 rounded-xl flex items-start gap-3">
            <CheckCircle size={18} className="shrink-0 text-green-600 mt-0.5" />
            <span className="font-medium">Settings saved successfully!</span>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white border border-brand-border rounded-2xl shadow-card p-12 text-center text-brand-gray flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-goat-primary" size={40} />
            <p className="text-sm font-semibold">Loading settings...</p>
          </div>
        ) : (
          <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
            {/* Settings Tabs Toolbar */}
            <div className="flex border-b border-brand-border overflow-x-auto">
              <button
                onClick={() => setActiveTab("branding")}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold border-b-2 outline-none whitespace-nowrap transition-colors ${
                  activeTab === "branding"
                    ? "border-goat-primary text-goat-primary"
                    : "border-transparent text-brand-gray hover:text-brand-black"
                }`}
              >
                <Landmark size={16} />
                <span>Branding</span>
              </button>

              <button
                onClick={() => setActiveTab("business")}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold border-b-2 outline-none whitespace-nowrap transition-colors ${
                  activeTab === "business"
                    ? "border-goat-primary text-goat-primary"
                    : "border-transparent text-brand-gray hover:text-brand-black"
                }`}
              >
                <Briefcase size={16} />
                <span>Business Info</span>
              </button>

              <button
                onClick={() => setActiveTab("districts")}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold border-b-2 outline-none whitespace-nowrap transition-colors ${
                  activeTab === "districts"
                    ? "border-goat-primary text-goat-primary"
                    : "border-transparent text-brand-gray hover:text-brand-black"
                }`}
              >
                <Map size={16} />
                <span>Districts</span>
              </button>

              <button
                onClick={() => setActiveTab("seo")}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold border-b-2 outline-none whitespace-nowrap transition-colors ${
                  activeTab === "seo"
                    ? "border-goat-primary text-goat-primary"
                    : "border-transparent text-brand-gray hover:text-brand-black"
                }`}
              >
                <Globe size={16} />
                <span>SEO Defaults</span>
              </button>

              <button
                onClick={() => setActiveTab("animations")}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold border-b-2 outline-none whitespace-nowrap transition-colors ${
                  activeTab === "animations"
                    ? "border-goat-primary text-goat-primary"
                    : "border-transparent text-brand-gray hover:text-brand-black"
                }`}
              >
                <ImageIcon size={16} />
                <span>Animations</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-3 md:p-6 space-y-6" noValidate>
              {/* BRANDING TAB */}
              {activeTab === "branding" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        Farm / Business Name
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.farm_name}
                        onChange={(e) => handleChange("farm_name", e.target.value)}
                        placeholder="Ragu Goat Farm"
                        className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        Slogan / Tagline
                      </label>
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => handleChange("tagline", e.target.value)}
                        placeholder="Fresh, healthy, farm-raised live goats..."
                        className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        Website Logo URL
                      </label>
                      <ImageUploadDropzone
                        value={settings.logo_url ? [settings.logo_url] : []}
                        onChange={(urls) => handleChange("logo_url", urls[0] || "")}
                        maxFiles={1}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        Website Favicon URL
                      </label>
                      <ImageUploadDropzone
                        value={settings.favicon_url ? [settings.favicon_url] : []}
                        onChange={(urls) => handleChange("favicon_url", urls[0] || "")}
                        maxFiles={1}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BUSINESS INFO TAB */}
              {activeTab === "business" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-sm">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.contact_phone}
                        onChange={(e) => handleChange("contact_phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        WhatsApp Contact
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.contact_whatsapp}
                        onChange={(e) => handleChange("contact_whatsapp", e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={settings.contact_email}
                        onChange={(e) => handleChange("contact_email", e.target.value)}
                        placeholder="info@ragugoatfarm.com"
                        className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        Business Hours
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.business_hours}
                        onChange={(e) => handleChange("business_hours", e.target.value)}
                        placeholder="Monday - Sunday: 6:00 AM - 8:00 PM"
                        className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        Farm Address
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={settings.contact_address}
                        onChange={(e) => handleChange("contact_address", e.target.value)}
                        placeholder="123 Farm Road, Villupuram, Tamil Nadu"
                        className="w-full bg-white border border-brand-border rounded-xl p-3 md:p-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* DISTRICTS TAB */}
              {activeTab === "districts" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-brand-light-gray p-3 md:p-4 rounded-xl border border-brand-border text-brand-black text-sm flex gap-3 items-start">
                    <Info size={18} className="shrink-0 text-goat-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Mutton Delivery Service Districts</p>
                      <p className="text-xs text-brand-gray mt-0.5">
                        Districts entered here will constrain the mutton order form options and detail badge indicators on the public site.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                      Districts Coverage (comma separated)
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.mutton_districts}
                      onChange={(e) => handleChange("mutton_districts", e.target.value)}
                      placeholder="Coimbatore, Tiruppur, Erode, Villupuram"
                      className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                    />
                  </div>
                </div>
              )}

              {/* SEO TAB */}
              {activeTab === "seo" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        Default Page Title
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.seo_title}
                        onChange={(e) => handleChange("seo_title", e.target.value)}
                        placeholder="Ragu Goat Farm | Premium Live Goats"
                        className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                        Default Meta Description
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={settings.seo_description}
                        onChange={(e) => handleChange("seo_description", e.target.value)}
                        placeholder="Order premium breed live goats delivered across Tamil Nadu..."
                        className="w-full bg-white border border-brand-border rounded-xl p-3 md:p-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* ANIMATIONS TAB */}
              {activeTab === "animations" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-brand-light-gray p-3 md:p-4 rounded-xl border border-brand-border text-brand-black text-sm flex gap-3 items-start">
                    <Info size={18} className="shrink-0 text-goat-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Goat Varieties Scrolling Marquee</p>
                      <p className="text-xs text-brand-gray mt-0.5">
                        Upload up to 10 small images of different goat varieties to be displayed in the scrolling animation on the home page.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                      Marquee Images
                    </label>
                    <ImageUploadDropzone
                      value={
                        settings.variety_marquee_images
                          ? (() => {
                              try {
                                const parsed = JSON.parse(settings.variety_marquee_images);
                                return Array.isArray(parsed) ? parsed : [];
                              } catch (e) {
                                return [];
                              }
                            })()
                          : []
                      }
                      onChange={(urls) => handleChange("variety_marquee_images", JSON.stringify(urls))}
                      maxFiles={10}
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-brand-border pt-6">
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
                      <span>Save Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
