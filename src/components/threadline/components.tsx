import React from 'react';
import { Sparkles, ChevronDown, ChevronRight, Calendar, FileText, Share2, Edit3 as EditIcon, MoreVertical } from 'lucide-react';
import { BRAND, DIVIDER, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DISABLED, primaryBtn, outlineBtn, TYPE_SCALE } from './constants';

export const ReportSection = ({ title, children, noBottomBorder, reviewKey, reviewBadge, noCollapse }: { title: string, children: React.ReactNode, noBottomBorder?: boolean, reviewKey?: string, reviewBadge?: React.ReactNode, noCollapse?: boolean }) => {
  const [open, setOpen] = React.useState(true);
  const isOpen = noCollapse || open;
  
  return (
    <div style={{ border: `1px solid #f1f5f9`, borderRadius: 12, background: "white", overflow: "hidden", marginBottom: 12 }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", background: "transparent",
      }}>
        <div onClick={noCollapse ? undefined : () => setOpen(o => !o)} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "transparent", border: "none", cursor: noCollapse ? "default" : "pointer",
          fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, textAlign: "left", flex: 1
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: isOpen ? BRAND : "#cbd5e1" }} />
          <span>{title}</span>
          {!noCollapse && (
            <span style={{ color: TEXT_SECONDARY, display: "flex", alignItems: "center", marginLeft: 4 }}>
              {isOpen ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {reviewBadge}
          <button style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_SECONDARY, display: "flex", alignItems: "center" }}>
            <EditIcon size={16} />
          </button>
        </div>
      </div>
      {isOpen && (
        <div style={{ padding: "0 20px 20px 38px" }}>
          {children}
        </div>
      )}
    </div>
  );
};
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { StatusBadge, StatusType } from '../common/StatusBadge';

export const ThreadlineButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }> = ({ variant = 'primary', style, children, ...props }) => {
  const baseStyle = variant === 'primary' ? primaryBtn : outlineBtn;
  return (
    <button style={{ ...baseStyle, ...style }} {...props}>
      {children}
    </button>
  );
};

export const ThreadlineText: React.FC<{ variant?: keyof typeof TYPE_SCALE, style?: React.CSSProperties, children: React.ReactNode }> = ({ variant = 'BodyStandard', style, children }) => {
  return (
    <div style={{ ...TYPE_SCALE[variant], ...style }}>
      {children}
    </div>
  );
};

export const Toast = ({ message, visible }: { message: string, visible: boolean }) => (
  <div style={{
    position: "fixed", bottom: 40, left: "55%", transform: "translateX(-50%)",
    background: "#2e7d32", color: "white", padding: "12px 24px", borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 2000, display: visible ? "flex" : "none",
    alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500,
    animation: "fadeIn 0.3s ease", transition: "all 0.2s ease"
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
     {message}
  </div>
);

export const SysBadge = () => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "2px 10px", border: "1px solid #f1f5f9", borderRadius: 6,
    background: "#f8fafc", ...TYPE_SCALE.LabelMicro, whiteSpace: "nowrap",
    fontWeight: 500, transition: "all 0.2s ease"
  }}>
    <Sparkles size={11} /> AI Insights
  </span>
);

export const ConsentBadge = ({ yes }: { yes: boolean }) => {
  const status = yes ? 'completed' : 'missing';
  return <StatusBadge status={status as any} label={yes ? 'Yes' : 'No'} />;
};

export const ClinicianTag: React.FC<{ name: string }> = ({ name }) => (
  <StatusBadge status="clinician" label={name} style={{ textTransform: "none" }} />
);

