import React from "react";
import { h1Style, h1SmallStyle, subStyle } from "../../constants";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, actions, small }: SectionHeaderProps & { small?: boolean }) {
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      marginBottom: 32 
    }}>
      <div>
        <h2 style={{ ...(small ? h1SmallStyle : h1Style), marginBottom: 4 }}>{title}</h2>
        {subtitle && <p style={subStyle}>{subtitle}</p>}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
