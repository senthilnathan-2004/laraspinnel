"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function FestivalContentSettings() {
  const [formData, setFormData] = useState({
    festival_title: "",
    festival_subtitle: "",
    festival_hindu_desc: "",
    festival_muslim_desc: "",
    festival_christian_desc: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            festival_title: data.festival_title || "Order Your Festival Goat",
            festival_subtitle: data.festival_subtitle || "Special goats available for Hindu, Muslim, and Christian festivals.",
            festival_hindu_desc: data.festival_hindu_desc || "Spotless, unblemished goats specifically chosen for Mariamman and Karuppasamy temple functions (Kidavettu). We ensure correct pallu (teeth) and color preferences according to tradition.",
            festival_muslim_desc: data.festival_muslim_desc || "Healthy, age-appropriate (minimum 1 year old / 2 teeth) livestock fulfilling all Islamic requirements for Bakrid Qurbani and Aqeeqah ceremonies. Hand-fed and well-cared for.",
            festival_christian_desc: data.festival_christian_desc || "Premium quality meat goats for church feasts, Christmas, and Easter celebrations. Available as live goats or bulk processed fresh mutton delivered to your venue.",
          });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load current settings." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Festival content updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to update settings." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Festival Content Settings" />

      <div className="flex-1 p-2 md:p-4 w-full space-y-4 animate-in fade-in duration-200">
        
        {message.text && (
          <div className={`p-4 rounded-xl flex items-start gap-3 border ${
            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            {message.type === 'error' ? <AlertCircle size={20} className="mt-0.5 text-red-600 shrink-0" /> : <CheckCircle size={20} className="mt-0.5 text-green-600 shrink-0" />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-brand-border bg-brand-light-gray/30">
            <h2 className="text-lg font-bold text-brand-black">Homepage Section Content</h2>
            <p className="text-sm text-brand-gray mt-1">Manage the image and text shown on the home page for Festival Goat orders.</p>
          </div>
          
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-brand-gray">
              <Loader2 className="animate-spin text-goat-primary mb-3" size={32} />
              <p className="text-sm font-semibold">Loading settings...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-brand-black mb-1.5">Section Title</label>
                  <input
                    type="text"
                    name="festival_title"
                    value={formData.festival_title}
                    onChange={handleChange}
                    className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none"
                    placeholder="e.g. Order Your Festival Goat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-black mb-1.5">Subtitle / Description</label>
                  <textarea
                    name="festival_subtitle"
                    value={formData.festival_subtitle}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-white border border-brand-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none resize-none"
                    placeholder="Describe the festival goat options..."
                  />
                </div>

                <div className="pt-4 border-t border-brand-border">
                  <h3 className="text-md font-bold text-brand-black mb-4">Function Descriptions</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-brand-black mb-1.5">Hindu Temple Functions Description</label>
                      <textarea
                        name="festival_hindu_desc"
                        value={formData.festival_hindu_desc}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-white border border-brand-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-black mb-1.5">Muslim Festivals Description</label>
                      <textarea
                        name="festival_muslim_desc"
                        value={formData.festival_muslim_desc}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-white border border-brand-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-black mb-1.5">Christian Feast Days Description</label>
                      <textarea
                        name="festival_christian_desc"
                        value={formData.festival_christian_desc}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-white border border-brand-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-brand-black text-white h-11 px-6 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  <span>{isSaving ? "Saving..." : "Save Content"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
