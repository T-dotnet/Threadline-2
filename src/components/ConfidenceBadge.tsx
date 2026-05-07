import React, { CSSProperties } from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

// REGULATORY NOTE: This display standard is the test basis for Scenario S9-B (RISK-009). Do not change without updating the test protocol.

export type ConfidenceLevel = "high" | "medium" | "low";

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
}

const BASE: CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "4px 10px", borderRadius: 100,
  fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif",
  whiteSpace: "nowrap",
};

const configs: Record<ConfidenceLevel, { style: CSSProperties; icon: React.ElementType; label: string }> = {
  high:   { style: { background: "#ecf2eb", color: "#388e3c" }, icon: CheckCircle2, label: "High confidence" },
  medium: { style: { background: "#fff7ed", color: "#b45309" }, icon: AlertCircle,  label: "Uncertain" },
  low:    { style: { background: "#fef2f2", color: "#b91c1c" }, icon: XCircle,       label: "Low confidence" },
};

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const { style, icon: Icon, label } = configs[confidence];
  return (
    <span style={{ ...BASE, ...style }}>
      <Icon size={14} />
      {label}
    </span>
  );
}

export function mapScoreToConfidence(score: number): ConfidenceLevel {
  if (score >= 0.75) return "high";
  if (score >= 0.4) return "medium";
  return "low";
}
