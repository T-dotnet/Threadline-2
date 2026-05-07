/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { COLORS, ICON_PATHS, ALL_CATS } from "../../constants";
import { Icon, FilterChip, SimpleDropdown, MultiDropdown } from "../common/UIElements";
import { SearchInput } from "../common/SearchInput";

interface FilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  catFilters: string[];
  toggleCat: (cat: string) => void;
  catOpen: boolean;
  setCatOpen: (o: boolean) => void;
}

export function FilterBar({
  search, setSearch,
  statusFilter, setStatusFilter,
  catFilters, toggleCat,
  catOpen, setCatOpen
}: FilterBarProps) {
  return (
    <div style={{ padding: "24px 24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <SimpleDropdown
            label="Status"
            value={statusFilter}
            options={["All Status", "Approved", "In Review", "Deprecated", "Draft"]}
            onChange={setStatusFilter}
            width={200}
          />

          <MultiDropdown
            label="Categories"
            value={catFilters}
            options={ALL_CATS}
            onToggle={toggleCat}
            width={240}
          />
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search conditions..."
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {catFilters.map(cat => (
          <FilterChip key={cat} label={cat} onRemove={() => toggleCat(cat)} />
        ))}
        {catFilters.length > 0 && (
          <button
            onClick={() => toggleCat("CLEAR_ALL")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Poppins',sans-serif", fontSize: 13, color: COLORS.P,
              fontWeight: 500, padding: "4px 8px"
            }}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
