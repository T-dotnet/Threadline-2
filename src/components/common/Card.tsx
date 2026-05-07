import React, { CSSProperties } from "react";
import { cardStyle } from "../../constants";

interface CardProps {
  children: React.ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function Card({ children, style, className }: CardProps) {
  return (
    <div style={{ ...cardStyle, ...style }} className={className}>
      {children}
    </div>
  );
}
