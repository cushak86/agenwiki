"use client";

import { track } from "@vercel/analytics";
import { useEffect, useMemo, useState } from "react";
import { OpenInButtons } from "@/components/OpenInButtons";
import { PromptCopyButton } from "@/components/PromptCopyButton";
import { AUDIENCES, FORMATS, INGREDIENTS, TASKS, TONES, assemblePrompt } from "@/lib/builder";

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active ? "border-accent bg-accent text-white" : "border-line bg-white text-ink hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </button>
  );
}

function StepHeading({ step, title }: { step: string; title: string }) {
  return (
    <h2 className="text-base font-semibold text-ink">
      <span className="mr-2 text-accent">{step}</span>
      {title}
    </h2>
  );
}

export function PromptBuilder() {
  const [taskKey, setTaskKey] = useState<string | null>(null);
  const [audienceKey, setAudienceKey] = useState<string | null>(null);
  const [toneKey, setToneKey] = useState<string | null>(null);
  const [formatKeys, setFormatKeys] = useState<string[]>([]);
  const [ingredientKeys, setIngredientKeys] = useState<string[]>(["no_hallucination"]);
  const [note, setNote] = useState("");
  const [input, setInput] = useState("");
  const [tracked, setTracked] = useState(false);

  const task = TASKS.find((item) => item.key === taskKey) ?? null;
  const audience = AUDIENCES.find((item) => item.key === audienceKey) ?? null;
  const tone = TONES.find((item) => item.key === toneKey) ?? null;

  const ready = task !== null && audience !== null && tone !== null;

  const completed = useMemo(() => {
    if (!ready || !task || !audience || !tone) {
      return "";
    }

    const prompt = assemblePrompt({
      task,
      audience: audience.label,
      tone: tone.label,
      formats: formatKeys,
      ingredients: ingredientKeys,
      note
    });

    const filled = input.trim();
    return filled.length > 0 ? prompt.replace(`{${task.inputLabel}}`, filled) : prompt;
  }, [ready, task, audience, tone, formatKeys, ingredientKeys, note, input]);

  // 완성 상태 최초 도달 1회만 기록 — 어떤 작업 유형이 실제로 조립되는지가 다음 재료 투자의 근거.
  useEffect(() => {
    if (ready && !tracked) {
      setTracked(true);
      track("builder_ready", { task: taskKey ?? "" });
    }
  }, [ready, tracked, taskKey]);

  function toggle(list: string[], key: string, set: (next: string[]) => void) {
    set(list.includes(key) ? list.filter((item) => item !== key) : [...list, key]);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-line bg-white p-5">
        <StepHeading step="1단계" title="무엇을 하시나요?" />
        <div className="mt-4 flex flex-wrap gap-2">
          {TASKS.map((item) => (
            <Chip key={item.key} active={taskKey === item.key} label={item.label} onClick={() => setTaskKey(item.key)} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5">
        <StepHeading step="2단계" title="누가 읽나요? 어떤 톤으로?" />
        <p className="mt-2 text-sm text-muted">독자</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {AUDIENCES.map((item) => (
            <Chip
              key={item.key}
              active={audienceKey === item.key}
              label={item.label}
              onClick={() => setAudienceKey(item.key)}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">톤</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TONES.map((item) => (
            <Chip key={item.key} active={toneKey === item.key} label={item.label} onClick={() => setToneKey(item.key)} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5">
        <StepHeading step="3단계" title="재료를 담으세요 (선택)" />
        <p className="mt-2 text-sm text-muted">품질 규칙</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {INGREDIENTS.map((item) => (
            <Chip
              key={item.key}
              active={ingredientKeys.includes(item.key)}
              label={item.label}
              onClick={() => toggle(ingredientKeys, item.key, setIngredientKeys)}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">출력 형식</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {FORMATS.map((item) => (
            <Chip
              key={item.key}
              active={formatKeys.includes(item.key)}
              label={item.label}
              onClick={() => toggle(formatKeys, item.key, setFormatKeys)}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">추가 요청 (자유 입력)</p>
        <textarea
          rows={2}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="예: 300자 이내로, 존댓말로, 영어 병기"
          className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm leading-6 text-ink outline-none transition placeholder:text-muted focus:border-accent"
        />
      </section>

      <section className="rounded-lg border border-line bg-white p-5">
        <StepHeading step="4단계" title={task ? `${task.inputLabel} 붙여넣기 (선택)` : "내용 붙여넣기 (선택)"} />
        <p className="mt-2 text-sm leading-6 text-muted">
          여기 붙여넣으면 완성 프롬프트에 바로 들어갑니다. 비워 두면{" "}
          <code className="rounded bg-neutral-100 px-1">{task ? `{${task.inputLabel}}` : "{자리}"}</code> 자리로 남아,
          챗봇에서 직접 채울 수 있습니다.
        </p>
        <textarea
          rows={5}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={task?.inputPlaceholder ?? "먼저 1단계에서 작업을 선택하세요"}
          className="mt-3 w-full rounded-md border border-line bg-white px-3 py-2 text-sm leading-6 text-ink outline-none transition placeholder:text-muted focus:border-accent"
        />
      </section>

      <section className="rounded-lg border border-accent bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">완성된 프롬프트</h2>
          {ready ? (
            <div className="flex flex-wrap items-center gap-2">
              <PromptCopyButton text={completed} slug="builder" event="builder_copy" />
              <OpenInButtons text={completed} slug="builder" />
            </div>
          ) : null}
        </div>
        {ready ? (
          <pre className="mt-4 max-h-80 overflow-auto rounded-md bg-neutral-950 p-4 text-sm leading-7 text-neutral-100">
            <code>{completed}</code>
          </pre>
        ) : (
          <p className="mt-3 text-sm leading-6 text-muted">1단계(작업)와 2단계(독자·톤)를 선택하면 여기에 프롬프트가 조립됩니다.</p>
        )}
      </section>
    </div>
  );
}
