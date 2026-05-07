import React, { CSSProperties } from "react";
import { TEXT_SECONDARY } from "../../constants";

export type BadgeVariant = "default" | "outline" | "success" | "blue" | "active" | "inactive";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const BASE: CSSProperties = {
  display: "inline-flex", alignItems: "center",
  padding: "3px 10px", borderRadius: 100,
  fontSize: 12, fontFamily: "'Poppins', sans-serif",
  whiteSpace: "nowrap", fontWeight: 500,
};

const variants: Record<BadgeVariant, CSSProperties> = {
  default:  { background: "#f0efef", color: TEXT_SECONDARY },
  outline:  { border: "1px solid #e2e8f0", color: TEXT_SECONDARY, background: "transparent" },
  success:  { background: "#ecf2eb", color: "#388e3c", border: "1px solid rgba(56, 142, 60, 0.2)" },
  blue:     { background: "#e9f2f9", color: "#0369a1", border: "1px solid rgba(3, 105, 161, 0.2)" },
  active:   { background: "#ecf2eb", color: "#388e3c", border: "1px solid rgba(56, 142, 60, 0.2)" },
  inactive: { background: "#f0efef", color: TEXT_SECONDARY, border: "1px solid #e2e8f0" },
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span style={{ ...BASE, ...variants[variant] }}>
      {children}
    </span>
  );
}
