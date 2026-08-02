"use client";

import { useMemo, useState } from "react";
import { estimateTokens, MODELS } from "@/lib/models";

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

export function LlmCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useState(3000);
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [fxRate, setFxRate] = useState(1400);
  const [sampleText, setSampleText] = useState("");
  // 단가는 사용자가 직접 고칠 수 있다 — 기본값이 낡아도 계산기는 유효하게.
  const [prices, setPrices] = useState<Record<string, { input: number; output: number }>>(
    () => Object.fromEntries(MODELS.map((m) => [m.id, { input: m.inputPer1M, output: m.outputPer1M }]))
  );

  const estimated = sampleText.trim() ? estimateTokens(sampleText) : null;

  const rows = useMemo(() => {
    return MODELS.map((model) => {
      const price = prices[model.id];
      const monthlyInput = (requestsPerMonth * inputTokens * price.input) / 1_000_000;
      const monthlyOutput = (requestsPerMonth * outputTokens * price.output) / 1_000_000;
      return { model, price, monthlyInput, monthlyOutput, total: monthlyInput + monthlyOutput };
    }).sort((a, b) => a.total - b.total);
  }, [prices, requestsPerMonth, inputTokens, outputTokens]);

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
              <th className="py-3 pr-3">모델</th>
              <th className="py-3 pr-3">입력 $/1M</th>
              <th className="py-3 pr-3">출력 $/1M</th>
              <th className="py-3 pr-3 text-right">월 입력 비용</th>
              <th className="py-3 pr-3 text-right">월 출력 비용</th>
              <th className="py-3 text-right">월 합계</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ model, price, monthlyInput, monthlyOutput, total }, index) => (
              <tr key={model.id} className={`border-b border-line/60 ${index === 0 ? "bg-accentDeep/10" : ""}`}>
                <td className="py-3 pr-3">
                  <span className="font-semibold text-ink">{model.name}</span>
                  <span className="ml-2 text-xs text-muted">{model.provider}</span>
                  {index === 0 ? (
                    <span className="ml-2 rounded-full border border-accent/40 px-2 py-0.5 text-[11px] font-bold text-accentSoft">
                      최저
                    </span>
                  ) : null}
                </td>
                <td className="py-3 pr-3">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
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
        단가 칸을 직접 고치면 표가 다시 계산됩니다. 캐시된 입력, 배치 할인, 장문 컨텍스트 구간 단가는
        반영하지 않은 단순 계산입니다.
      </p>
    </div>
  );
}
