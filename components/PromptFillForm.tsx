"use client";

import { useMemo, useState } from "react";
import { PromptCopyButton } from "@/components/PromptCopyButton";

// variables 프론트매터 배열은 promptText와 불일치하는 파일이 있어 신뢰하지 않는다.
// 플레이스홀더는 항상 promptText에서 직접 추출한다.
const PLACEHOLDER_PATTERN = /\{([a-z_]+)\}/g;

function extractPlaceholders(promptText: string) {
  const seen = new Set<string>();
  const names: string[] = [];

  for (const match of promptText.matchAll(PLACEHOLDER_PATTERN)) {
    if (!seen.has(match[1])) {
      seen.add(match[1]);
      names.push(match[1]);
    }
  }

  return names;
}

export function PromptFillForm({ promptText, slug }: { promptText: string; slug: string }) {
  const names = useMemo(() => extractPlaceholders(promptText), [promptText]);
  const [values, setValues] = useState<Record<string, string>>({});

  const completed = useMemo(
    () =>
      promptText.replace(PLACEHOLDER_PATTERN, (whole, name: string) => {
        const value = (values[name] ?? "").trim();
        return value.length > 0 ? value : whole;
      }),
    [promptText, values]
  );

  if (names.length === 0) {
    return null;
  }

  const filledCount = names.filter((name) => (values[name] ?? "").trim().length > 0).length;

  return (
    <section className="mt-8 max-w-3xl rounded-lg border border-line bg-white p-5">
      <div className="mb-1 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-ink">빈칸 채워서 완성하기</h2>
        <span className="text-xs font-medium text-muted">
          {filledCount}/{names.length} 입력됨
        </span>
      </div>
      <p className="mb-4 text-sm leading-6 text-muted">
        아래 빈칸을 채우면 프롬프트가 자동으로 완성됩니다. 완성된 프롬프트를 복사해 ChatGPT·Claude 등에 붙여넣어
        사용하세요.
      </p>

      <div className="space-y-4">
        {names.map((name) => (
          <div key={name}>
            <label htmlFor={`fill-${name}`} className="mb-1 block text-sm font-semibold text-ink">
              {`{${name}}`}
            </label>
            <textarea
              id={`fill-${name}`}
              rows={name === "document" || name === "code" || name === "raw_transcript" || name === "text" ? 5 : 2}
              value={values[name] ?? ""}
              onChange={(event) => setValues((prev) => ({ ...prev, [name]: event.target.value }))}
              placeholder="값을 입력하세요"
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm leading-6 text-ink outline-none transition placeholder:text-muted focus:border-accent"
            />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-ink">완성된 프롬프트</h3>
        <PromptCopyButton text={completed} slug={slug} event="prompt_fill_copy" />
      </div>
      <pre className="mt-3 max-h-72 overflow-auto rounded-md bg-neutral-950 p-4 text-sm leading-7 text-neutral-100">
        <code>{completed}</code>
      </pre>
    </section>
  );
}
