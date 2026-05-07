import React from "react";
import { ArrowLeft as BackArrow } from "lucide-react";
import { BRAND, cardStyle, cardHeaderStyle, cardContentStyle, h1Style, subStyle } from "./constants";
import { ClientMetaBanner, MetaBannerField } from "../common/ClientMetaBanner";

interface DetailPageTemplateProps {
  backLabel: string;
  onBack: () => void;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
  metaFields: MetaBannerField[];
  children: React.ReactNode;
}

export function DetailPageTemplate({
  backLabel,
  onBack,
  title,
  subtitle,
  actionButton,
  metaFields,
  children,
}: DetailPageTemplateProps) {
  return (
    <div style={{ padding: "0 0 64px" }}>
      <div style={{ ...cardStyle }}>
        <div style={{ ...cardHeaderStyle, paddingBottom: 24 }}>
          <div>
            <button
              onClick={onBack}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: BRAND, fontSize: 13, fontWeight: 600,
                padding: "0 0 12px", fontFamily: "'Poppins',sans-serif",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <BackArrow size={16} /> {backLabel}
            </button>
            <h1 style={{ ...h1Style, fontSize: 24, margin: "0 0 4px 0" }}>{title}</h1>
            {subtitle && <p style={{ ...subStyle, margin: 0 }}>{subtitle}</p>}
          </div>
          {actionButton}
        </div>

        <div style={cardContentStyle}>
          <ClientMetaBanner fields={metaFields} style={{ marginBottom: 32 }} />
          {children}
        </div>
      </div>
    </div>
  );
}
