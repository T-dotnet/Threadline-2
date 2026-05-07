/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Condition, GuidelineSection } from "./types";
import { CSSProperties } from "react";

// ─── Brand & Text Tokens ──────────────────────────────────────────────────────
export const BRAND = "#06302c";
export const BRAND_LIGHT = "#f8fafc";
export const TEXT_PRIMARY = "#0f172a";
export const TEXT_SECONDARY = "#64748b";
export const TEXT_DISABLED = "#94a3b8";
export const DIVIDER = "#f1f5f9";

// ─── Semantic Background Tokens ───────────────────────────────────────────────
export const ACCEPTED_BG = "#f0fdf4";
export const REJECTED_BG = "#fef2f2";
export const DEFERRED_BG = "#fff7ed";
export const DEFERRED_ICON_COLOR = "#f97316";
export const INFO_LIGHT = "#eff6ff";

// ─── Typography Scale ─────────────────────────────────────────────────────────
export const TYPE_SCALE = {
  LabelMicro: { fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: TEXT_SECONDARY },
  BodyStandard: { fontSize: 14, color: TEXT_PRIMARY, lineHeight: 1.5 },
  HeadingSmall: { fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY },
  HeadingHero: { fontSize: 28, fontWeight: 600, color: TEXT_PRIMARY, lineHeight: 1.2, letterSpacing: "-0.02em" },
};

export const SPACING_SCALE = { 4: 4, 8: 8, 12: 12, 16: 16, 24: 24, 32: 32 };

// ─── Shared Style Objects ─────────────────────────────────────────────────────
export const primaryBtn: CSSProperties = {
  background: BRAND, color: "white", border: "none", borderRadius: 8,
  padding: "10px 24px", fontSize: 14, fontFamily: "'Poppins', sans-serif",
  fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  boxShadow: "0 4px 6px -1px rgba(6, 48, 44, 0.1), 0 2px 4px -2px rgba(6, 48, 44, 0.1)",
  transition: "all 0.2s ease",
};

export const outlineBtn: CSSProperties = {
  background: "white", color: TEXT_PRIMARY, border: "1px solid #e2e8f0", borderRadius: 8,
  padding: "10px 24px", fontSize: 14, fontFamily: "'Poppins', sans-serif",
  fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  transition: "all 0.2s ease",
};

export const cardStyle: CSSProperties = {
  background: "white", border: `1px solid ${DIVIDER}`, borderRadius: 16,
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
};

export const cardHeaderStyle: CSSProperties = {
  padding: "24px 32px", borderBottom: `1px solid ${BRAND_LIGHT}`,
  display: "flex", justifyContent: "space-between", alignItems: "center",
};

export const cardContentStyle: CSSProperties = { padding: "32px" };

export const h1Style: CSSProperties = {
  margin: "0", fontSize: 32, fontWeight: 600, color: TEXT_PRIMARY,
  lineHeight: 1.2, letterSpacing: "-0.02em",
};

export const h1SmallStyle: CSSProperties = { ...h1Style, fontSize: 28 };

export const subStyle: CSSProperties = {
  margin: 0, fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.5,
};

export const FEATURE_CONFIDENCE_THRESHOLD = 0.75;