export function Navbar({ onClientsClick, onPatientsClick, onSessionsClick, onConditionsClick }: { onClientsClick?: () => void, onPatientsClick?: () => void, onSessionsClick?: () => void, onConditionsClick?: () => void }) {
  return (
    <nav style={{
      background: "white", border: `1px solid ${DIVIDER}`, borderRadius: 12,
      padding: "0 20px", height: 60,
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="28" height="28" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill={BRAND} />
          <circle cx="16" cy="16" r="7" fill="none" stroke="white" strokeWidth="2.5" />
          <line x1="16" y1="9" x2="16" y2="3" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 18, fontWeight: 600, color: BRAND, letterSpacing: "-0.3px" }}>Threadline</span>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {["Users", "Clients", "Resources", "Patients", "Sessions", "Conditions"].map(item => (
          <button 
            key={item} 
            onClick={() => {
              if (item === "Clients" && onClientsClick) onClientsClick();
              if (item === "Patients" && onPatientsClick) onPatientsClick();
              if (item === "Sessions" && onSessionsClick) onSessionsClick();
              if (item === "Conditions" && onConditionsClick) onConditionsClick();
            }}
            style={{
              background: "transparent", border: "none", padding: "5px 10px", fontSize: 13,
              fontWeight: 400,
              color: item === "Sessions" ? BRAND : TEXT_PRIMARY,
              cursor: "pointer", borderRadius: 4, letterSpacing: "0.3px",
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: BRAND,
          color: "white", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 500
        }}>OP</div>
        <ChevronDown size={20} />
      </div>
    </nav>
  );
}

export function TabBar({ tabs, active, onSelect, badges = {} }: { tabs: string[], active: string, onSelect: (t: string) => void, badges?: Record<string, number> }) {
  return (
    <div style={{ borderBottom: `1px solid #f1f5f9`, display: "flex", marginBottom: 16, gap: 8 }}>
      {tabs.map(tab => (
        <div key={tab} style={{
          display: "flex",
          marginLeft: tab === "Clinical Notes" ? "auto" : 0,
          borderLeft: tab === "Clinical Notes" ? "1px solid #e2e8f0" : "none",
          paddingLeft: tab === "Clinical Notes" ? 8 : 0
        }}>
          <button onClick={() => onSelect(tab)} style={{
            background: "none", border: "none", padding: "12px 16px", fontSize: 14,
            fontWeight: 600, cursor: "pointer", color: active === tab ? BRAND : TEXT_SECONDARY,
            borderBottom: active === tab ? `2px solid ${BRAND}` : "2px solid transparent",
            marginBottom: -1, letterSpacing: "0.01em", transition: "all 0.2s ease",
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
            outline: "none"
          }}>
            {tab}
            {badges[tab] > 0 && (
              <span style={{
                background: active === tab ? BRAND : "#e2e8f0",
                color: active === tab ? "white" : TEXT_SECONDARY,
                fontSize: 10,
                fontWeight: 700,
                padding: "1px 7px",
                borderRadius: 10,
                minWidth: 16,
                textAlign: "center"
              }}>
                {badges[tab]}
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 18, fontSize: 15, color: TEXT_PRIMARY, fontFamily: "'Poppins', sans-serif" }}>
      {crumbs.map((crumb, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ cursor: i < crumbs.length - 1 ? "pointer" : "default", opacity: i < crumbs.length - 1 ? 0.7 : 1 }}>
            {crumb}
          </span>
          {i < crumbs.length - 1 && <span style={{ color: TEXT_SECONDARY, fontSize: 13 }}>/</span>}
        </span>
      ))}
    </div>
  );
}

export function SignalBox({ title, description }: { title: string, description: string }) {
  return (
    <div>
      <div style={{ border: `1px solid ${DIVIDER}`, borderRadius: 4, padding: "8px 12px", marginBottom: 8 }}>
        <div style={{ ...TYPE_SCALE.LabelMicro, marginBottom: 2 }}>Candidate Signal</div>
        <div style={{ ...TYPE_SCALE.BodyStandard }}>{title}</div>
      </div>
      <div style={{ border: `1px solid ${DIVIDER}`, borderRadius: 4, padding: "8px 12px" }}>
        <div style={{ ...TYPE_SCALE.LabelMicro, marginBottom: 2 }}>Signal Description</div>
        <div style={{ ...TYPE_SCALE.BodyStandard, minHeight: 60 }}>{description}</div>
      </div>
    </div>
  );
}

export interface EntityCardProps {
  key?: React.Key;
  title: string;
  statusBadge?: React.ReactNode;
  metadata?: { label: string; value: React.ReactNode }[];
  summary?: React.ReactNode;
  rightAction?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
  hoverable?: boolean;
}

export function EntityCard({
  title,
  statusBadge,
  metadata = [],
  summary,
  rightAction,
  onClick,
  children,
  hoverable = true,
}: EntityCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div 
      onClick={onClick}
      style={{ 
        background: "white", 
        border: `1px solid ${isHovered && hoverable && onClick ? BRAND : '#f1f5f9'}`, 
        borderRadius: 16, 
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
        cursor: hoverable && onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: metadata.length || summary ? 6 : 0 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: TEXT_PRIMARY, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
              {statusBadge}
            </div>
            
            {metadata.length > 0 && (
              <div style={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.5, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 4 }}>
                {metadata.map((m, i) => (
                  <span key={i}><strong style={{ fontWeight: 500, color: TEXT_PRIMARY }}>{m.label}:</strong> {m.value}</span>
                ))}
              </div>
            )}
            
            {summary && (
              <div style={{ fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.5, marginTop: 12 }}>
                {summary}
              </div>
            )}
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {rightAction}
          </div>
        </div>
        {children && <div style={{ marginTop: 20 }}>{children}</div>}
      </div>
    </div>
  );
}

export interface AssessmentCardProps {
  title: string;
  subtitle: string;
  status: string;
  onViewResult: () => void;
  key?: React.Key;
  date?: string;
  description?: string;
  notes?: string;
  overallImpression?: string;
  score?: string;
  percentile?: string;
  descriptor?: string;
}

const JOIN_LINK = "https://telehealth.threadline.com.au/join/{sessionId}?token=...";

function AssessmentLinkBox({ onCopy, copied }: { onCopy: () => void; copied: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: TEXT_SECONDARY, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        Session Access
      </span>
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, display: "flex", alignItems: "center", padding: "6px 10px", gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span style={{ fontSize: 12, color: TEXT_SECONDARY, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }}>
          {JOIN_LINK}
        </span>
        <button
          onClick={onCopy}
          style={{ background: copied ? "#f1f6f1" : "transparent", border: "none", color: copied ? "#059669" : BRAND, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif", padding: "2px 6px", borderRadius: 4 }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export function AssessmentCard({
  title,
  subtitle,
  status,
  onViewResult,
  description,
  notes,
  overallImpression,
  score,
  percentile,
  descriptor,
}: AssessmentCardProps) {
  const { flags } = useFeatureFlags();
  const [copied, setCopied] = React.useState(false);
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  const isCompleted = normalizedStatus === 'completed';
  const isNotStarted = normalizedStatus === 'not-started';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `https://portal.threadline.com.au/assessment/${title.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard for sharing with client");
  };

  const rightAction = isCompleted ? (
    <ThreadlineButton variant="outline" onClick={(e) => { e.stopPropagation(); onViewResult(); }} style={{ padding: "8px 20px", fontSize: 13 }}>
      View Workspace
    </ThreadlineButton>
  ) : (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <AssessmentLinkBox onCopy={handleCopy} copied={copied} />
      {isNotStarted ? (
        <button onClick={handleShare} style={{ background: "transparent", color: BRAND, border: "none", padding: "6px 10px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Poppins', sans-serif" }}>
          <Share2 size={16} /> Share
        </button>
      ) : (
        <ThreadlineButton variant="outline" onClick={(e) => { e.stopPropagation(); onViewResult(); }} style={{ padding: "6px 16px", fontSize: 13 }}>
          View Workspace
        </ThreadlineButton>
      )}
    </div>
  );

  return (
    <EntityCard
      title={title}
      summary={subtitle}
      statusBadge={<StatusBadge status={status as any} />}
      hoverable={false}
      metadata={[
        ...(overallImpression ? [{ label: "Overall Impression", value: <span style={{ color: BRAND }}>{overallImpression}</span> }] : []),
        ...(score ? [{ label: "Score", value: score }] : []),
        ...(percentile ? [{ label: "Percentile", value: percentile }] : []),
        ...(descriptor ? [{ label: "Descriptor", value: descriptor }] : []),
      ]}
      rightAction={rightAction}
      onClick={isCompleted && !overallImpression ? onViewResult : undefined}
    >
      {flags.FEATURE_ASSESSMENT_DETAILS && (description || notes) && (
        <div style={{ borderTop: `1px solid ${DIVIDER}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {description && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <FileText size={16} stroke={TEXT_DISABLED} style={{ marginTop: 2 }} />
              <div style={{ fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.5 }}>{description}</div>
            </div>
          )}
          {notes && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Calendar size={16} stroke={TEXT_DISABLED} style={{ marginTop: 2 }} />
              <div style={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: TEXT_PRIMARY }}>Clinical Notes: </span>{notes}
              </div>
            </div>
          )}
        </div>
      )}
    </EntityCard>
  );
}

