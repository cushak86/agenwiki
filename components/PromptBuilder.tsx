"use client";

import { track } from "@vercel/analytics";
import { useEffect, useMemo, useState } from "react";
import { OpenInButtons } from "@/components/OpenInButtons";
import { PromptCopyButton } from "@/components/PromptCopyButton";
import { AUDIENCES, FORMATS, INGREDIENTS, TASKS, TONES, assemblePrompt } from "@/lib/builder";
import { decodeRecipe, encodeRecipe, loadSavedRecipes, persistSavedRecipes, type SavedRecipe } from "@/lib/recipe";

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
  const [saved, setSaved] = useState<SavedRecipe[]>([]);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  function applyRecipe(encoded: string) {
    const recipe = decodeRecipe(encoded);

    if (!recipe) {
      return false;
    }

    // 알 수 없는 키(구버전 링크 등)는 조용히 버린다 — 깨진 상태로 조립되는 것보다 낫다.
    setTaskKey(TASKS.some((item) => item.key === recipe.taskKey) ? recipe.taskKey : null);
    setAudienceKey(AUDIENCES.some((item) => item.key === recipe.audienceKey) ? recipe.audienceKey : null);
    setToneKey(TONES.some((item) => item.key === recipe.toneKey) ? recipe.toneKey : null);
    setFormatKeys(recipe.formatKeys.filter((key) => FORMATS.some((item) => item.key === key)));
    setIngredientKeys(recipe.ingredientKeys.filter((key) => INGREDIENTS.some((item) => item.key === key)));
    setNote(recipe.note);
    return true;
  }

  // 공유 링크(?r=)로 진입하면 레시피를 복원한다. localStorage 보관함도 마운트 후에만 읽는다.
  useEffect(() => {
    const encoded = new URLSearchParams(window.location.search).get("r");
    if (encoded && applyRecipe(encoded)) {
      track("recipe_open", {});
    }
    setSaved(loadSavedRecipes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function currentEncoded() {
    return encodeRecipe({ taskKey, audienceKey, toneKey, formatKeys, ingredientKeys, note });
  }

  async function copyShareLink() {
    const url = `${window.location.origin}/prompts/builder?r=${currentEncoded()}`;
    await navigator.clipboard.writeText(url);
    track("recipe_share", { task: taskKey ?? "" });
    setShareNotice("공유 링크를 복사했습니다. 붙여넣으면 이 레시피가 채워진 채 열립니다.");
    window.setTimeout(() => setShareNotice(null), 4000);
  }

  function saveRecipe() {
    const taskLabel = task?.label ?? "레시피";
    const name = window.prompt("레시피 이름을 지어주세요", `${taskLabel} 레시피`);

    if (!name) {
      return;
    }

    const next = [...saved.filter((item) => item.name !== name), { name, encoded: currentEncoded(), savedAt: Date.now() }];
    setSaved(next);
    persistSavedRecipes(next);
    track("recipe_save", { task: taskKey ?? "" });
  }

  function removeRecipe(name: string) {
    const next = saved.filter((item) => item.name !== name);
    setSaved(next);
    persistSavedRecipes(next);
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
        {ready ? (
          <div className="mt-4 border-t border-line pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
              >
                🔗 레시피 링크 복사
              </button>
              <button
                type="button"
                onClick={saveRecipe}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
              >
                💾 내 레시피에 저장
              </button>
            </div>
            {shareNotice ? <p className="mt-2 text-xs leading-5 text-accent">{shareNotice}</p> : null}
            <p className="mt-2 text-xs leading-5 text-muted">
              링크에는 선택한 조합만 담기고 4단계에 붙여넣은 내용은 담기지 않습니다. 저장은 이 브라우저에만 보관됩니다.
            </p>
          </div>
        ) : null}
      </section>

      {saved.length > 0 ? (
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-base font-semibold text-ink">내 레시피</h2>
          <ul className="mt-3 space-y-2">
            {saved.map((item) => (
              <li key={item.name} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line px-3 py-2">
                <span className="text-sm font-medium text-ink">{item.name}</span>
                <span className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => applyRecipe(item.encoded)}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    불러오기
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRecipe(item.name)}
                    className="text-sm text-muted hover:text-ink"
                  >
                    삭제
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
