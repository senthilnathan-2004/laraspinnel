"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { Save, Loader2, AlertCircle, CheckCircle, Info, Landmark, Briefcase, Map, Globe, Image as ImageIcon } from "lucide-react";

const DEFAULT_PRIVACY = `
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3">1. Information We Collect</h2>
  <p>We collect information you provide directly to us when you make a booking, subscribe to our newsletter, or contact us for support. This may include your name, email address, phone number, delivery address, and payment information.</p>
</section>
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3 mt-8">2. How We Use Your Information</h2>
  <p>We use the information we collect to fulfill your orders, provide customer service, improve our website, and send you important updates regarding your purchases or our farming practices.</p>
</section>
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3 mt-8">3. Information Sharing</h2>
  <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
</section>
`;

const DEFAULT_TERMS = `
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3">1. Acceptance of Terms</h2>
  <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
</section>
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3 mt-8">2. Products and Orders</h2>
  <p>All livestock and meat orders are subject to availability. We reserve the right to refuse service, cancel orders, or limit quantities at our discretion. Prices are subject to change without notice.</p>
</section>
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3 mt-8">3. Delivery and Refunds</h2>
  <p>Delivery times are estimates and may vary. Due to the perishable nature of our products (meat) and the complexities of livestock transport, refund and return policies are handled on a case-by-case basis. Please contact customer service for any issues with your delivery.</p>
</section>
`;

const DEFAULT_EDITORIAL = `
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3">1. Author Expertise & Integrity</h2>
  <p>All content published on the Ragu Goat Farm website, including blog articles, livestock care guides, and nutritional information, is written, reviewed, and approved by our internal team of experienced agricultural specialists, farmers, and veterinary consultants. We are committed to sharing accurate, safe, and reliable farming practices.</p>
</section>
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3 mt-8">2. Content Review Process</h2>
  <p>Our content undergoes a strict review process to ensure that all animal husbandry advice aligns with modern veterinary science and sustainable agricultural practices before it is published.</p>
</section>
<section>
  <h2 class="text-2xl font-bold text-brand-black mb-3 mt-8">3. Corrections and Updates</h2>
  <p>We frequently review older content to ensure it remains accurate and up-to-date. If errors are discovered, we will promptly correct the content and note the date of modification.</p>
</section>
`;