export interface SessionCardProps {
  id: string;
  title: string;
  date: string;
  summary?: string;
  onClick?: () => void;
}

export function SessionCard({ id, title, date, summary, onClick }: SessionCardProps) {
  return (
    <EntityCard
      title={title || 'Session Details'}
      statusBadge={<StatusBadge status="completed" />}
      metadata={[
        { label: "Session ID", value: <span style={{ textTransform: "lowercase" }}>{id}</span> },
        { label: "Date", value: date },
        ...(summary ? [{ label: "Session Summary", value: summary }] : []),
      ]}
      rightAction={<ChevronRight size={24} color={TEXT_SECONDARY} />}
      onClick={onClick}
    />
  );
}

export interface DocumentCardProps {
  name: string;
  type?: string;
  status: string;
  creationDate: string;
  uploadDate?: string;
  onClick?: () => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

export function DocumentCard({ name, type, status, creationDate, uploadDate, onClick, onMenuClick }: DocumentCardProps) {
  const normalizedStatus = status.toLowerCase();
  const isUploaded = normalizedStatus === 'uploaded';

  return (
    <EntityCard
      title={name}
      statusBadge={<StatusBadge status={normalizedStatus as any} />}
      metadata={[
        ...(isUploaded && type ? [{ label: "Type", value: type }] : []),
        { label: "Creation Date", value: creationDate },
        ...(isUploaded && uploadDate ? [{ label: "Upload Date", value: uploadDate }] : []),
      ]}
      rightAction={
        <button
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 8 }}
          onClick={(e) => { e.stopPropagation(); onMenuClick?.(e); }}
        >
          <MoreVertical size={20} />
        </button>
      }
      onClick={onClick}
    />
  );
}

