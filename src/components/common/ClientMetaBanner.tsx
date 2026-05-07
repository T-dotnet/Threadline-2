import React from "react";
import { TYPE_SCALE, DIVIDER, BRAND_LIGHT } from "../threadline/constants";

export interface MetaBannerField {
  label: string;
  value: React.ReactNode;
  colSpan?: number;
  isDivider?: boolean;
}

interface ClientMetaBannerProps {
  fields: MetaBannerField[];
  style?: React.CSSProperties;
}

export function ClientMetaBanner({ fields, style }: ClientMetaBannerProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
      background: BRAND_LIGHT,
      borderRadius: 12,
      border: `1px solid ${DIVIDER}`,
      overflow: "hidden",
      ...style
    }}>
      {fields.map((field, i) => {
        if (field.isDivider) {
          return (
            <div key={i} style={{ gridColumn: "1 / -1", height: 1, background: DIVIDER }} />
          );
        }
        return (
          <div key={i} style={{
            padding: "16px 24px",
            gridColumn: field.colSpan ? `span ${field.colSpan}` : undefined,
            borderRight: `1px solid ${DIVIDER}`,
            borderBottom: `1px solid ${DIVIDER}`,
          }}>
            <div style={{ ...TYPE_SCALE.LabelMicro, marginBottom: 4 }}>{field.label}</div>
            <div style={{ ...TYPE_SCALE.HeadingSmall }}>{field.value}</div>
          </div>
        );
      })}
    </div>
  );
}
