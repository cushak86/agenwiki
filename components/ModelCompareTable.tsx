"use client";

import { useMemo, useState } from "react";
import { formatTokens, MODELS } from "@/lib/models";

type SortKey = "name" | "inputPer1M" | "outputPer1M" | "contextWindow" | "combined";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "모델" },
  { key: "inputPer1M", label: "입력 $/1M" },
  { key: "outputPer1M", label: "출력 $/1M" },
  { key: "combined", label: "입력+출력 합계" },
  { key: "contextWindow", label: "컨텍스트" }
];

export function ModelCompareTable() {
  const [sortKey, setSortKey] = useState<SortKey>("combined");
  const [ascending, setAscending] = useState(true);

  const rows = useMemo(() => {
    const list = MODELS.map((m) => ({ ...m, combined: m.inputPer1M + m.outputPer1M }));
    list.sort((a, b) => {
      if (sortKey === "name") {
        return a.name.localeCompare(b.name) * (ascending ? 1 : -1);
      }
      return (a[sortKey] - b[sortKey]) * (ascending ? 1 : -1);
    });
    return list;
  }, [sortKey, ascending]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAscending((v) => !v);
    } else {
      setSortKey(key);
      setAscending(true);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs font-bold uppercase tracking-wider text-muted">
            {COLUMNS.map((col) => (
              <th key={col.key} className="py-3 pr-3">
                <button
                  type="button"
                  onClick={() => toggleSort(col.key)}
                  className={`transition hover:text-ink ${sortKey === col.key ? "text-accent" : ""}`}
                >
                  {col.label}
                  {sortKey === col.key ? (ascending ? " ↑" : " ↓") : ""}
                </button>
              </th>
            ))}
            <th className="py-3">비고</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((model) => (
            <tr key={model.id} className="border-b border-line/60">
              <td className="py-3 pr-3">
                <span className="font-semibold text-ink">{model.name}</span>
                <span className="ml-2 text-xs text-muted">{model.provider}</span>
              </td>
              <td className="py-3 pr-3 tabular-nums text-muted">${model.inputPer1M.toFixed(2)}</td>
              <td className="py-3 pr-3 tabular-nums text-muted">${model.outputPer1M.toFixed(2)}</td>
              <td className="py-3 pr-3 font-semibold tabular-nums text-ink">${model.combined.toFixed(2)}</td>
              <td className="py-3 pr-3 tabular-nums text-muted">
                {formatTokens(model.contextWindow)}
                {model.contextNote ? <span className="ml-1 text-xs">({model.contextNote})</span> : null}
              </td>
              <td className="py-3 text-xs leading-5 text-muted">{model.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
