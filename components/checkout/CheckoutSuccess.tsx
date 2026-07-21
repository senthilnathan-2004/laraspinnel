"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, ArrowLeft, Gift, Scissors, Heart, CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

interface CheckoutSuccessProps {
  orderNumber: string;
  email: string;
  whatsappUrl: string;
  contactPhone: string;
}

export default function CheckoutSuccess({
  orderNumber,
  email,
  whatsappUrl,
  contactPhone,
}: CheckoutSuccessProps) {
  
  // Apple/Amazon style premium entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-[#3a3028] to-brand-black opacity-80" />
      
      <motion.div 
        className="w-full max-w-2xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating Paper Card */}
        <div className="paper-texture floating-card crease-overlay rounded-[32px] p-8 sm:p-12 relative overflow-hidden text-center shadow-2xl mx-auto border border-white/50">
          
          {/* Decorative Watercolor Blobs */}
          <div className="watercolor-blob w-64 h-64 bg-rose-300/40 -top-16 -left-16" />
          <div className="watercolor-blob w-72 h-72 bg-amber-200/40 -bottom-20 -right-20" />
          <div className="watercolor-blob w-48 h-48 bg-primary/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Animated SVG Thread tracing around the center */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" viewBox="0 0 400 600" preserveAspectRatio="none">
             <motion.path
                d="M 50,50 C 150,-20 300,100 350,50 C 420,150 350,300 350,450 C 350,550 200,620 100,550 C -20,480 20,300 50,200 C 80,100 20,80 50,50 Z"
                fill="none"
                stroke="#C9A15A"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
             />
             <motion.path
                d="M 80,80 C 180,20 280,80 320,120 C 380,200 320,350 320,420 C 300,500 150,520 80,480 C 20,420 50,250 80,180 C 100,120 40,100 80,80 Z"
                fill="none"
                stroke="#8FA88A"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 3, ease: "easeInOut", delay: 0.8 }}
             />
          </svg>

          {/* Decorative Icons surrounding the center */}
          <motion.div variants={itemVariants} className="absolute top-12 left-12 text-goat-primary/60 rotate-[-15deg] hidden sm:block">
            <Gift size={48} strokeWidth={1} />
          </motion.div>
          <motion.div variants={itemVariants} className="absolute bottom-16 right-16 text-rose-primary/60 rotate-[15deg] hidden sm:block">
            <Heart size={48} strokeWidth={1} />
          </motion.div>
          <motion.div variants={itemVariants} className="absolute bottom-20 left-16 text-gold-primary/60 rotate-[-25deg] hidden sm:block">
            <Scissors size={40} strokeWidth={1.5} />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
            
            <motion.div variants={itemVariants} className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-sm border border-goat-primary/20 flex items-center justify-center shadow-lg">
              <CheckCircle2 size={48} className="text-goat-primary" />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 relative">
              {/* Elegant script/display font for the main title */}
              <h1 className="font-display text-4xl sm:text-5xl text-brand-black tracking-wide leading-tight">
                Thank You <br/>
                <span className="text-3xl text-brand-gray font-body font-normal italic">for shopping</span>
              </h1>
              
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 inline-block shadow-sm border border-brand-border/50">
                <p className="text-sm font-semibold text-brand-black">
                  Order Number: <span className="text-goat-primary select-all">{orderNumber}</span>
                </p>
              </div>
              
              <p className="text-sm text-brand-gray max-w-sm mx-auto leading-relaxed">
                Thank you for supporting handcrafted art! We will contact you shortly to confirm shipping details and delivery date.
                {email.trim() && ` A confirmation email is also on its way to ${email.trim()}.`}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full bg-white/40 backdrop-blur-md border border-brand-border/40 rounded-3xl p-6 space-y-5">
              <h3 className="font-bold text-xs text-brand-black uppercase tracking-widest opacity-80">Confirm Your Order</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 text-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FaWhatsapp size={20} /> Chat on WhatsApp
                </a>
                <a
                  href={`tel:${contactPhone}`}
                  className="flex-1 bg-brand-black hover:bg-goat-primary text-white font-bold py-3.5 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 text-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Phone size={18} /> Call Us
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-gray hover:text-goat-primary transition-colors py-2 px-4 rounded-full hover:bg-white/50"
              >
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
