import React, { CSSProperties } from "react";
import { BRAND, TEXT_PRIMARY, DIVIDER } from "../../constants";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: CSSProperties;
}

const BASE: CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
  fontFamily: "'Poppins', sans-serif", fontWeight: 600, cursor: "pointer",
  border: "none", transition: "all 0.2s ease", letterSpacing: "0.01em",
};

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: BRAND, color: "white", borderRadius: 8,
    boxShadow: "0 4px 6px -1px rgba(6, 48, 44, 0.1), 0 2px 4px -2px rgba(6, 48, 44, 0.1)",
  },
  secondary: { background: "#e8f0ef", color: BRAND, borderRadius: 8 },
  outline: { background: "white", color: TEXT_PRIMARY, border: `1px solid ${DIVIDER}`, borderRadius: 8 },
  ghost:   { background: "transparent", color: TEXT_PRIMARY, borderRadius: 6 },
};

const sizes: Record<ButtonSize, CSSProperties> = {
  sm: { padding: "6px 16px", fontSize: 13 },
  md: { padding: "10px 24px", fontSize: 14 },
  lg: { padding: "12px 32px", fontSize: 15 },
};

export function Button({ variant = "primary", size = "md", style, ...props }: ButtonProps) {
  return (
    <button
      style={{ ...BASE, ...variants[variant], ...sizes[size], ...style }}
      {...props}
    />
  );
}
