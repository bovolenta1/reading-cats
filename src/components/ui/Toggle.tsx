"use client";

import React from "react";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  ariaLabel?: string;
};

export default function Toggle({ checked, onChange, disabled, size = "md", ariaLabel }: ToggleProps) {
  const dims = size === "sm" ? { w: "w-9", h: "h-5", knob: "h-4 w-4", translate: "translate-x-4" } : { w: "w-11", h: "h-6", knob: "h-5 w-5", translate: "translate-x-5" };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        "relative inline-flex items-center rounded-full transition-colors focus:outline-none",
        dims.w,
        dims.h,
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        checked ? "bg-[#39FF14]" : "bg-white/15 ring-1 ring-white/10",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none inline-block transform rounded-full bg-[#0F0C22] transition",
          dims.knob,
          "shadow",
          checked ? dims.translate : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}