export function InterpRow({ title, content, defaultOpen = false, bg = "white", editable = false, isNextStep = false }: { title: string, content: string, defaultOpen?: boolean, bg?: string, editable?: boolean, isNextStep?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [editing, setEditing] = React.useState(false);
  const [text, setText] = React.useState(content);

  return (
    <div style={{ border: `1px solid #f1f5f9`, borderRadius: 12, background: bg, overflow: "hidden", marginBottom: 12 }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", background: "transparent",
      }}>
        <button onClick={() => setOpen(o => !o)} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "transparent", border: "none", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, textAlign: "left", flex: 1
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: open ? BRAND : "#cbd5e1" }} />
          <span>{title}</span>
          <span style={{ color: TEXT_SECONDARY, display: "flex", alignItems: "center", marginLeft: 4 }}>
            {open ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </span>
        </button>
        {editable && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <button onClick={(e) => { e.stopPropagation(); setEditing(true); setOpen(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_SECONDARY, display: "flex", alignItems: "center" }}>
              <EditIcon size={16} />
            </button>
          </div>
        )}
      </div>
      {open && (
        <div style={{ padding: "0 20px 20px 38px" }}>
          {editing ? (
            <div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                style={{ width: "100%", minHeight: 120, padding: 12, fontSize: 14, fontFamily: "'Poppins', sans-serif", border: `1px solid #e2e8f0`, borderRadius: 8, resize: "vertical", boxSizing: "border-box", color: TEXT_PRIMARY, lineHeight: 1.6, outline: "none" }}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <ThreadlineButton variant="outline" onClick={() => setEditing(false)}>Cancel</ThreadlineButton>
                <ThreadlineButton variant="primary" onClick={() => setEditing(false)}>Save</ThreadlineButton>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1, margin: 0, fontSize: 14, lineHeight: 1.6, fontFamily: "'Poppins', sans-serif", color: isNextStep && !text ? TEXT_SECONDARY : TEXT_PRIMARY }}>
                {text || "Type next steps here..."}
              </div>
            </div>
          )}
          {!editing && !editable && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}><SysBadge /></div>
          )}
        </div>
      )}
    </div>
  );
}
