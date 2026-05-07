import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'blue';
}

const variants = {
    default: "bg-gray-100 text-gray-800",
    outline: "border border-gray-200 text-gray-600",
    success: "bg-green-50 text-green-700 border border-green-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    active: "bg-green-50 text-green-700 border border-green-200",
    inactive: "bg-gray-100 text-gray-600 border border-gray-200"
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
