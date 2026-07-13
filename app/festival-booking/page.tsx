"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { festivalBookingSchema, FestivalBookingFormData } from "@/lib/validations";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomSelect from "@/components/shared/CustomSelect";
import CustomDatePicker from "@/components/shared/CustomDatePicker";
import { CalendarHeart, CheckCircle, AlertCircle, Sparkles, Send } from "lucide-react";
import Link from "next/link";

export default function FestivalBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FestivalBookingFormData>({
    resolver: zodResolver(festivalBookingSchema),
    defaultValues: {
      functionCategory: "",
      weightRequired: "",
      preferredColor: "",
      unwantedColor: "",
      preferredAge: "",
      deliveryDate: "",
      deliveryTiming: "",
      customerName: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FestivalBookingFormData) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/festival-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        setSubmitSuccess(true);
        setBookingRef(responseData.bookingRefId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setServerError(responseData.error || "Failed to submit request.");
      }
    } catch (error) {
      setServerError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-gray flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-goat-primary/10 text-goat-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-goat-primary/20">
            <CalendarHeart size={14} />
            <span>Festival & Special Functions</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-brand-black mb-4">
            Custom Festival Goat Order
          </h1>
          <p className="text-brand-gray text-lg max-w-2xl mx-auto">
            Tell us exactly what you need for your special occasion. We handpick the finest goats matching your specific color, weight, and age requirements.
          </p>
        </div>

        {submitSuccess ? (
          <div className="bg-white rounded-[2rem] p-8 md:p-16 text-center shadow-card border border-brand-border animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-brand-black mb-4">Request Received!</h2>
            <p className="text-brand-gray text-lg mb-6 max-w-md mx-auto">
              Your festival goat requirement has been successfully submitted. Our team will review your specific needs and contact you shortly.
            </p>
            <div className="bg-brand-light-gray border border-brand-border rounded-xl p-4 inline-block mb-8">
              <span className="block text-xs font-bold text-brand-gray uppercase tracking-wider mb-1">Your Reference ID</span>
              <span className="font-mono text-xl font-bold text-brand-black">{bookingRef}</span>
            </div>
            <div>
              <Link href="/" className="inline-block bg-brand-black hover:bg-neutral-800 text-white font-bold py-3 px-8 rounded-full transition-colors">
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-card border border-brand-border overflow-hidden">
            <div className="p-4 md:p-10">
              
              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 mb-8">
                  <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
                  <span className="font-medium">{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* 1. Occasion Details */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-4">
                    <Sparkles className="text-goat-primary" size={20} />
                    <h3 className="text-lg font-bold text-brand-black uppercase tracking-wider">1. Occasion Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Function / Festival</label>
                      <CustomSelect
                        options={[
                          { label: "Select Function Type", value: "" },
                          { label: "Hindu Festival (Kida Vettu/Temple)", value: "Hindu Festival (Kida Vettu/Temple)" },
                          { label: "Muslim Festival (Bakrid/Qurbani)", value: "Muslim Festival (Bakrid/Qurbani)" },
                          { label: "Christian Festival", value: "Christian Festival" },
                          { label: "Family Function / Marriage", value: "Family Function/Marriage" },
                          { label: "Other", value: "Other" }
                        ]}
                        value={watch("functionCategory") || ""}
                        onChange={(val) => {
                          setValue("functionCategory", val as any, { shouldValidate: true });
                        }}
                        theme="goat"
                        error={!!errors.functionCategory}
                      />
                      {errors.functionCategory && <p className="text-xs text-red-600 font-semibold">{errors.functionCategory.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Required Weight (approx)</label>
                      <input
                        type="text"
                        placeholder="e.g. 15 kg, 20-25 kg"
                        {...register("weightRequired")}
                        className="w-full h-11 bg-brand-light-gray border border-brand-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none"
                      />
                      {errors.weightRequired && <p className="text-xs text-red-600 font-semibold">{errors.weightRequired.message}</p>}
                    </div>
                  </div>
                </div>

                {/* 2. Goat Preferences */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-4">
                    <Sparkles className="text-goat-primary" size={20} />
                    <h3 className="text-lg font-bold text-brand-black uppercase tracking-wider">2. Specific Requirements</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Preferred Color(s)</label>
                      <input
                        type="text"
                        placeholder="e.g. Pure Black, Brown, White patches"
                        {...register("preferredColor")}
                        className="w-full h-11 bg-brand-light-gray border border-brand-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none"
                      />
                      {errors.preferredColor && <p className="text-xs text-red-600 font-semibold">{errors.preferredColor.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Unwanted Color(s)</label>
                      <input
                        type="text"
                        placeholder="e.g. No White, No Spots"
                        {...register("unwantedColor")}
                        className="w-full h-11 bg-brand-light-gray border border-brand-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none"
                      />
                      {errors.unwantedColor && <p className="text-xs text-red-600 font-semibold">{errors.unwantedColor.message}</p>}
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Preferred Age / Teeth (Pallu)</label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Pallu, 4 Pallu, Young, Adult"
                        {...register("preferredAge")}
                        className="w-full h-11 bg-brand-light-gray border border-brand-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none"
                      />
                      {errors.preferredAge && <p className="text-xs text-red-600 font-semibold">{errors.preferredAge.message}</p>}
                    </div>
                  </div>
                </div>

                {/* 3. Delivery Details */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-4">
                    <Sparkles className="text-goat-primary" size={20} />
                    <h3 className="text-lg font-bold text-brand-black uppercase tracking-wider">3. Delivery Logistics</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Delivery Date</label>
                      <CustomDatePicker
                        value={watch("deliveryDate") || ""}
                        onChange={(val) => {
                          setValue("deliveryDate", val, { shouldValidate: true });
                        }}
                        theme="goat"
                        error={!!errors.deliveryDate}
                        minDate={new Date()}
                      />
                      {errors.deliveryDate && <p className="text-xs text-red-600 font-semibold">{errors.deliveryDate.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Delivery Timing</label>
                      <input
                        type="text"
                        placeholder="e.g. Early Morning 5 AM"
                        {...register("deliveryTiming")}
                        className="w-full h-11 bg-brand-light-gray border border-brand-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none"
                      />
                      {errors.deliveryTiming && <p className="text-xs text-red-600 font-semibold">{errors.deliveryTiming.message}</p>}
                    </div>
                  </div>
                </div>

                {/* 4. Contact Info */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-brand-border pb-2 mb-4">
                    <Sparkles className="text-goat-primary" size={20} />
                    <h3 className="text-lg font-bold text-brand-black uppercase tracking-wider">4. Contact Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Full Name</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        {...register("customerName")}
                        className="w-full h-11 bg-brand-light-gray border border-brand-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none"
                      />
                      {errors.customerName && <p className="text-xs text-red-600 font-semibold">{errors.customerName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        {...register("phone")}
                        className="w-full h-11 bg-brand-light-gray border border-brand-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none"
                      />
                      {errors.phone && <p className="text-xs text-red-600 font-semibold">{errors.phone.message}</p>}
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="For receipt"
                        {...register("email")}
                        className="w-full h-11 bg-brand-light-gray border border-brand-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none"
                      />
                      {errors.email && <p className="text-xs text-red-600 font-semibold">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Delivery Address</label>
                      <textarea
                        placeholder="Full delivery address with pincode"
                        rows={3}
                        {...register("address")}
                        className="w-full bg-brand-light-gray border border-brand-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none resize-none"
                      ></textarea>
                      {errors.address && <p className="text-xs text-red-600 font-semibold">{errors.address.message}</p>}
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">Additional Notes (Optional)</label>
                      <textarea
                        placeholder="Any other specific instructions..."
                        rows={2}
                        {...register("notes")}
                        className="w-full bg-brand-light-gray border border-brand-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-goat-primary hover:bg-goat-dark text-white h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-goat-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send size={20} />
                    )}
                    <span>{isSubmitting ? "Submitting Request..." : "Submit Festival Order"}</span>
                  </button>
                  <p className="text-center text-xs text-brand-gray mt-4">
                    Our team will contact you within 24 hours to confirm availability and exact pricing based on your requirements.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
