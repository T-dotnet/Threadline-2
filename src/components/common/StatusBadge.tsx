import React from "react";
import { AlertTriangle, FileX, Clock, CheckCircle, Plus as AddIcon } from "lucide-react";
import { STATUS_CONFIG } from "../../constants";

export type StatusType = keyof typeof STATUS_CONFIG;

const STATUS_ICONS: Record<string, any> = {
  'conflicts-unresolved': AlertTriangle,
  'missing-documents': FileX,
  'missing': FileX,
  'in-progress': Clock,
  'processing': Clock,
  'completed': CheckCircle,
  'ready': CheckCircle,
  'uploaded': CheckCircle,
  'new': AddIcon,
  'required': Clock,
  'not-started': Clock,
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  style?: React.CSSProperties;
}

export function StatusBadge({ status, label, style }: StatusBadgeProps) {
  const config = (STATUS_CONFIG as any)[status];
  
  if (!config || status === 'idle') return null;
  
  const Icon = STATUS_ICONS[status];
  const displayLabel = label !== undefined ? label : config.label;

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 10,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.025em",
      background: config.bg,
      color: config.text,
      border: `1px solid ${config.border}`,
      whiteSpace: "nowrap",
      ...style
    }}>
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {displayLabel}
    </span>
  );
}
