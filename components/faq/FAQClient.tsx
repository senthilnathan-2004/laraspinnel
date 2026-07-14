"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQClientProps {
  faqs: {
    _id: string;
    question: string;
    answer: string;
  }[];
}

export default function FAQClient({ faqs }: FAQClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-start">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq._id}
            className="bg-white rounded-2xl shadow-sm border border-brand-border hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* --- Desktop View: Always Open, No Interactivity --- */}
            <div className="hidden lg:flex p-8 items-start gap-4">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-goat-tint text-goat-primary font-bold text-sm">
                Q
              </span>
              <div>
                <h3 className="text-xl font-bold text-brand-black mb-3 leading-snug">
                  {faq.question}
                </h3>
                <p className="text-brand-gray leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>

            {/* --- Mobile & Tablet View: Apple-style Accordion --- */}
            <div className="lg:hidden flex flex-col">
              <button
                onClick={() => toggleOpen(index)}
                className="flex items-start justify-between w-full px-3 py-3 md:p-6 text-left focus:outline-none bg-transparent"
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-goat-tint text-goat-primary font-bold text-sm mt-0.5">
                    Q
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-brand-black leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4 mt-1">
                  <ChevronDown
                    className={`w-5 h-5 text-brand-gray transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-3 md:px-6 pb-3 md:pb-6 ml-11">
                    <p className="text-brand-gray leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
