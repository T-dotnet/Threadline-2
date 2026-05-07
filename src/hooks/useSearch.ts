import { useState, useMemo } from "react";

export interface UseSearchOptions<T> {
  items: T[];
  fields: (keyof T)[];
}

export interface UseSearchReturn<T> {
  query: string;
  setQuery: (q: string) => void;
  results: T[];
}

export function useSearch<T extends Record<string, unknown>>(
  options: UseSearchOptions<T>
): UseSearchReturn<T> {
  const { items, fields } = options;
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter((item) =>
      fields.some((field) => {
        const val = item[field];
        if (Array.isArray(val)) {
          return val.some((v) => String(v).toLowerCase().includes(lower));
        }
        return String(val ?? "").toLowerCase().includes(lower);
      })
    );
  }, [items, fields, query]);

  return { query, setQuery, results };
}
