import React, { useState } from "react";
import { Plus } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, TYPE_SCALE } from "./constants";
import { ClinicianTag, DataTable, ListViewLayout, TableColumn } from "./components";
import { MOCK_CLIENTS } from "./mockData";

const COLUMNS: TableColumn[] = [
  { label: "Client",               width: "30%", sortable: true },
  { label: "Clinicians",           width: "25%" },
  { label: "Session Date & Time",  width: "30%", sortable: true },
  { label: "Action",               width: "15%", align: "right" },
];

export function MainSessionListWorkspace() {
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
      title="Sessions"
      subtitle="Monitor and manage all client sessions in one place."
      actionLabel="New Session"
      actionIcon={<Plus size={18} />}
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
        {paginated.map((client, i) => (
          <tr key={client.id} style={{ borderBottom: `1px solid ${DIVIDER}` }} className="hover:bg-gray-50">
            <td style={{ padding: "16px 24px" }}>
              <div style={{ color: TEXT_PRIMARY, fontWeight: 500, fontSize: 15 }}>{client.name}</div>
              <div style={{ fontSize: 13, color: TEXT_SECONDARY }}>#{client.id}</div>
            </td>
            <td style={{ padding: "16px 24px" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {client.clinicians.map((clinician: string, idx: number) => (
                  <ClinicianTag key={idx} name={clinician} />
                ))}
              </div>
            </td>
            <td style={{ padding: "16px 24px" }}>
              <div style={{ fontWeight: 500, fontSize: 14, color: TEXT_PRIMARY }}>8:45 – 9:23 PM</div>
              <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>June 26, 2026</div>
            </td>
            <td style={{ padding: "16px 24px", textAlign: "right" }}>
              <button style={{ color: "#4caf50", background: "none", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                View Session
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </ListViewLayout>
  );
}
