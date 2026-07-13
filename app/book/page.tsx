"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomSelect from "@/components/shared/CustomSelect";
import CustomDatePicker from "@/components/shared/CustomDatePicker";
import { bookingSchema } from "@/lib/validations";
import { useSettings } from "@/hooks/useSettings";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Leaf, Flame, CheckCircle } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as "goat" | "mutton") || "goat";
  const initialProductId = searchParams.get("id") || "";
  const initialWeight = searchParams.get("weight") || "";

  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState<"goat" | "mutton">(initialType);
  const [selectedProductDetails, setSelectedProductDetails] = useState<any>(null);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [refId, setRefId] = useState("");
  const [submitError, setSubmitError] = useState("");
  const { settings } = useSettings();

  const districts = settings.mutton_districts 
    ? settings.mutton_districts.split(",") 
    : ["Coimbatore", "Tiruppur", "Erode", "Villupuram"];

  // Fetch product list dynamically based on selection
  const { data: products = [], isLoading: productsLoading } = useSWR(
    productType === "goat" ? "/api/goats" : "/api/mutton",
    fetcher
  );

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onBlur",
    defaultValues: {
      customerName: "",
      phone: "",
      altPhone: "",
      email: "",
      productType: initialType,
      varietyOrPackId: initialProductId,
      varietyOrPackName: "",
      weightSelection: initialWeight,
      quantity: 1,
      preferredDate: "",
      deliveryTiming: "",
      deliveryAddress: "",
      district: "",
      manualDistrict: "",
      notes: "",
    },
  });

  const watchProductId = watch("varietyOrPackId");
  const watchQty = watch("quantity");

  // Keep type state and react-hook-form value in sync
  const handleTypeChange = (type: "goat" | "mutton") => {
    setProductType(type);
    setValue("productType", type);
    setValue("varietyOrPackId", "");
    setValue("varietyOrPackName", "");
    setSelectedProductDetails(null);
  };

  // Find and store selected product details
  useEffect(() => {
    if (products.length > 0 && watchProductId) {
      const found = products.find((p: any) => p._id === watchProductId);
      if (found) {
        setValue("varietyOrPackName", found.name);
        setSelectedProductDetails(found);
      }
    }
  }, [watchProductId, products, setValue]);

  // If initial search parameters provide an ID, pre-fill it once product list loads
  useEffect(() => {
    if (initialProductId && products.length > 0) {
      setValue("varietyOrPackId", initialProductId);
    }
  }, [initialProductId, products, setValue]);

  const handleNextStep = async () => {
    // Validate Step 1 fields
    const step1Valid = await trigger([
      "productType",
      "varietyOrPackId",
      "varietyOrPackName",
      "quantity",
    ]);
    if (step1Valid) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const onSubmit = async (data: any) => {
    setSubmitError("");
    if (data.district === "Other" && data.manualDistrict) {
      data.district = data.manualDistrict;
    }
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setRefId(result.bookingRefId);
        setIsSuccess(true);
      } else {
        setSubmitError(result.error || "Failed to submit booking.");
      }
    } catch (err) {
      setSubmitError("Network error. Please try again.");
    }
  };

  const isGoatTheme = productType === "goat";

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-12 w-full space-y-8 select-none">
        {/* Success Overlay Panel */}
        <AnimatePresence>
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-brand-border rounded-2xl p-3 md:p-4 md:p-8 shadow-hover text-center space-y-6 max-w-lg mx-auto py-16 animate-in duration-300"
            >
              {/* Animated checkmark circle */}
              <div className="flex items-center justify-center">
                <CheckCircle
                  weight="fill"
                  size={72}
                  className={isGoatTheme ? "text-goat-primary" : "text-mutton-primary"}
                />
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h2 className="font-display text-3xl text-brand-black uppercase">
                  Booking Received!
                </h2>
                <p className="text-sm font-medium text-brand-gray">
                  Thank you for choosing Ragu Goat Farm. We have received your reservation.
                </p>
              </div>

              {/* Reference ID card */}
              <div className="bg-brand-light-gray p-3 md:p-4 rounded-xl border border-brand-border inline-block">
                <span className="text-[10px] text-brand-gray uppercase font-bold block">
                  Your Reference ID
                </span>
                <span className="font-mono text-lg font-bold text-brand-black tracking-wider block mt-1">
                  {refId}
                </span>
              </div>

              <p className="text-xs text-brand-gray max-w-xs mx-auto leading-relaxed">
                Our farm coordinator will call you shortly on your provided phone number to confirm portion sizing, weights, and arrange delivery.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => router.push("/")}
                  className={`px-4 md:px-6 py-2.5 rounded-full text-white font-semibold text-sm transition-all cursor-pointer ${
                    isGoatTheme ? "bg-goat-primary hover:bg-goat-hover" : "bg-mutton-primary hover:bg-mutton-hover"
                  }`}
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          ) : (
            /* Main Booking Form Block */
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2 text-center">
                <h1 className="font-display text-4xl text-brand-black uppercase tracking-wide">
                  Book Your Order
                </h1>
                <p className="text-sm text-brand-gray max-w-md mx-auto">
                  Submit your reservation online. We Slaughter morning-fresh and ship specialized livestock transits.
                </p>
              </div>

              {/* Step indicator progress bar */}
              <div className="flex items-center justify-center gap-4 text-xs font-semibold select-none">
                <div
                  className={`flex items-center gap-1.5 ${
                    step >= 1
                      ? isGoatTheme
                        ? "text-goat-primary"
                        : "text-mutton-primary"
                      : "text-neutral-400"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold ${
                      step >= 1
                        ? isGoatTheme
                          ? "bg-goat-tint border-goat-primary"
                          : "bg-mutton-tint border-mutton-primary"
                        : "border-neutral-300"
                    }`}
                  >
                    1
                  </span>
                  <span>Select Product</span>
                </div>
                <div className="w-12 h-px bg-brand-border"></div>
                <div className={`flex items-center gap-1.5 ${step === 2 ? (isGoatTheme ? "text-goat-primary" : "text-mutton-primary") : "text-neutral-400"}`}>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold ${
                      step === 2
                        ? isGoatTheme
                          ? "bg-goat-tint border-goat-primary"
                          : "bg-mutton-tint border-mutton-primary"
                        : "border-neutral-300"
                    }`}
                  >
                    2
                  </span>
                  <span>Delivery Details</span>
                </div>
              </div>

              {/* Submit Error alert */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 md:p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
                  <span className="font-medium">{submitError}</span>
                </div>
              )}

              {/* The Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white border border-brand-border rounded-2xl shadow-card p-3 md:p-6 space-y-6"
              >
                {/* STEP 1: PRODUCT SELECTION */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Theme Toggle switches */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                        Select Order Category:
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleTypeChange("goat")}
                          className={`h-14 border rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                            isGoatTheme
                              ? "bg-goat-tint border-goat-primary text-goat-text shadow-xs"
                              : "bg-white border-brand-border text-brand-black hover:bg-brand-light-gray"
                          }`}
                        >
                          <Leaf
                            size={20}
                            weight="duotone"
                            className={isGoatTheme ? "text-goat-primary" : "text-brand-gray"}
                          />
                          <span>Live Goats</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTypeChange("mutton")}
                          className={`h-14 border rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                            !isGoatTheme
                              ? "bg-mutton-tint border-mutton-primary text-mutton-text shadow-xs"
                              : "bg-white border-brand-border text-brand-black hover:bg-brand-light-gray"
                          }`}
                        >
                          <Flame
                            size={20}
                            weight="duotone"
                            className={!isGoatTheme ? "text-mutton-primary" : "text-brand-gray"}
                          />
                          <span>Bulk Mutton</span>
                        </button>
                      </div>
                    </div>

                    {/* Specific product selection dropdown */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                        Choose breed variety or pack:
                      </label>
                      {productsLoading ? (
                        <div className="h-11 bg-brand-light-gray rounded-xl border border-brand-border animate-pulse flex items-center px-4 text-xs text-brand-gray">
                          Loading products...
                        </div>
                      ) : (
                        <CustomSelect
                          options={[
                            { label: "-- Choose Option --", value: "" },
                            ...products.map((p: any) => ({
                              label: `${p.name} ${p.priceEstimate ? `(${p.priceEstimate})` : `(${p.price})`}`,
                              value: p._id
                            }))
                          ]}
                          value={watch("varietyOrPackId") || ""}
                          onChange={(val) => {
                            setValue("varietyOrPackId", val, { shouldValidate: true });
                          }}
                          theme={isGoatTheme ? "goat" : "mutton"}
                          error={!!errors.varietyOrPackId}
                        />
                      )}
                      {errors.varietyOrPackId && (
                        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                          <AlertCircle size={12} />
                          <span>Please select a product option.</span>
                        </p>
                      )}
                    </div>

                    {/* Quantity field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                        Quantity Required:
                      </label>
                      <input
                        type="number"
                        min={1}
                        {...register("quantity")}
                        className={`w-full sm:max-w-xs h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 ${
                          isGoatTheme ? "focus:ring-goat-primary" : "focus:ring-mutton-primary"
                        }`}
                      />
                      {errors.quantity && (
                        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                          <AlertCircle size={12} />
                          <span>{(errors.quantity as any).message}</span>
                        </p>
                      )}
                    </div>

                    {/* Weight Selection (Mutton Only) */}
                    {!isGoatTheme && selectedProductDetails?.weightOptions?.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                          Selected Weight Option:
                        </label>
                        <CustomSelect
                          options={[
                            { label: "-- Choose Weight --", value: "" },
                            ...selectedProductDetails.weightOptions.map((opt: string) => ({
                              label: opt,
                              value: opt
                            }))
                          ]}
                          value={watch("weightSelection") || ""}
                          onChange={(val) => {
                            setValue("weightSelection", val, { shouldValidate: true });
                          }}
                          theme="mutton"
                        />
                      </div>
                    )}

                    {/* Product Summary Details */}
                    {selectedProductDetails && (
                      <div className="p-3 md:p-4 bg-brand-light-gray rounded-2xl border border-brand-border space-y-2 text-sm animate-in fade-in duration-100">
                        <div className="font-semibold text-brand-black">Selected Product Specs:</div>
                        <div className="grid grid-cols-2 text-xs gap-1.5 pt-1 text-brand-gray">
                          {isGoatTheme ? (
                            <>
                              <div>Breed class: {selectedProductDetails.breed}</div>
                              <div>Weight range: {selectedProductDetails.weightRange}</div>
                              <div>Age: {selectedProductDetails.ageRange}</div>
                            </>
                          ) : (
                            <>
                              <div>Slaughter rate: {selectedProductDetails.price}</div>
                              <div>Portion options: {selectedProductDetails.weightOptions?.join(", ")}</div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 1 Actions */}
                    <div className="border-t border-brand-border pt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className={`inline-flex items-center gap-2 h-11 px-4 md:px-6 font-semibold text-sm rounded-xl text-white transition-colors cursor-pointer ${
                          isGoatTheme
                            ? "bg-goat-primary hover:bg-goat-hover"
                            : "bg-mutton-primary hover:bg-mutton-hover"
                        }`}
                      >
                        <span>Next Step</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: PERSONAL & DELIVERY DETAILS */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
                            <User size={16} />
                          </div>
                          <input
                            type="text"
                            {...register("customerName")}
                            placeholder="Ramesh Kumar"
                            className={`w-full h-11 bg-white border border-brand-border rounded-xl pl-10 pr-4 text-sm text-brand-black outline-none focus:ring-2 ${
                              isGoatTheme ? "focus:ring-goat-primary" : "focus:ring-mutton-primary"
                            }`}
                          />
                        </div>
                        {errors.customerName && (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            <span>{(errors.customerName as any).message}</span>
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
                            <Phone size={16} />
                          </div>
                          <input
                            type="tel"
                            {...register("phone")}
                            placeholder="9876543210"
                            className={`w-full h-11 bg-white border border-brand-border rounded-xl pl-10 pr-4 text-sm text-brand-black outline-none focus:ring-2 ${
                              isGoatTheme ? "focus:ring-goat-primary" : "focus:ring-mutton-primary"
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            <span>{(errors.phone as any).message}</span>
                          </p>
                        )}
                      </div>

                      {/* Alt Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                          Alternate Phone (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
                            <Phone size={16} />
                          </div>
                          <input
                            type="tel"
                            {...register("altPhone")}
                            placeholder="9876543211"
                            className={`w-full h-11 bg-white border border-brand-border rounded-xl pl-10 pr-4 text-sm text-brand-black outline-none focus:ring-2 ${
                              isGoatTheme ? "focus:ring-goat-primary" : "focus:ring-mutton-primary"
                            }`}
                          />
                        </div>
                        {errors.altPhone && (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            <span>{(errors.altPhone as any).message}</span>
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                          Email Address (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
                            <Mail size={16} />
                          </div>
                          <input
                            type="email"
                            {...register("email")}
                            placeholder="ramesh@gmail.com"
                            className={`w-full h-11 bg-white border border-brand-border rounded-xl pl-10 pr-4 text-sm text-brand-black outline-none focus:ring-2 ${
                              isGoatTheme ? "focus:ring-goat-primary" : "focus:ring-mutton-primary"
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            <span>{(errors.email as any).message}</span>
                          </p>
                        )}
                      </div>

                      {/* Preferred Delivery Date */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                          Preferred Delivery Date
                        </label>
                        <CustomDatePicker
                          value={watch("preferredDate") || ""}
                          onChange={(val) => {
                            setValue("preferredDate", val, { shouldValidate: true });
                          }}
                          theme={isGoatTheme ? "goat" : "mutton"}
                          error={!!errors.preferredDate}
                          minDate={new Date()}
                        />
                        {errors.preferredDate && (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            <span>{(errors.preferredDate as any).message}</span>
                          </p>
                        )}
                      </div>

                      {/* Delivery Timing */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                          Delivery Timing (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
                            <Calendar size={16} />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. Morning 10 AM, Afternoon..."
                            {...register("deliveryTiming")}
                            className={`w-full h-11 bg-white border border-brand-border rounded-xl pl-10 pr-4 text-sm text-brand-black outline-none focus:ring-2 ${
                              isGoatTheme ? "focus:ring-goat-primary" : "focus:ring-mutton-primary"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Delivery District selector (Conditional for mutton or optional for goat) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                          Delivery District
                        </label>
                          <CustomSelect
                            options={[
                              { label: "-- Choose District --", value: "" },
                              ...(!isGoatTheme
                                ? districts.map((d: string) => ({ label: d, value: d }))
                                : [
                                    "Coimbatore", "Tiruppur", "Erode", "Villupuram",
                                    "Chennai", "Madurai", "Trichy", "Salem", "Other"
                                  ].map((d) => ({
                                    label: d === "Other" ? "Other Tamil Nadu District" : d,
                                    value: d
                                  })))
                            ]}
                            value={watch("district") || ""}
                            onChange={(val) => {
                              setValue("district", val, { shouldValidate: true });
                            }}
                            theme={isGoatTheme ? "goat" : "mutton"}
                            error={!!errors.district}
                            icon={<MapPin size={16} />}
                          />
                        {errors.district && (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            <span>{(errors.district as any).message}</span>
                          </p>
                        )}
                      </div>

                      {/* Manual District input */}
                      {watch("district") === "Other" && isGoatTheme && (
                        <div className="space-y-1.5 col-span-1 md:col-span-2">
                          <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                            Enter Your District
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
                              <MapPin size={16} />
                            </div>
                            <input
                              type="text"
                              placeholder="e.g. Kanyakumari, Tirunelveli..."
                              {...register("manualDistrict")}
                              className="w-full h-11 bg-white border border-brand-border rounded-xl pl-10 pr-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                        Full Delivery Address
                      </label>
                      <textarea
                        rows={3}
                        {...register("deliveryAddress")}
                        placeholder="House Number, Street Name, Town / Area name..."
                        className={`w-full bg-white border border-brand-border rounded-xl p-3 md:p-4 text-sm text-brand-black outline-none focus:ring-2 resize-none ${
                          isGoatTheme ? "focus:ring-goat-primary" : "focus:ring-mutton-primary"
                        }`}
                      ></textarea>
                      {errors.deliveryAddress && (
                        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                          <AlertCircle size={12} />
                          <span>{(errors.deliveryAddress as any).message}</span>
                        </p>
                      )}
                    </div>

                    {/* Special Notes */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                        Special Instructions / Notes (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3.5 text-brand-gray pointer-events-none">
                          <FileText size={16} />
                        </div>
                        <textarea
                          rows={2}
                          {...register("notes")}
                          placeholder="e.g. Cut preferences (for mutton), specialized delivery slots, etc."
                          className={`w-full bg-white border border-brand-border rounded-xl pl-10 pr-4 py-3 text-sm text-brand-black outline-none focus:ring-2 resize-none ${
                            isGoatTheme ? "focus:ring-goat-primary" : "focus:ring-mutton-primary"
                          }`}
                        ></textarea>
                      </div>
                    </div>

                    {/* Step 2 Actions */}
                    <div className="border-t border-brand-border pt-6 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center gap-1.5 h-11 px-5 text-sm font-semibold border border-brand-border rounded-xl text-brand-black hover:bg-brand-light-gray cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center justify-center gap-2 h-11 px-7 font-semibold text-sm rounded-xl text-white transition-colors disabled:opacity-50 cursor-pointer ${
                          isGoatTheme
                            ? "bg-goat-primary hover:bg-goat-hover"
                            : "bg-mutton-primary hover:bg-mutton-hover"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Confirming Booking...</span>
                          </>
                        ) : (
                          <span>Submit Booking Request</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingFormPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-neutral-200 border-t-goat-primary animate-spin"></div>
        </div>
      }
    >
      <BookingForm />
    </Suspense>
  );
}

// Extract formState for cleanliness
function formStateShim() {
  return null;
}
