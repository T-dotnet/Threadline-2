import React from "react";
import {
  ChevronDown,
  ClipboardCheck
} from "lucide-react";
import { TEXT_PRIMARY,
  TEXT_SECONDARY,
  DIVIDER,
  h1Style,
  subStyle,
  cardStyle,
  cardHeaderStyle,
  primaryBtn, TYPE_SCALE } from "./constants";
import { ClinicianTag } from "./components";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { useSearch, usePagination } from "../../hooks";
import { SearchInput } from "../common/SearchInput";

export function MainAssessmentListWorkspace() {
  const { query, setQuery, results: filtered } = useSearch({
    items: MOCK_CLIENTS,
    fields: ["name", "clinicians"],
  });

  const {
    pageItems,
    pageSize,
    setPageSize,
    setPage,
    hasPrev,
    hasNext,
    startIndex,
    endIndex,
    totalCount,
  } = usePagination({ items: filtered, pageSize: 10 });

  return (
    <div style={{ padding: "32px 0 64px" }}>
      <div style={{ ...cardHeaderStyle, borderBottom: "none", padding: "0 0 32px 0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={h1Style}>Assessments</h1>
          <p style={subStyle}>Track and manage diagnostic assessments for all clients.</p>
        </div>
        <button style={primaryBtn}>
          <ClipboardCheck size={18} />
          Start New Assessment
        </button>
      </div>

      <div style={cardStyle}>
        {/* Table Controls (Search) */}
        <div style={{ ...cardHeaderStyle, justifyContent: "flex-end", padding: "20px 24px" }}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by Clients, or Clinicians"
          />
        </div>

        {/* Table Body */}
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.5fr 0.8fr", padding: "16px 24px", borderBottom: `1px solid ${DIVIDER}`, background: '#f9fafb', fontSize: 13, fontWeight: 600, color: TEXT_SECONDARY }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Client <ChevronDown size={14} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Lead Clinician</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Recent Assessments</div>
            <div style={{ textAlign: 'right' }}>Action</div>
          </div>

          {pageItems.map((client, i) => {
            const clientAssessments = MOCK_CLIENT_DATA[client.id]?.assessments || [];

            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.5fr 0.8fr", padding: "24px", borderBottom: i < pageItems.length - 1 ? `1px solid ${DIVIDER}` : "none", alignItems: "center" }}>
                <div>
                  <div style={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: 15 }}>{client.name}</div>
                  <div style={{ fontSize: 13, color: TEXT_SECONDARY }}>#{client.id}</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <ClinicianTag name={client.clinicians[0]} />
                </div>
                <div>
                   {clientAssessments.length > 0 ? (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                       {clientAssessments.slice(0, 2).map((a, idx) => (
                         <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                           <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{a.title}</span>
                           <span style={{
                             fontSize: 10,
                             padding: "2px 6px",
                             borderRadius: 4,
                             background: a.status.toLowerCase() === 'completed' ? '#f0fdf4' : (a.status.toLowerCase() === 'in progress' || a.status.toLowerCase() === 'in-progress' ? '#fff7ed' : '#f1f5f9'),
                             color: a.status.toLowerCase() === 'completed' ? '#166534' : (a.status.toLowerCase() === 'in progress' || a.status.toLowerCase() === 'in-progress' ? '#9a3412' : '#475569'),
                             fontWeight: 600
                           }}>{a.status}</span>
                         </div>
                       ))}
                       {clientAssessments.length > 2 && (
                         <div style={{ ...TYPE_SCALE.LabelMicro }}>+{clientAssessments.length - 2} more</div>
                       )}
                     </div>
                   ) : (
                     <div style={{ fontSize: 13, color: TEXT_SECONDARY, fontStyle: 'italic' }}>No assessments yet</div>
                   )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <button style={{ color: "#4caf50", background: 'none', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Manage</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: "20px 24px", borderTop: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, fontSize: 13, color: TEXT_SECONDARY }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Rows per page:
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
              style={{ marginLeft: 4, border: 'none', background: 'transparent', fontWeight: 500, color: TEXT_PRIMARY, cursor: 'pointer', fontSize: 13 }}
            >
              {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <ChevronDown size={14} />
          </div>
          <div style={{ color: TEXT_PRIMARY }}>
            {totalCount === 0 ? "0" : `${startIndex}–${endIndex}`} of {totalCount}
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              style={{ background: 'none', border: 'none', cursor: hasPrev ? 'pointer' : 'default', color: hasPrev ? TEXT_PRIMARY : TEXT_SECONDARY }}
              disabled={!hasPrev}
              onClick={() => setPage((p) => p - 1)}
            >{"<"}</button>
            <button
              style={{ background: 'none', border: 'none', cursor: hasNext ? 'pointer' : 'default', color: hasNext ? TEXT_PRIMARY : TEXT_SECONDARY }}
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
            >{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
