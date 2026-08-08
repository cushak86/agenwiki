"use client";

import { useMemo, useState } from "react";
import { EFFORT_PRESETS, estimateTokens, MODELS } from "@/lib/models";

const inputClass =
  "w-full rounded-md border border-line bg-panel px-3 py-2 text-sm tabular-nums text-ink outline-none transition focus:border-accent";

function formatUsd(v: number): string {
  if (v >= 100) {
    return `$${v.toFixed(0)}`;
  }
  if (v >= 1) {
    return `$${v.toFixed(2)}`;
  }
  return `$${v.toFixed(3)}`;
}

function formatKrw(v: number): string {
  return `${Math.round(v).toLocaleString("ko-KR")}원`;
}

type SortKey = "name" | "priceInput" | "priceOutput" | "monthlyInput" | "monthlyOutput" | "total";

const SORT_COLUMNS: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "name", label: "모델", align: "left" },
  { key: "priceInput", label: "입력 $/1M", align: "left" },
  { key: "priceOutput", label: "출력 $/1M", align: "left" },
  { key: "monthlyInput", label: "월 입력 비용", align: "right" },
  { key: "monthlyOutput", label: "월 출력 비용", align: "right" },
  { key: "total", label: "월 합계", align: "right" }
];

export function LlmCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useState(3000);
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [fxRate, setFxRate] = useState(1400);
  // 추론(thinking) 토큰은 출력으로 과금 — 출력 토큰에 배수를 곱해 근사한다
  const [effortMultiplier, setEffortMultiplier] = useState(1);
  const [sampleText, setSampleText] = useState("");
  // 단가는 사용자가 직접 고칠 수 있다 — 기본값이 낡아도 계산기는 유효하게.
  const [prices, setPrices] = useState<Record<string, { input: number; output: number }>>(
    () => Object.fromEntries(MODELS.map((m) => [m.id, { input: m.inputPer1M, output: m.outputPer1M }]))
  );

  const estimated = sampleText.trim() ? estimateTokens(sampleText) : null;

  const effectiveOutputTokens = Math.round(outputTokens * effortMultiplier);
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [ascending, setAscending] = useState(true);

  const rows = useMemo(() => {
    const list = MODELS.map((model) => {
      const price = prices[model.id];
      const monthlyInput = (requestsPerMonth * inputTokens * price.input) / 1_000_000;
      const monthlyOutput = (requestsPerMonth * effectiveOutputTokens * price.output) / 1_000_000;
      return {
        model,
        price,
        priceInput: price.input,
        priceOutput: price.output,
        monthlyInput,
        monthlyOutput,
        total: monthlyInput + monthlyOutput
      };
    });
    list.sort((a, b) => {
      const direction = ascending ? 1 : -1;
      if (sortKey === "name") {
        return a.model.name.localeCompare(b.model.name) * direction;
      }
      return (a[sortKey] - b[sortKey]) * direction;
    });
    return list;
  }, [prices, requestsPerMonth, inputTokens, effectiveOutputTokens, sortKey, ascending]);

  // "최저" 배지는 정렬 순서와 무관하게 실제 최저가 모델에 붙인다
  const cheapestId = useMemo(() => {
    if (rows.length === 0) {
      return null;
    }
    return rows.reduce((min, row) => (row.total < min.total ? row : min), rows[0]).model.id;
  }, [rows]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAscending((v) => !v);
    } else {
      setSortKey(key);
      setAscending(true);
    }
  }

  function setPrice(id: string, key: "input" | "output", value: number) {
    setPrices((prev) => ({ ...prev, [id]: { ...prev[id], [key]: Math.max(0, value) } }));
  }

  return (
    <div>
      <div className="grid gap-4 rounded-lg border border-line bg-panel p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="text-xs font-semibold text-muted">월 요청 수</span>
          <input
            type="number"
            min={1}
            value={requestsPerMonth}
            onChange={(e) => setRequestsPerMonth(Math.max(1, Number(e.target.value) || 0))}
            className={`mt-1.5 ${inputClass}`}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-muted">요청당 입력 토큰</span>
          <input
            type="number"
            min={0}
            value={inputTokens}
            onChange={(e) => setInputTokens(Math.max(0, Number(e.target.value) || 0))}
            className={`mt-1.5 ${inputClass}`}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-muted">요청당 출력 토큰</span>
          <input
            type="number"
            min={0}
            value={outputTokens}
            onChange={(e) => setOutputTokens(Math.max(0, Number(e.target.value) || 0))}
            className={`mt-1.5 ${inputClass}`}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-muted">환율 (원/달러)</span>
          <input
            type="number"
            min={1}
            value={fxRate}
            onChange={(e) => setFxRate(Math.max(1, Number(e.target.value) || 0))}
            className={`mt-1.5 ${inputClass}`}
          />
        </label>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-panel p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-muted">추론 강도 (effort)</span>
          {EFFORT_PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => setEffortMultiplier(preset.multiplier)}
              title={preset.description}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                effortMultiplier === preset.multiplier
                  ? "bg-accentDeep text-white"
                  : "border border-line bg-panel text-muted hover:text-ink"
              }`}
            >
              {preset.label} ×{preset.multiplier}
            </button>
          ))}
          <label className="flex items-center gap-2 text-xs font-semibold text-muted">
            직접 입력
            <input
              type="number"
              min={1}
              step={0.5}
              value={effortMultiplier}
              onChange={(e) => setEffortMultiplier(Math.max(1, Number(e.target.value) || 1))}
              className="w-16 rounded-md border border-line bg-panel px-2 py-1 text-sm tabular-nums text-ink outline-none focus:border-accent"
            />
            배
          </label>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted">
          추론(thinking) 토큰은 화면에 보이지 않아도 <strong className="text-body">출력 토큰으로 과금</strong>
          됩니다. 위 배수는 요청당 출력 토큰에 곱해지는 대략값이며(실제 배수는 작업 난이도·모델에 따라 크게
          다름), 현재 계산에 쓰이는 요청당 출력은{" "}
          <strong className="tabular-nums text-body">{effectiveOutputTokens.toLocaleString()}</strong> 토큰입니다.
        </p>
      </div>

      <details className="mt-4 rounded-lg border border-line bg-panel p-5">
        <summary className="cursor-pointer text-sm font-semibold text-ink">
          텍스트로 토큰 수 추정하기 (선택)
        </summary>
        <textarea
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          rows={4}
          placeholder="여기에 요청 한 건에 들어갈 텍스트를 붙여넣으면 토큰 수를 추정합니다."
          className="mt-3 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm leading-6 text-ink outline-none focus:border-accent"
        />
        {estimated !== null ? (
          <p className="mt-2 text-sm text-muted">
            추정 약 <strong className="font-bold tabular-nums text-ink">{estimated.toLocaleString()}</strong>{" "}
            토큰 (한글 ~1.3자/토큰, 영문 ~4자/토큰 기준의 대략 추정 — 토크나이저마다 다릅니다){" "}
            <button
              type="button"
              onClick={() => setInputTokens(estimated)}
              className="ml-1 rounded-md border border-line px-2 py-0.5 text-xs font-semibold text-accent transition hover:border-accent"
            >
              입력 토큰에 적용
            </button>
          </p>
        ) : null}
      </details>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-bold uppercase tracking-wider text-muted">
              {SORT_COLUMNS.map((col) => (
                <th key={col.key} className={`py-3 ${col.align === "right" ? "text-right" : ""} ${col.key !== "total" ? "pr-3" : ""}`}>
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
            </tr>
          </thead>
          <tbody>
            {rows.map(({ model, price, monthlyInput, monthlyOutput, total }) => (
              <tr key={model.id} className={`border-b border-line/60 ${model.id === cheapestId ? "bg-accentDeep/10" : ""}`}>
                {/* th scope="row" 라야 표가 제대로 읽힌다. td 로 두면 각 입력칸이 어느 모델 줄인지
                    보조기술에서 연결이 끊긴다 — 아래 aria-label 과 짝을 이룬다. */}
                <th scope="row" className="py-3 pr-3 text-left font-normal">
                  <span className="font-semibold text-ink">{model.name}</span>
                  <span className="ml-2 text-xs text-muted">{model.provider}</span>
                  {model.id === cheapestId ? (
                    <span className="ml-2 rounded-full border border-accent/40 px-2 py-0.5 text-[11px] font-bold text-accentSoft">
                      최저
                    </span>
                  ) : null}
                </th>
                <td className="py-3 pr-3">
                  {/* 입력 26개(13행 × 2)에 이름이 하나도 없었다. 시각적으로는 열 제목으로 구분되지만
                      보조기술에는 "편집창" 26개가 나란히 들릴 뿐이다(Lighthouse label 감사 실패). */}
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    aria-label={`${model.name} 입력 단가 (100만 토큰당 달러)`}
                    value={price.input}
                    onChange={(e) => setPrice(model.id, "input", Number(e.target.value) || 0)}
                    className="w-20 rounded-md border border-line bg-panel px-2 py-1 text-sm tabular-nums text-ink outline-none focus:border-accent"
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    aria-label={`${model.name} 출력 단가 (100만 토큰당 달러)`}
                    value={price.output}
                    onChange={(e) => setPrice(model.id, "output", Number(e.target.value) || 0)}
                    className="w-20 rounded-md border border-line bg-panel px-2 py-1 text-sm tabular-nums text-ink outline-none focus:border-accent"
                  />
                </td>
                <td className="py-3 pr-3 text-right tabular-nums text-muted">{formatUsd(monthlyInput)}</td>
                <td className="py-3 pr-3 text-right tabular-nums text-muted">{formatUsd(monthlyOutput)}</td>
                <td className="py-3 text-right">
                  <span className="font-bold tabular-nums text-ink">{formatUsd(total)}</span>
                  <span className="ml-2 text-xs tabular-nums text-muted">{formatKrw(total * fxRate)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        열 제목을 누르면 그 열 기준으로 정렬되고, 다시 누르면 순서가 뒤집힙니다(비싼 순으로 보고 싶을 때).
        단가 칸을 직접 고치면 표가 다시 계산됩니다. 캐시된 입력, 배치 할인, 장문 컨텍스트 구간 단가는
        반영하지 않은 단순 계산입니다.
      </p>
    </div>
  );
}
