/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CSSProperties, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS, ICON_PATHS, STATUS_COLORS, GUIDELINE_COLORS } from "../../constants";

export function Icon({ d, size = 20, color = "currentColor", style: s = {} }: { d: string; size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0, ...s }}>
      <path d={d} />
    </svg>
  );
}

export function StatusChip({ status, center = false }: { status: string; center?: boolean; key?: string | number }) {
  const { bg, c } = STATUS_COLORS[status] || { bg: COLORS.GL, c: COLORS.GM };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: center ? "center" : "flex-start",
      background: bg, color: c, borderRadius: 100, padding: "3px 10px",
      fontSize: 12, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap"
    }}>{status}</span>
  );
}

export function GlChip({ label }: { label: string; key?: string | number }) {
  const { bd, c } = GUIDELINE_COLORS[label] || { bd: COLORS.GM, c: COLORS.GM };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      border: `1px solid ${bd}`, color: c, borderRadius: 100, padding: "3px 10px",
      fontSize: 12, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap"
    }}>{label}</span>
  );
}

export function DUChip({ status }: { status: string; key?: string | number }) {
  const bg = status === "Active" ? COLORS.SL : status === "Staged" ? COLORS.IL : COLORS.EL;
  const c = status === "Active" ? COLORS.SM : status === "Staged" ? COLORS.IM : COLORS.EM;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: bg, color: c, borderRadius: 100, padding: "3px 10px",
      fontSize: 12, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap"
    }}>{status}</span>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button 
        onClick={onChange}
        style={{
          width: 34, height: 14, borderRadius: 100, background: checked ? COLORS.P : "rgba(0,0,0,0.38)",
          position: "relative", border: "none", cursor: "pointer", transition: "background .2s",
          padding: 0, display: "flex", alignItems: "center"
        }}
      >
        <motion.div 
          animate={{ x: checked ? 16 : -2 }} 
          style={{ 
            width: 20, height: 20, borderRadius: "50%", background: "white", 
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)", position: "absolute" 
          }} 
        />
      </button>
      {label && <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 16, color: COLORS.TP }}>{label}</span>}
    </div>
  );
}

export function FilterChip({ label, onRemove }: { label: string; onRemove: (e: any) => void; key?: any }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: "rgba(0,0,0,0.08)", borderRadius: 100, padding: "3px 4px 3px 10px",
      fontSize: 12, fontFamily: "'Poppins',sans-serif", color: COLORS.TP, whiteSpace: "nowrap"
    }}>
      {label.length > 20 ? label.slice(0, 20) + "…" : label}
      <button onClick={onRemove} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", padding: 2, color: COLORS.TS, opacity: .7
      }}>
        <Icon d={ICON_PATHS.close} size={13} />
      </button>
    </span>
  );
}

export function SimpleDropdown({ label, value, options, onChange, width = 160 }: { label: string; value: string; options: string[]; onChange: (v: string) => void; width?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", flexShrink: 0, width }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 4,
        border: `1px solid ${COLORS.DIV}`, borderRadius: 4, background: "white",
        cursor: "pointer", padding: "8px 28px 8px 12px", width: "100%",
        fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP, position: "relative", textAlign: "left",
        minHeight: 44
      }}>
        <span style={{ position: "absolute", top: -8, left: 10, background: "white", padding: "0 4px", fontSize: 11, color: COLORS.TS }}>{label}</span>
        <span style={{ flex: 1 }}>{value}</span>
        <Icon d={ICON_PATHS.chevD} size={20} color={COLORS.TS} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)" }} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, width: "100%", background: "white", border: `1px solid ${COLORS.DIV}`, borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,.12)", zIndex: 20, overflow: "hidden" }}
            >
              {options.map(o => (
                <div key={o} onClick={() => { onChange(o); setOpen(false); }}
                  style={{ padding: "9px 14px", cursor: "pointer", fontSize: 14, fontFamily: "'Poppins',sans-serif", color: COLORS.TP, background: o === value ? COLORS.PL : "white" }}
                  onMouseEnter={e => { if (o !== value) e.currentTarget.style.background = "#f5f5f5"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = o === value ? COLORS.PL : "white"; }}>
                  {o}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MultiDropdown({ label, value, options, onToggle, width = 160 }: { label: string; value: string[]; options: string[]; onToggle: (v: string) => void; width?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", flexShrink: 0, width }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 4,
        border: `1px solid ${COLORS.DIV}`, borderRadius: 4, background: "white",
        cursor: "pointer", padding: "8px 28px 8px 12px", width: "100%",
        fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP, position: "relative", textAlign: "left",
        minHeight: 44
      }}>
        <span style={{ position: "absolute", top: -8, left: 10, background: "white", padding: "0 4px", fontSize: 11, color: COLORS.TS }}>{label}</span>
        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value.length === 0 ? "None" : value.length === 1 ? value[0] : `${value.length} selected`}
        </span>
        <Icon d={ICON_PATHS.chevD} size={20} color={COLORS.TS} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)" }} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, width: 320, background: "white", border: `1px solid ${COLORS.DIV}`, borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,.12)", zIndex: 20, overflowY: "auto", maxHeight: 400, padding: 4 }}
            >
              {options.map(o => (
                <div key={o} onClick={() => onToggle(o)}
                  style={{ 
                    padding: "9px 12px", cursor: "pointer", fontSize: 14, fontFamily: "'Poppins',sans-serif", color: COLORS.TP, 
                    background: value.includes(o) ? "rgba(6,48,44,0.05)" : "white",
                    display: "flex", alignItems: "center", gap: 10, borderRadius: 4
                  }}
                  onMouseEnter={e => { if (!value.includes(o)) e.currentTarget.style.background = "#f5f5f5"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = value.includes(o) ? "rgba(6,48,44,0.05)" : "white"; }}>
                  <div style={{
                    width: 16, height: 16, border: `2px solid ${value.includes(o) ? COLORS.P : COLORS.TS}`,
                    borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
                    background: value.includes(o) ? COLORS.P : "white"
                  }}>
                    {value.includes(o) && <Icon d={ICON_PATHS.check} size={12} color="white" />}
                  </div>
                  {o}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: `1px solid ${COLORS.DIV}`, borderRadius: 4, padding: 16 }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, gap: 16 }}>
        <span style={{ flex: 1, fontFamily: "'Poppins',sans-serif", fontSize: 20, fontWeight: 500, color: COLORS.TP, letterSpacing: .15, textAlign: "left", lineHeight: 1.6 }}>{title}</span>
        <Icon d={open ? ICON_PATHS.chevU : ICON_PATHS.chevD} size={24} color={COLORS.TP} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ borderTop: `1px solid ${COLORS.DIV}`, marginTop: 12, paddingTop: 12 }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
