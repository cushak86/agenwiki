"use client";

import { useMemo, useState } from "react";
import { estimateTokens } from "@/lib/models";

const SAMPLE_TEXT = `RAG 파이프라인은 문서를 그대로 통째로 쓰지 않는다. 먼저 문서를 검색 가능한 조각으로 나누고, 각 조각을 임베딩 벡터로 바꿔 저장한다. 질문이 들어오면 질문과 가까운 조각을 찾아 모델에게 근거로 건넨다.

여기서 조각의 크기가 검색 품질을 좌우한다. 조각이 너무 크면 관련 없는 내용까지 함께 딸려 들어가 모델이 핵심을 놓치고, 너무 작으면 문맥이 잘려 조각 하나만 봐서는 무슨 말인지 알 수 없게 된다.

오버랩은 이 문제를 완화하는 장치다. 이웃한 조각이 일정 구간을 공유하게 만들면, 경계에 걸린 문장이 어느 한쪽 조각에는 온전히 담긴다. 대신 저장 용량과 임베딩 비용이 그만큼 늘어난다.

전략도 하나가 아니다. 글자 수로 기계적으로 자르는 고정 길이 방식이 가장 단순하고, 문장이나 문단 경계를 존중하는 방식은 의미 단위가 덜 깨진다. 실무에서는 문단 우선으로 나누되 너무 긴 문단만 다시 쪼개는 절충이 흔하다.`;

type Strategy = "fixed" | "sentence" | "paragraph";

type Chunk = { text: string; overlapWithPrev: number };

function splitUnits(text: string, strategy: Strategy): string[] {
  if (strategy === "paragraph") {
    return text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  }
  if (strategy === "sentence") {
    return (text.replace(/\n+/g, " ").match(/[^.!?。]+[.!?。]?/g) ?? []).map((s) => s.trim()).filter(Boolean);
  }
  return [text.replace(/\s+/g, " ").trim()];
}

/**
 * 단위(문장/문단/전체)를 chunkSize(글자) 이하로 묶고, overlapRatio 만큼 앞 청크의 꼬리를 겹친다.
 * 실제 라이브러리(LangChain 등)의 재귀 분할을 단순화한 교육용 구현 — 동작 원리를 보여주는 것이 목적.
 */
function makeChunks(text: string, strategy: Strategy, chunkSize: number, overlapRatio: number): Chunk[] {
  const units = splitUnits(text, strategy);
  const pieces: string[] = [];

  for (const unit of units) {
    if (unit.length <= chunkSize) {
      pieces.push(unit);
      continue;
    }
    for (let i = 0; i < unit.length; i += chunkSize) {
      pieces.push(unit.slice(i, i + chunkSize));
    }
  }

  // 단위들을 chunkSize를 넘지 않는 선에서 앞에서부터 병합
  const merged: string[] = [];
  let current = "";
  for (const piece of pieces) {
    if (current && (current + " " + piece).length > chunkSize) {
      merged.push(current);
      current = piece;
    } else {
      current = current ? `${current} ${piece}` : piece;
    }
  }
  if (current) {
    merged.push(current);
  }

  const overlapChars = Math.round(chunkSize * overlapRatio);
  return merged.map((text, i) => {
    if (i === 0 || overlapChars === 0) {
      return { text, overlapWithPrev: 0 };
    }
    const prev = merged[i - 1];
    const tail = prev.slice(Math.max(0, prev.length - overlapChars));
    return { text: `${tail} ${text}`, overlapWithPrev: tail.length };
  });
}

const STRATEGIES: { key: Strategy; label: string; description: string }[] = [
  { key: "fixed", label: "고정 길이", description: "글자 수로 기계적으로 자름 — 문장이 중간에서 갈라질 수 있음" },
  { key: "sentence", label: "문장 우선", description: "문장 경계를 존중하며 크기 제한까지 병합" },
  { key: "paragraph", label: "문단 우선", description: "문단 경계를 존중하며 크기 제한까지 병합" }
];

const CHUNK_COLORS = ["border-accent/60", "border-emerald-500/60", "border-amber-500/60", "border-sky-500/60"];

export function ChunkingSimulator() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [strategy, setStrategy] = useState<Strategy>("paragraph");
  const [chunkSize, setChunkSize] = useState(300);
  const [overlapPct, setOverlapPct] = useState(10);

  const chunks = useMemo(
    () => makeChunks(text, strategy, chunkSize, overlapPct / 100),
    [text, strategy, chunkSize, overlapPct]
  );

  const avgLen = chunks.length ? Math.round(chunks.reduce((s, c) => s + c.text.length, 0) / chunks.length) : 0;
  const totalTokens = chunks.reduce((s, c) => s + estimateTokens(c.text), 0);

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-accent"
      />

      <div className="mt-4 grid gap-4 rounded-lg border border-line bg-panel p-5 md:grid-cols-3">
        <div>
          <span className="text-xs font-semibold text-muted">분할 전략</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {STRATEGIES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setStrategy(s.key)}
                title={s.description}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  strategy === s.key
                    ? "bg-accentDeep text-white"
                    : "border border-line bg-panel text-muted hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">{STRATEGIES.find((s) => s.key === strategy)?.description}</p>
        </div>
        <label className="block">
          <span className="text-xs font-semibold text-muted">
            청크 크기: <strong className="tabular-nums text-ink">{chunkSize}자</strong> (약{" "}
            {estimateTokens("가".repeat(chunkSize))} 토큰)
          </span>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={chunkSize}
            onChange={(e) => setChunkSize(Number(e.target.value))}
            className="mt-3 w-full accent-[#6246ea]"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-muted">
            오버랩: <strong className="tabular-nums text-ink">{overlapPct}%</strong>
          </span>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={overlapPct}
            onChange={(e) => setOverlapPct(Number(e.target.value))}
            className="mt-3 w-full accent-[#6246ea]"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
        <span>
          청크 <strong className="font-bold tabular-nums text-ink">{chunks.length}</strong>개
        </span>
        <span>
          평균 <strong className="font-bold tabular-nums text-ink">{avgLen}</strong>자
        </span>
        <span>
          임베딩 대상 총 <strong className="font-bold tabular-nums text-ink">{totalTokens.toLocaleString()}</strong>{" "}
          토큰(추정)
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {chunks.map((chunk, i) => (
          <div key={i} className={`rounded-lg border-l-4 ${CHUNK_COLORS[i % CHUNK_COLORS.length]} border border-line bg-panel p-4`}>
            <p className="text-xs font-bold text-muted">
              청크 {i + 1} · {chunk.text.length}자
              {chunk.overlapWithPrev > 0 ? ` · 앞 청크와 ${chunk.overlapWithPrev}자 겹침` : ""}
            </p>
            <p className="mt-2 text-sm leading-7 text-body">
              {chunk.overlapWithPrev > 0 ? (
                <>
                  <mark className="rounded bg-accentDeep/30 px-0.5 text-body">
                    {chunk.text.slice(0, chunk.overlapWithPrev)}
                  </mark>
                  {chunk.text.slice(chunk.overlapWithPrev)}
                </>
              ) : (
                chunk.text
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