export const STATUS_CONFIG = {
  "not-started":           { label: "Not Started",    bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
  "required":              { label: "Required",        bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "missing":               { label: "Missing",         bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  "in-progress":           { label: "In Progress",     bg: "#ecfeff", text: "#0891b2", border: "#a5f3fc" },
  "processing":            { label: "Processing",      bg: "#f5f3ff", text: "#7c3aed", border: "#ddd6fe" },
  "completed":             { label: "Completed",       bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "uploaded":              { label: "Uploaded",        bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "ready":                 { label: "Ready",           bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "conflicts-unresolved":  { label: "Conflicts",       bg: "#fef3c7", text: "#b45309", border: "#fde68a" },
  "missing-documents":     { label: "Missing Docs",    bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  "new":                   { label: "New",             bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" },
  "optional":              { label: "Optional",        bg: "#f8fafc", text: "#94a3b8", border: "#f1f5f9" },
  "clinician":             { label: "",                bg: "#ecf2eb", text: "#4caf50", border: "rgba(76, 175, 80, 0.2)" },
  "idle":                  { label: "",                bg: "transparent", text: "transparent", border: "transparent" },
};

// ─── Colors & Tokens ─────────────────────────────────────────────────────────
export const COLORS = {
  P: "#06302c",
  PL: "#e8f0ef",
  SG: "#388e3c",
  SM: "#8bc34a",
  SL: "#ecf2eb",
  IM: "#03a9f4",
  IL: "#e9f2f9",
  EM: "#f44336",
  EL: "#ffd9e8",
  GM: "#b0adad",
  GL: "#f0efef",
  WM: "#ff9800",
  DIV: "rgba(0,0,0,0.12)",
  TP: "#0f172a",
  TS: "rgba(15,23,42,0.6)",
  AVATAR_BG: "#e4e0dc",
};

export const STATUS_COLORS: Record<string, { bg: string; c: string }> = {
  Approved: { bg: COLORS.SL, c: COLORS.SM },
  "In Review": { bg: COLORS.IL, c: COLORS.IM },
  Deprecated: { bg: COLORS.EL, c: COLORS.EM },
  Draft: { bg: COLORS.GL, c: COLORS.GM },
};

export const GUIDELINE_COLORS: Record<string, { bd: string; c: string }> = {
  "DSM-5-TR": { bd: COLORS.P, c: COLORS.P },
  "ICD-11": { bd: COLORS.IM, c: COLORS.IM },
};

// ─── Icon Paths ──────────────────────────────────────────────────────────────
export const ICON_PATHS = {
  chevD: "M7 10l5 5 5-5z",
  chevL: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
  chevR: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  chevU: "M7 14l5-5 5 5z",
  sortD: "M7 10l5 5 5-5z",
  sortU: "M7 14l5-5 5 5z",
  add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
  close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  ext: "M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z",
  doc: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  search: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  grid: "M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z",
  checkCircle: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  warning: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
};

// ─── Static Data ─────────────────────────────────────────────────────────────
export const ALL_CONDITIONS: Condition[] = [
  { id:1,  name:"Anorexia Nervosa",                                       category:"Feeding & Eating",               code:"6B80", guideline:"DSM-5-TR", status:"Approved",   updated:"Jan 3, 2026 – 8:00 AM",  population:"All Ages",       reviewer:"Dr. Sarah Chen",   overview:"A serious eating disorder characterised by an abnormally low body weight, intense fear of gaining weight, and a distorted perception of weight.",                                         refs:["DSM-5-TR Official Criteria","Clinical Practice Guidelines for Eating Disorders"] },
  { id:2,  name:"Attention-Deficit Hyperactivity Disorder (ADHD)",        category:"Neurodevelopmental",             code:"6B80", guideline:"ICD-11",   status:"In Review",  updated:"Jan 3, 2026 – 8:00 AM",  population:"Young and Adult", reviewer:"Dr. John Doe",     overview:"A persistent pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning or development.",                                                             refs:["ICD-11 Official Documentation","Clinical guidelines and criteria"] },
  { id:3,  name:"Single Depressive Episode",                              category:"Anxiety & Fear-Related",         code:"6B80", guideline:"DSM-5-TR", status:"Deprecated", updated:"Jan 3, 2026 – 8:00 AM",  population:"Adult",           reviewer:"Dr. Maria Lopez",  overview:"A period of at least two weeks when a person experienced a depressed mood or loss of interest or pleasure in daily activities.",                                                     refs:["DSM-5-TR Mood Disorders Section","WHO Mental Health Guidelines"] },
  { id:4,  name:"Obsessive-Compulsive Disorder (OCD)",                    category:"Obsessive-Compulsive & Related", code:"F42",  guideline:"ICD-11",   status:"Draft",      updated:"Jan 3, 2026 – 8:00 AM",  population:"All Ages",        reviewer:"Dr. Kim Park",     overview:"A disorder in which people have recurring, unwanted thoughts, ideas, or sensations that drive them to do something repetitively.",                                                   refs:["ICD-11 OCD Criteria","NICE Clinical Guidelines CG31"] },
  { id:5,  name:"Generalised Anxiety Disorder",                           category:"Anxiety & Fear-Related",         code:"6B00", guideline:"ICD-11",   status:"Approved",   updated:"Jan 14, 2026 – 10:30 AM",population:"Adult",           reviewer:"Dr. Priya Nair",   overview:"A disorder characterised by excessive anxiety and worry about a number of events or activities, occurring more days than not for at least six months.",                              refs:["ICD-11 Anxiety Disorders","NICE Guideline CG113"] },
  { id:6,  name:"Post-Traumatic Stress Disorder (PTSD)",                  category:"Trauma & Stress-Related",        code:"6B40", guideline:"DSM-5-TR", status:"In Review",  updated:"Jan 1, 2026 – 9:15 AM",  population:"Adult",           reviewer:"Dr. Alice Morgan", overview:"A psychiatric disorder that may occur in people who have experienced or witnessed a traumatic event such as a natural disaster, a serious accident, or war.",                       refs:["DSM-5-TR Trauma-Related Disorders","International Trauma Guidelines"] },
  { id:7,  name:"Bipolar I Disorder",                                     category:"Mood Disorders",                 code:"6A60", guideline:"ICD-11",   status:"Approved",   updated:"Mar 20, 2026 – 2:00 PM",  population:"Adult",           reviewer:"Dr. James Turner", overview:"A mental disorder characterised by episodes of mania and depression.",                                                                                                                refs:["ICD-11 Mood Disorders","CANMAT Clinical Guidelines"] },
  { id:8,  name:"Schizophrenia",                                          category:"Psychotic Disorders",            code:"6A20", guideline:"DSM-5-TR", status:"Draft",      updated:"Mar 10, 2026 – 11:45 AM", population:"Adult",           reviewer:"Dr. Lena Kovacs",  overview:"A chronic and severe mental disorder affecting how a person thinks, feels, and behaves.",                                                                                           refs:["DSM-5-TR Schizophrenia Spectrum","NICE Guideline CG178"] },
  { id:9,  name:"Borderline Personality Disorder",                        category:"Personality Disorders",          code:"6D11", guideline:"ICD-11",   status:"In Review",  updated:"Apr 28, 2026 – 3:30 PM",  population:"Adult",           reviewer:"Dr. Hana Yilmaz", overview:"A mental health disorder that impacts the way you think and feel about yourself and others.",                                                                                      refs:["ICD-11 Personality Disorders","APA BPD Treatment Guidelines"] },
  { id:10, name:"Single Depressive Episode (Recurrent)",                  category:"Anxiety & Fear-Related",         code:"F32",  guideline:"DSM-5-TR", status:"Deprecated", updated:"Jan 3, 2026 – 8:00 AM",  population:"All Ages",        reviewer:"Dr. Tom Bradley",  overview:"Recurrent depressive disorder involves repeated depressive episodes without a history of independent episodes of mood elevation.",                                                  refs:["DSM-5-TR Depression Criteria","Clinical Depression Guidelines"] },
  { id:11, name:"ADHD (Combined Presentation)",                           category:"Anxiety & Fear-Related",         code:"F90",  guideline:"DSM-5-TR", status:"Deprecated", updated:"Jan 3, 2026 – 8:00 AM",  population:"Young and Adult", reviewer:"Dr. Ren Watanabe", overview:"Combined presentation ADHD features both inattentive and hyperactive-impulsive symptoms.",                                                                                          refs:["DSM-5-TR ADHD Chapter","Combined Presentation Clinical Guide"] },
  { id:12, name:"ADHD (Predominantly Inattentive)",                       category:"Obsessive-Compulsive & Related", code:"6C91", guideline:"ICD-11",   status:"Draft",      updated:"Jan 3, 2026 – 8:00 AM",  population:"Young and Adult", reviewer:"Dr. Fatima Hassan",overview:"Predominantly inattentive ADHD involves persistent patterns of inattention more prominent than hyperactive symptoms.",                                                                    refs:["ICD-11 ADHD Subtypes","Inattentive ADHD Clinical Criteria"] },
  { id:13, name:"OCD – Specified Subtype",                                category:"Obsessive-Compulsive & Related", code:"6B20", guideline:"ICD-11",   status:"Draft",      updated:"Jan 3, 2026 – 8:00 AM",  population:"All Ages",        reviewer:"Dr. Oren Blum",   overview:"This OCD subtype covers presentations requiring additional clinical specification beyond the primary OCD diagnosis.",                                                             refs:["ICD-11 OCD Subtype Criteria","Subspecialty OCD Treatment Guidelines"] },
];

export const GUIDELINE_SECTIONS: GuidelineSection[] = [
  { id:"description",     label:"Description" },
  { id:"diagnostic",      label:"Inclusions and Exclusions" },
  { id:"requirements",    label:"Diagnostic Requirements" },
  { id:"clinical",        label:"Additional Clinical Features" },
  { id:"scoring",         label:"Scoring Summary" },
  { id:"boundary",        label:"Boundary with Normality (Threshold)" },
  { id:"course",          label:"Course Features" },
  { id:"developmental",   label:"Developmental Presentations" },
  { id:"gender",          label:"Sex- and/or Gender-Related Features" },
  { id:"differential",    label:"Boundaries with Other Disorders (Differential Diagnosis)" },
];

export const ALL_CATS = [...new Set(ALL_CONDITIONS.map(c=>c.category))];
export const TABS = ["Overview","Guidelines","Decision Units (8)","Change History"];
