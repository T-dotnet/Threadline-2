import React, { useState } from "react";
import { Plus as AddIcon } from "lucide-react";
import { TEXT_SECONDARY, TEXT_DISABLED, DIVIDER, TYPE_SCALE } from "./constants";
import { ClinicianTag, ConsentBadge, DataTable, ListViewLayout, TableColumn } from "./components";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { SimpleDropdown } from "../common/UIElements";
import { StatusBadge, StatusType } from "../common/StatusBadge";

export type ClientStatus = StatusType;

export function deriveClientStatus(client: any): ClientStatus {
  const data = MOCK_CLIENT_DATA[client.id];
  if (!data) return 'idle';

  if ((!data.sessions || data.sessions.length === 0) &&
      (!data.assessments || data.assessments.every((a: any) => a.status.toLowerCase() === 'not-started'))) {
    return 'new';
  }

  if (!client.consent || (client.missingDocs && client.missingDocs.length > 0)) return 'missing-documents';
  if (client.hasConflicts) return 'conflicts-unresolved';

  const hasInProgress = data.assessments?.some((a: any) => a.status.toLowerCase() === 'in-progress');
  if (hasInProgress) return 'in-progress';

  const allCompleted = data.assessments?.length > 0 && data.assessments.every((a: any) => a.status.toLowerCase() === 'completed');
  if (allCompleted) return 'ready';

  return 'idle';
}

const COLUMNS: TableColumn[] = [
  { label: "Name",             width: "18%", sortable: true },
  { label: "Status",           width: "12%", sortable: true },
  { label: "External ID",      width: "10%", sortable: true },
  { label: "Clinicians",       width: "18%" },
  { label: "Referred By",      width: "15%", sortable: true },
  { label: "Last Session",     width: "15%", sortable: true },
  { label: "Consent Obtained", width: "9%",  sortable: true },
  { label: "Action",           width: "3%",  align: "right" },
];

export function ClientListScreen({ onSelectClient }: { onSelectClient: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [clinicianFilter, setClinicianFilter] = useState("All Clinicians");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);

  const filtered = MOCK_CLIENTS.filter(c =>
    (clinicianFilter === "All Clinicians" || c.clinicians.includes(clinicianFilter)) &&
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.ref?.toLowerCase().includes(search.toLowerCase()) ||
      c.id?.toString().includes(search))
  );

  const paginated = filtered.slice(page * rpp, (page + 1) * rpp);

  return (
    <ListViewLayout
      title="Clients"
      subtitle="Manage your diagnostic registry and client relationships."
      actionLabel="Add Client"
      actionIcon={<AddIcon size={18} />}
      search={search}
      onSearchChange={v => { setSearch(v); setPage(0); }}
      searchPlaceholder="Search by name, Referred, or Id"
      leftControls={
        <SimpleDropdown
          label="Clinician"
          value={clinicianFilter}
          options={["All Clinicians", "James Wilson", "Sara Miller", "Olivia Porter"]}
          onChange={v => { setClinicianFilter(v); setPage(0); }}
          width={200}
        />
      }
      page={page}
      setPage={setPage}
      rpp={rpp}
      setRpp={setRpp}
      totalRows={filtered.length}
    >
      <DataTable columns={COLUMNS}>
        {paginated.map((c, i) => {
          const status = deriveClientStatus(c);
          return (
            <tr key={c.id} style={{ borderBottom: `1px solid ${DIVIDER}` }} className="hover:bg-gray-50">
              <td style={{ padding: "16px" }}>
                <div
                  onClick={() => onSelectClient(c.id)}
                  style={{ ...TYPE_SCALE.BodyStandard, fontWeight: 600, cursor: "pointer", marginBottom: 2 }}
                >
                  {c.name}
                </div>
                <div style={{ ...TYPE_SCALE.LabelMicro }}>ID: #{c.id}</div>
              </td>
              <td style={{ padding: "16px" }}>
                {status !== 'idle'
                  ? <StatusBadge status={status} />
                  : <span style={{ color: TEXT_DISABLED, fontSize: 13 }}>—</span>}
              </td>
              <td style={{ padding: "16px", fontSize: 14, color: TEXT_SECONDARY }}>{c.extId}</td>
              <td style={{ padding: "16px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {c.clinicians.map((cl: string, idx: number) => <ClinicianTag key={idx} name={cl} />)}
                </div>
                {c.extra > 0 && <div style={{ ...TYPE_SCALE.LabelMicro, marginTop: 4 }}>+{c.extra} more</div>}
              </td>
              <td style={{ padding: "16px", fontSize: 14, color: TEXT_SECONDARY }}>{c.ref}</td>
              <td style={{ padding: "16px", fontSize: 14, color: TEXT_SECONDARY }}>{c.last}</td>
              <td style={{ padding: "16px" }}>
                <ConsentBadge yes={c.consent} />
              </td>
              <td style={{ padding: "16px", textAlign: "right" }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                  </svg>
                </button>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </ListViewLayout>
  );
}
