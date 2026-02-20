"use client";

import React, { useState } from "react";

/* ── Types ── */
interface Column<T> {
    key: string;
    header: string;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField: string;
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
    loading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    keyField,
    onRowClick,
    emptyMessage = "No data found",
    loading = false,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    function handleSort(key: string) {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    /* Sort data */
    const sortedData = sortKey
        ? [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
            return sortDir === "asc" ? cmp : -cmp;
        })
        : data;

    /* Loading skeleton */
    if (loading) {
        return (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} style={{ width: col.width }}>{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i}>
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        <div className="skeleton skeleton-text" style={{ width: "80%" }} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    /* Empty state */
    if (data.length === 0) {
        return (
            <div className="card">
                <div className="empty-state">
                    <span className="material-symbols-outlined empty-state-icon">search_off</span>
                    <div className="empty-state-title">{emptyMessage}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                style={{
                                    width: col.width,
                                    cursor: col.sortable ? "pointer" : "default",
                                    userSelect: "none",
                                }}
                                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                            >
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    {col.header}
                                    {col.sortable && sortKey === col.key && (
                                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                            {sortDir === "asc" ? "arrow_upward" : "arrow_downward"}
                                        </span>
                                    )}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row) => (
                        <tr
                            key={String(row[keyField])}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                            style={{ cursor: onRowClick ? "pointer" : "default" }}
                        >
                            {columns.map((col) => (
                                <td key={col.key}>
                                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