const DEFAULT_PHILOSOPHY = `
<p>At Ragu Estate, we take immense pride in raising healthy, pasture-fed animals across Villupuram and surrounding districts. Whether you are looking for premium Boer, Tellicherry, or native Naatu breeds for agriculture or festivals like Bakrid, we guarantee the highest standard of livestock. Our bulk delivery service ensures that you receive hygienic, freshly prepared cuts tailored for your special events and commercial needs, delivered promptly to your location.</p>
<h3>Sustainable Agriculture & Rearing</h3>
<p>With years of expertise in animal husbandry, we prioritize animal welfare, organic feeding practices, and regular veterinary checkups. Buy directly from our pastures to enjoy unmatched excellence, transparent pricing, and reliable delivery across Tamil Nadu. Experience the difference of true source-to-table superiority today. Our flocks are allowed to roam freely on extensive green lands, consuming a natural diet that significantly enhances their health and vitality.</p>
<h3>Hygienic Processing & Superior Standard</h3>
<p>When it comes to our premium protein offerings, hygiene is our utmost priority. Our processing facilities adhere strictly to modern cleanliness protocols, ensuring every batch of meat is safely handled, carefully inspected, and cleanly packaged. We avoid any artificial preservatives or hormones. This rigorous dedication guarantees that our clients always receive the freshest, most tender cuts available on the market, perfect for home cooking, large family gatherings, or catering services.</p>
<h3>Committed to Community & Tradition</h3>
<p>We believe in upholding the agricultural traditions of Tamil Nadu while employing modern techniques to improve yield and animal health. Our estate works closely with local communities, providing employment and supporting sustainable local ecosystems. Every purchase directly supports these rural economies and helps preserve traditional rearing methods that have been passed down for generations.</p>
<h4>Sustainable Future</h4>
<p>Our vision is to continue expanding our green pastures while reducing our carbon hoofprint.</p>
<h5>Local Partnerships</h5>
<p>We partner with local farmers to share our veterinary insights.</p>
<h6>Join Us</h6>
<p>Support sustainable farming by choosing Ragu Goat Farm for your next purchase.</p>
`;

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"branding" | "business" | "districts" | "seo" | "animations" | "policies" | "homepage">("branding");
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
    privacy_policy_content: "",
    terms_of_service_content: "",
    editorial_policy_content: "",
    philosophy_content: "",
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
          setSettings((prev: any) => ({ 
            ...prev, 
            ...data,
            privacy_policy_content: data.privacy_policy_content?.trim() ? data.privacy_policy_content : DEFAULT_PRIVACY,
            terms_of_service_content: data.terms_of_service_content?.trim() ? data.terms_of_service_content : DEFAULT_TERMS,
            editorial_policy_content: data.editorial_policy_content?.trim() ? data.editorial_policy_content : DEFAULT_EDITORIAL,
            philosophy_content: data.philosophy_content?.trim() ? data.philosophy_content : DEFAULT_PHILOSOPHY,
          }));
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

              <button
                onClick={() => setActiveTab("homepage")}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold border-b-2 outline-none whitespace-nowrap transition-colors ${
                  activeTab === "homepage"
                    ? "border-goat-primary text-goat-primary"
                    : "border-transparent text-brand-gray hover:text-brand-black"
                }`}
              >
                <Landmark size={16} />
                <span>Homepage</span>
              </button>

              <button
                onClick={() => setActiveTab("policies")}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold border-b-2 outline-none whitespace-nowrap transition-colors ${
                  activeTab === "policies"
                    ? "border-goat-primary text-goat-primary"
                    : "border-transparent text-brand-gray hover:text-brand-black"
                }`}
              >
                <Briefcase size={16} />
                <span>Policies</span>
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
                        placeholder="+91 9442379832"
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
                        placeholder="+91 9442379832"
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
                        placeholder="senthilraguanthan2004@gmail.com"
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
                        placeholder="2/90 MettuStreet, Therkunam, Villupuram"
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

              {/* POLICIES TAB */}
              {activeTab === "policies" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-brand-light-gray p-3 md:p-4 rounded-xl border border-brand-border text-brand-black text-sm flex gap-3 items-start">
                    <Info size={18} className="shrink-0 text-goat-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Legal & Policy Pages</p>
                      <p className="text-xs text-brand-gray mt-0.5">
                        Edit the content for your site's policy pages. You can use basic HTML tags (like &lt;p&gt;, &lt;strong&gt;, &lt;h2&gt;) for formatting. If left blank, the site will show the default placeholder policies.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                      Privacy Policy Content
                    </label>
                    <TiptapEditor 
                      value={settings.privacy_policy_content} 
                      onChange={(val) => handleChange("privacy_policy_content", val)} 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                      Terms of Service Content
                    </label>
                    <TiptapEditor 
                      value={settings.terms_of_service_content} 
                      onChange={(val) => handleChange("terms_of_service_content", val)} 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                      Editorial Policy Content
                    </label>
                    <TiptapEditor 
                      value={settings.editorial_policy_content} 
                      onChange={(val) => handleChange("editorial_policy_content", val)} 
                    />
                  </div>
                </div>
              )}

              {/* HOMEPAGE TAB */}
              {activeTab === "homepage" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-brand-light-gray p-3 md:p-4 rounded-xl border border-brand-border text-brand-black text-sm flex gap-3 items-start">
                    <Info size={18} className="shrink-0 text-goat-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Homepage Content</p>
                      <p className="text-xs text-brand-gray mt-0.5">
                        Edit the content displayed on your homepage. The "Our Philosophy" section supports rich text formatting.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                      Our Philosophy Content
                    </label>
                    <TiptapEditor 
                      value={settings.philosophy_content} 
                      onChange={(val) => handleChange("philosophy_content", val)} 
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
