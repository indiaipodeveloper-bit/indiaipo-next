"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type FontSize = "small" | "normal" | "large";

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: "14px",
  normal: "16px",
  large: "19px",
};

const STORAGE_KEY = "site-font-size";

const FontSizeControl = () => {
  const [activeSize, setActiveSize] = useState<FontSize>("normal");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as FontSize | null;

    if (saved && FONT_SIZE_MAP[saved]) {
      setActiveSize(saved);
      document.documentElement.style.fontSize = FONT_SIZE_MAP[saved];
    } else {
      setActiveSize("normal");
      document.documentElement.style.fontSize = FONT_SIZE_MAP.normal;
    }
  }, []);

  const handleChange = (size: FontSize) => {
    setActiveSize(size);
    document.documentElement.style.fontSize = FONT_SIZE_MAP[size];
    localStorage.setItem(STORAGE_KEY, size);
  };

  const buttons: { size: FontSize; label: string; textSize: string; title: string }[] = [
    { size: "small", label: "A", textSize: "9px", title: "Small font size" },
    { size: "normal", label: "A", textSize: "12px", title: "Normal font size" },
    { size: "large", label: "A", textSize: "15px", title: "Large font size" },
  ];

  return (
    <div
      className="hidden sm:flex items-center gap-0.5 rounded-lg px-1 py-0.5"
      style={{
        background: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.18)",
      }}
      title="Adjust font size"
      aria-label="Font size accessibility control"
      role="group"
    >
      {buttons.map(({ size, label, textSize, title }) => {
        const isActive = activeSize === size;
        return (
          <motion.button
            key={size}
            id={`font-size-${size}`}
            title={title}
            aria-label={title}
            aria-pressed={isActive}
            whileTap={{ scale: 0.90 }}
            onClick={() => handleChange(size)}
            className="relative flex items-center justify-center rounded-md transition-all duration-200 font-bold select-none"
            style={{
              width: "24px",
              height: "22px",
              fontSize: textSize,
              color: isActive ? "#1a4d2e" : "rgba(255,255,255,0.80)",
              background: isActive ? "#e6b800" : "transparent",
              boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.20)" : "none",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
};

export default FontSizeControl;
