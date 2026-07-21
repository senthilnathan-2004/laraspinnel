import React from "react";

export default function TornPaperOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <svg
        className="absolute inset-0 w-full h-full text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M0,0 L100,0 L100,100 L0,100 Z M10,10 L15,8 L25,12 L35,8 L45,15 L55,5 L65,15 L75,8 L85,15 L92,10 L95,20 L92,30 L96,40 L90,50 L95,60 L92,70 L96,80 L90,90 L85,85 L75,92 L65,85 L55,95 L45,85 L35,92 L25,88 L15,92 L8,90 L5,80 L8,70 L5,60 L10,50 L5,40 L8,30 L5,20 Z" fillRule="evenodd" />
      </svg>
    </div>
  );
}
