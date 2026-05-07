import React from "react";
import { Edit3, Copy, Link } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, outlineBtn, BRAND, h1Style, subStyle, cardStyle, cardHeaderStyle, cardContentStyle, TYPE_SCALE } from "./constants";
import { StatusBadge } from "../common/StatusBadge";

import { SectionHeader } from "../common/SectionHeader";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { MOCK_CLIENTS } from "./mockData";

export function ProfileWorkspace() {
  const { activeClientId } = useFeatureFlags();
  const clientMeta = MOCK_CLIENTS.find(c => c.id === activeClientId);

  return (
    <div style={{ padding: "0 0 64px" }}>
      <SectionHeader 
        title="Client Profile"
        subtitle={`${clientMeta?.name || "Client"} #${clientMeta?.id || ""}`}
        small={true}
        actions={
          <button style={{ ...outlineBtn, display: "flex", alignItems: "center", gap: 8 }}>
            <Edit3 size={16} /> Edit Profile
          </button>
        }
      />

      <div style={cardStyle}>
        <div style={{ ...cardContentStyle, display: "flex", gap: 32 }}>
        {/* Left Column */}
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: `1px solid ${DIVIDER}`, paddingBottom: 24, marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
              {[
                { label: "External ID:", value: "125566" },
                { label: "Phone Number:", value: "+61 412 345 678" },
                { label: "Referred By:", value: "Dr. Alicia Smith" },
                { label: "Consent Obtained:", value: "Yes (Digital)" },
                { label: "Email Address:", value: "liam.osullivan@example.com" },
                { label: "Last Session:", value: "19/03/2025" },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 15, color: TEXT_PRIMARY, fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 12 }}>Clinicians:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <StatusBadge status="clinician" label="Primary Clinician" style={{ textTransform: "none", fontSize: 12 }} />
              <StatusBadge status="required" label="Secondary Clinician" style={{ textTransform: "none", fontSize: 12 }} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ width: 400, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Meeting Room Link Card */}
          <div style={{ border: "1px solid #22c55e", borderRadius: 12, padding: 24, background: "rgba(34, 197, 94, 0.05)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 500, color: TEXT_PRIMARY, marginBottom: 4 }}>Meeting Room Link</h2>
            <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 16 }}>Started 1:43:14 AM</p>
            
            <div style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 8 }}>Client Join link</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Link size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: TEXT_SECONDARY }} />
                <input 
                  type="text" 
                  readOnly 
                  value="https://telehealth.threadline.com.au/join/{sessionId}?.." 
                  style={{ width: "100%", padding: "8px 12px 8px 32px", border: `1px solid ${DIVIDER}`, borderRadius: 8, fontSize: 13, background: "white" }} 
                />
              </div>
              <button style={{ ...outlineBtn, padding: "8px 12px" }}>
                <Copy size={16} />
              </button>
            </div>
            <p style={{ ...TYPE_SCALE.LabelMicro, marginBottom: 20 }}>Share this link with your patient to join the session</p>
            
            <button style={{ width: "100%", padding: "12px", background: "#111827", color: "white", border: "none", borderRadius: 8, fontWeight: 500, cursor: "pointer" }}>
              Join Session As Clinician
            </button>
          </div>

          {/* Consent Link Card */}
          <div style={{ border: `1px solid ${DIVIDER}`, borderRadius: 12, padding: 24, background: "white" }}>
            <h2 style={{ fontSize: 20, fontWeight: 500, color: TEXT_PRIMARY, marginBottom: 4 }}>Consent Link</h2>
            <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 16 }}>Your privacy is incredibly important to us! Click here to discover how we manage your consent.</p>
            
            <div style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 8 }}>Consent link</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Link size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: TEXT_SECONDARY }} />
                <input 
                  type="text" 
                  readOnly 
                  value="https://telehealth.threadline.com.au/consent/{sessionId}?.." 
                  style={{ width: "100%", padding: "8px 12px 8px 32px", border: `1px solid ${DIVIDER}`, borderRadius: 8, fontSize: 13, background: "white" }} 
                />
              </div>
              <button style={{ ...outlineBtn, padding: "8px 12px" }}>
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

