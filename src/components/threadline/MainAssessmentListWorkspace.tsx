import React, { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, TYPE_SCALE } from "./constants";
import { ClinicianTag, DataTable, ListViewLayout, TableColumn } from "./components";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { StatusBadge } from "../common/StatusBadge";

const COLUMNS: TableColumn[] = [
  { label: "Client",              width: "28%", sortable: true },
  { label: "Lead Clinician",      width: "22%" },
  { label: "Recent Assessments",  width: "35%" },
  { label: "Action",              width: "15%", align: "right" },
];

export function MainAssessmentListWorkspace() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);

  const filtered = MOCK_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.clinicians.some((cl: string) => cl.toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice(page * rpp, (page + 1) * rpp);

  return (
    <ListViewLayout
      title="Assessments"
      subtitle="Track and manage diagnostic assessments for all clients."
      actionLabel="Start New Assessment"
      actionIcon={<ClipboardCheck size={18} />}
      search={search}
      onSearchChange={v => { setSearch(v); setPage(0); }}
      searchPlaceholder="Search by Clients, or Clinicians"
      page={page}
      setPage={setPage}
      rpp={rpp}
      setRpp={setRpp}
      totalRows={filtered.length}
    >
      <DataTable columns={COLUMNS}>
        {paginated.map((client, i) => {
          const clientAssessments = MOCK_CLIENT_DATA[client.id]?.assessments || [];
          return (
            <tr key={client.id} style={{ borderBottom: `1px solid ${DIVIDER}` }} className="hover:bg-gray-50">
              <td style={{ padding: "16px 24px" }}>
                <div style={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: 15 }}>{client.name}</div>
                <div style={{ fontSize: 13, color: TEXT_SECONDARY }}>#{client.id}</div>
              </td>
              <td style={{ padding: "16px 24px" }}>
                <ClinicianTag name={client.clinicians[0]} />
              </td>
              <td style={{ padding: "16px 24px" }}>
                {clientAssessments.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {clientAssessments.slice(0, 2).map((a: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY }}>{a.title}</span>
                        <StatusBadge status={a.status as any} />
                      </div>
                    ))}
                    {clientAssessments.length > 2 && (
                      <div style={{ ...TYPE_SCALE.LabelMicro }}>+{clientAssessments.length - 2} more</div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: TEXT_SECONDARY, fontStyle: "italic" }}>No assessments yet</div>
                )}
              </td>
              <td style={{ padding: "16px 24px", textAlign: "right" }}>
                <button style={{ color: "#4caf50", background: "none", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Manage
                </button>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </ListViewLayout>
  );
}
