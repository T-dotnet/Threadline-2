import { useState, useMemo, useEffect } from "react";

export interface UsePaginationOptions<T> {
  items: T[];
  pageSize?: number;
}

export interface UsePaginationReturn<T> {
  page: number;
  setPage: (page: number | ((p: number) => number)) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  totalPages: number;
  pageItems: T[];
  hasPrev: boolean;
  hasNext: boolean;
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

export function usePagination<T>(
  options: UsePaginationOptions<T>
): UsePaginationReturn<T> {
  const { items, pageSize: initialPageSize = 10 } = options;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Reset to first page when item count changes (e.g., search filters list)
  useEffect(() => {
    setPage(0);
  }, [items.length]);

  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const safePage = Math.min(page, totalPages - 1);

  const pageItems = useMemo(
    () => items.slice(safePage * pageSize, (safePage + 1) * pageSize),
    [items, safePage, pageSize]
  );

  const startIndex = items.length === 0 ? 0 : safePage * pageSize + 1;
  const endIndex = Math.min((safePage + 1) * pageSize, items.length);

  return {
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    pageItems,
    hasPrev: safePage > 0,
    hasNext: safePage < totalPages - 1,
    startIndex,
    endIndex,
    totalCount: items.length,
  };
}
