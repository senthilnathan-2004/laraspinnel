"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { useToast } from "@/components/admin/Toast";
import {
  TextField,
  TextAreaField,
  ImageField,
  ListEditor,
  ListFieldDef,
  PromoCardListEditor,
} from "@/components/admin/ContentEditors";
import {
  CONTENT_DEFAULTS,
  CONTENT_PLACEHOLDERS,
  DEFAULT_WHY_STEPS,
  DEFAULT_MARQUEE_ITEMS,
  DEFAULT_FOOTER_QUICKLINKS,
  DEFAULT_FOOTER_CATEGORIES,
  DEFAULT_FOOTER_BADGES,
  DEFAULT_PROMO_CARDS,
  parseList,
  WhyStep,
  LinkItem,
  PromoCard,
} from "@/lib/siteContent";
import {
  Loader2,
  Save,
  Home,
  PanelBottom,
  Info,
  Phone,
  FileText,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

type TabId = "home" | "footer" | "about" | "contact" | "policies";

const TABS: { id: TabId; label: string; icon: React.ReactNode; preview: string }[] = [
  { id: "home", label: "Home", icon: <Home size={16} />, preview: "/" },
  { id: "footer", label: "Footer", icon: <PanelBottom size={16} />, preview: "/" },
  { id: "about", label: "About", icon: <Info size={16} />, preview: "/about" },
  { id: "contact", label: "Contact", icon: <Phone size={16} />, preview: "/contact" },
  { id: "policies", label: "Policies", icon: <FileText size={16} />, preview: "/privacy-policy" },
];

const LINK_FIELDS: ListFieldDef[] = [
  { key: "label", label: "Label", placeholder: "Link text" },
  { key: "href", label: "Link", placeholder: "/shop or https://..." },
];
const WHY_FIELDS: ListFieldDef[] = [
  { key: "title", label: "Title", placeholder: "Step title" },
  { key: "desc", label: "Description", placeholder: "Short description" },
];

export default function AdminContentPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("home");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          // CMS-owned keys get their defaults; saved values override.
          setSettings({ ...CONTENT_DEFAULTS, ...data });
        } else {
          showToast("Failed to load site content.", { variant: "error" });
        }
      } catch (err) {
        showToast("Failed to load site content.", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [showToast]);

  const val = (key: string) => settings[key] ?? "";
  const setVal = (key: string, v: string) => setSettings((prev) => ({ ...prev, [key]: v }));
  const ph = (key: string) => CONTENT_PLACEHOLDERS[key];

  const listVal = <T,>(key: string, def: T[]) => parseList<T>(settings[key], def);
  const setListVal = <T,>(key: string, arr: T[]) => setVal(key, JSON.stringify(arr));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast("Content saved. Your public site is updated.", { variant: "success" });
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to save content.", { variant: "error" });
      }
    } catch (err) {
      showToast("Network error. Please try again.", { variant: "error" });
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

  const activePreview = TABS.find((t) => t.id === activeTab)?.preview || "/";

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Website Content" />

      <div className="flex-1 p-3 md:p-6 space-y-6 w-full">
        {/* Intro */}
        <div className="bg-brand-light-gray p-3 md:p-4 rounded-xl border border-brand-border text-brand-black text-sm flex gap-3 items-start">
          <Info size={18} className="shrink-0 text-goat-primary mt-0.5" />
          <div>
            <p className="font-semibold">Control every public page from here</p>
            <p className="text-xs text-brand-gray mt-0.5">
              Pick a page below, edit its content, and press Save — changes go live immediately. Fields
              shown greyed are using the built-in default; type to override, clear to restore the default.
            </p>
          </div>
        </div>

        {/* Tabs + preview + save */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-black text-white"
                    : "bg-white border border-brand-border text-brand-gray hover:text-brand-black"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={activePreview}
              target="_blank"
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border border-brand-border text-brand-black text-sm font-semibold hover:bg-brand-light-gray transition-colors"
            >
              <ExternalLink size={14} /> View page
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-brand-black hover:bg-goat-primary text-white text-sm font-bold transition-colors disabled:bg-neutral-400"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Panels */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card p-4 md:p-6">
          {activeTab === "home" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="Shop by Category — heading">
                <TextField label="Section Title" value={val("home_shop_title")} onChange={(v) => setVal("home_shop_title", v)} placeholder={ph("home_shop_title")} hint="Blank = use site default." />
                <TextAreaField label="Section Subtitle" value={val("home_shop_subtitle")} onChange={(v) => setVal("home_shop_subtitle", v)} placeholder={ph("home_shop_subtitle")} hint="Blank = use site default." />
              </Section>

              <Section title="Why Choose Us">
                <TextField label="Heading" value={val("home_why_title")} onChange={(v) => setVal("home_why_title", v)} />
                <TextAreaField label="Subtitle" value={val("home_why_subtitle")} onChange={(v) => setVal("home_why_subtitle", v)} />
                <ListEditor<WhyStep>
                  label="Feature Steps"
                  items={listVal<WhyStep>("home_why_steps", DEFAULT_WHY_STEPS)}
                  onChange={(arr) => setListVal("home_why_steps", arr)}
                  fields={WHY_FIELDS}
                  addLabel="Add step"
                />
                <p className="text-[10px] text-brand-gray">Icons are assigned automatically in order.</p>
              </Section>

              <Section title="Testimonials — heading & stats">
                <TextField label="Section Title" value={val("home_testimonials_title")} onChange={(v) => setVal("home_testimonials_title", v)} placeholder={ph("home_testimonials_title")} hint="Blank = use site default." />
                <TextAreaField label="Section Subtitle" value={val("home_testimonials_subtitle")} onChange={(v) => setVal("home_testimonials_subtitle", v)} placeholder={ph("home_testimonials_subtitle")} hint="Blank = use site default." />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <TextField label="Stat 1" value={val("home_stat_1")} onChange={(v) => setVal("home_stat_1", v)} placeholder={ph("home_stat_1")} />
                  <TextField label="Stat 2" value={val("home_stat_2")} onChange={(v) => setVal("home_stat_2", v)} placeholder={ph("home_stat_2")} />
                  <TextField label="Stat 3" value={val("home_stat_3")} onChange={(v) => setVal("home_stat_3", v)} placeholder={ph("home_stat_3")} />
                </div>
                <p className="text-[10px] text-brand-gray">The reviews themselves are managed under Testimonials in the sidebar.</p>
              </Section>

              <Section title="Promo Showcase — rotating cards below reviews">
                <PromoCardListEditor
                  items={listVal<PromoCard>("home_promo_cards", DEFAULT_PROMO_CARDS)}
                  onChange={(arr) => setListVal("home_promo_cards", arr)}
                />
                <p className="text-[10px] text-brand-gray">
                  These cards auto-scroll in a 3D rotating carousel on the homepage, directly below the
                  customer reviews section.
                </p>
              </Section>

              <Section title="Scrolling Marquee">
                <ListEditor<string>
                  label="Marquee Items"
                  items={listVal<string>("home_marquee", DEFAULT_MARQUEE_ITEMS)}
                  onChange={(arr) => setListVal("home_marquee", arr)}
                  addLabel="Add item"
                  hint="Short phrase"
                />
              </Section>

              <p className="text-xs text-brand-gray border-t border-brand-border pt-4">
                Hero banners, product cards, and categories are managed on their own admin pages
                (Banners, Products, Categories).
              </p>
            </div>
          )}

          {activeTab === "footer" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="Quick Links column">
                <ListEditor<LinkItem>
                  label="Quick Links"
                  items={listVal<LinkItem>("footer_quicklinks", DEFAULT_FOOTER_QUICKLINKS)}
                  onChange={(arr) => setListVal("footer_quicklinks", arr)}
                  fields={LINK_FIELDS}
                  addLabel="Add link"
                />
              </Section>

              <Section title="Popular Categories column">
                <ListEditor<LinkItem>
                  label="Category Links"
                  items={listVal<LinkItem>("footer_categories", DEFAULT_FOOTER_CATEGORIES)}
                  onChange={(arr) => setListVal("footer_categories", arr)}
                  fields={LINK_FIELDS}
                  addLabel="Add link"
                />
              </Section>

              <Section title="Trust Badges">
                <ListEditor<string>
                  label="Badges"
                  items={listVal<string>("footer_badges", DEFAULT_FOOTER_BADGES)}
                  onChange={(arr) => setListVal("footer_badges", arr)}
                  addLabel="Add badge"
                  hint="Badge text"
                />
              </Section>

              <Section title="Disclaimer & note">
                <TextAreaField label="Product Disclaimer" value={val("footer_disclaimer")} onChange={(v) => setVal("footer_disclaimer", v)} rows={4} />
                <TextField label="Bottom Note" value={val("footer_note")} onChange={(v) => setVal("footer_note", v)} />
              </Section>

              <p className="text-xs text-brand-gray border-t border-brand-border pt-4">
                Footer brand name, tagline, contact details, and social links come from the Contact tab
                and Site Settings.
              </p>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="Intro">
                <TextField label="Title" value={val("about_intro_title")} onChange={(v) => setVal("about_intro_title", v)} placeholder={ph("about_intro_title")} hint="Blank = use site default." />
                <TextAreaField label="Subtitle" value={val("about_intro_subtitle")} onChange={(v) => setVal("about_intro_subtitle", v)} placeholder={ph("about_intro_subtitle")} hint="Blank = use site default." />
                <ImageField label="Intro Image" value={val("about_intro_image")} onChange={(v) => setVal("about_intro_image", v)} hint="Blank = use site default." />
                <TextAreaField label="Paragraph 1" value={val("about_intro_p1")} onChange={(v) => setVal("about_intro_p1", v)} placeholder={ph("about_intro_p1")} rows={4} hint="Blank = use site default." />
                <TextAreaField label="Paragraph 2" value={val("about_intro_p2")} onChange={(v) => setVal("about_intro_p2", v)} placeholder={ph("about_intro_p2")} rows={4} hint="Blank = use site default." />
              </Section>

              <Section title="Why Choose section">
                <TextField label="Heading" value={val("about_why_title")} onChange={(v) => setVal("about_why_title", v)} placeholder={ph("about_why_title")} />
                <TextAreaField label="Subtitle" value={val("about_why_subtitle")} onChange={(v) => setVal("about_why_subtitle", v)} placeholder={ph("about_why_subtitle")} />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField label={`Point ${i} — Title`} value={val(`about_why_${i}_title`)} onChange={(v) => setVal(`about_why_${i}_title`, v)} placeholder={ph(`about_why_${i}_title`)} />
                    <TextField label={`Point ${i} — Description`} value={val(`about_why_${i}_desc`)} onChange={(v) => setVal(`about_why_${i}_desc`, v)} placeholder={ph(`about_why_${i}_desc`)} />
                  </div>
                ))}
              </Section>

              <Section title="Stats (4)">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="grid grid-cols-2 gap-2">
                      <TextField label={`Stat ${i} — Value`} value={val(`about_stat_${i}_val`)} onChange={(v) => setVal(`about_stat_${i}_val`, v)} placeholder={ph(`about_stat_${i}_val`)} />
                      <TextField label={`Stat ${i} — Label`} value={val(`about_stat_${i}_label`)} onChange={(v) => setVal(`about_stat_${i}_label`, v)} placeholder={ph(`about_stat_${i}_label`)} />
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="Contact details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField label="Phone" value={val("contact_phone")} onChange={(v) => setVal("contact_phone", v)} placeholder={ph("contact_phone")} />
                  <TextField label="WhatsApp" value={val("contact_whatsapp")} onChange={(v) => setVal("contact_whatsapp", v)} placeholder={ph("contact_whatsapp")} />
                  <TextField label="Email" value={val("contact_email")} onChange={(v) => setVal("contact_email", v)} placeholder={ph("contact_email")} />
                  <TextField label="Business Hours" value={val("business_hours")} onChange={(v) => setVal("business_hours", v)} placeholder={ph("business_hours")} />
                </div>
                <TextAreaField label="Address" value={val("contact_address")} onChange={(v) => setVal("contact_address", v)} placeholder={ph("contact_address")} />
                <TextAreaField label="Google Maps Embed URL" value={val("contact_map_url")} onChange={(v) => setVal("contact_map_url", v)} placeholder={ph("contact_map_url")} hint="Paste the src URL from Google Maps > Share > Embed a map." />
              </Section>

              <Section title="Social links">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField label="Facebook" value={val("social_facebook")} onChange={(v) => setVal("social_facebook", v)} placeholder={ph("social_facebook")} />
                  <TextField label="Instagram" value={val("social_instagram")} onChange={(v) => setVal("social_instagram", v)} placeholder={ph("social_instagram")} />
                  <TextField label="YouTube" value={val("social_youtube")} onChange={(v) => setVal("social_youtube", v)} placeholder={ph("social_youtube")} />
                  <TextField label="X (Twitter)" value={val("social_x")} onChange={(v) => setVal("social_x", v)} placeholder={ph("social_x")} />
                </div>
                <p className="text-[10px] text-brand-gray">A social icon only appears on the site when its link is filled in. These also power the footer.</p>
              </Section>
            </div>
          )}

          {activeTab === "policies" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <Section title="Privacy Policy">
                <p className="text-[10px] text-brand-gray -mt-1">Leave blank to use the built-in default policy.</p>
                <TiptapEditor value={val("privacy_policy_content")} onChange={(v) => setVal("privacy_policy_content", v)} />
              </Section>
              <Section title="Terms of Service">
                <p className="text-[10px] text-brand-gray -mt-1">Leave blank to use the built-in default terms.</p>
                <TiptapEditor value={val("terms_of_service_content")} onChange={(v) => setVal("terms_of_service_content", v)} />
              </Section>
              <Section title="Editorial Policy">
                <p className="text-[10px] text-brand-gray -mt-1">Leave blank to use the built-in default.</p>
                <TiptapEditor value={val("editorial_policy_content")} onChange={(v) => setVal("editorial_policy_content", v)} />
              </Section>
            </div>
          )}
        </div>

        {/* Bottom save (mobile convenience) */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-brand-black hover:bg-goat-primary text-white text-sm font-bold transition-colors disabled:bg-neutral-400"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-brand-black uppercase tracking-wider border-b border-brand-border pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
