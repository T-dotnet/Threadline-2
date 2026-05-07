import React from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus
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
import { MOCK_CLIENTS } from "./mockData";
import { useSearch, usePagination } from "../../hooks";
import { SearchInput } from "../common/SearchInput";

export function MainSessionListWorkspace() {
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
          <h1 style={h1Style}>Sessions</h1>
          <p style={subStyle}>Monitor and manage all client sessions in one place.</p>
        </div>
        <button style={primaryBtn}>
          <Plus size={18} />
          New Session
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
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.2fr 0.8fr", padding: "16px 24px", borderBottom: `1px solid ${DIVIDER}`, background: '#f9fafb', fontSize: 13, fontWeight: 600, color: TEXT_SECONDARY }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Clients <ChevronDown size={14} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Clinicians</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Session Date & Time <ChevronDown size={14} /></div>
            <div style={{ textAlign: 'right' }}>Action</div>
          </div>

          {pageItems.map((client, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.2fr 0.8fr", padding: "24px", borderBottom: i < pageItems.length - 1 ? `1px solid ${DIVIDER}` : "none", alignItems: "center" }}>
              <div>
                <div style={{ color: TEXT_PRIMARY, fontWeight: 500, fontSize: 15 }}>{client.name}</div>
                <div style={{ fontSize: 13, color: TEXT_SECONDARY }}>#{client.id}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexDirection: 'column', alignItems: 'flex-start' }}>
                {client.clinicians.map((clinician, idx) => (
                  <ClinicianTag key={idx} name={clinician} />
                ))}
              </div>
              <div style={{ ...TYPE_SCALE.BodyStandard }}>
                <div style={{ fontWeight: 500 }}>8:45 – 9:23 PM</div>
                <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>June 26, 2026</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <button style={{ color: "#4caf50", background: 'none', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>View Session</button>
              </div>
            </div>
          ))}
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
