import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { BRAND, DIVIDER } from "../threadline/constants";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: number | string;
  style?: React.CSSProperties;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  width = 320,
  style,
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: "relative", width, ...style }}>
      <Search
        size={18}
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#9ca3af",
          pointerEvents: "none",
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 44,
          padding: "0 40px 0 40px",
          border: `1px solid ${focused ? BRAND : DIVIDER}`,
          borderRadius: 4,
          fontSize: 14,
          fontFamily: "'Poppins', sans-serif",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s ease",
          color: "#0f172a",
          background: "white",
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
