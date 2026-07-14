"use client";

import { useState } from "react";
import { OpenInButtons } from "@/components/OpenInButtons";
import { PromptCopyButton } from "@/components/PromptCopyButton";
import type { ChainStep } from "@/lib/chains";

export function PromptChainSteps({ slug, steps }: { slug: string; steps: ChainStep[] }) {
  const [done, setDone] = useState<boolean[]>(() => steps.map(() => false));

  function toggle(index: number) {
    setDone((prev) => prev.map((value, i) => (i === index ? !value : value)));
  }

  const doneCount = done.filter(Boolean).length;

  return (
    <div>
      <p className="text-sm font-medium text-muted">
        진행 {doneCount}/{steps.length} 단계
      </p>
      <ol className="mt-4 space-y-6">
        {steps.map((step, index) => (
          <li key={step.title} className={`rounded-lg border bg-white p-5 ${done[index] ? "border-accent" : "border-line"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  <span className="mr-2 text-accent">{index + 1}단계</span>
                  {step.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">{step.goal}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(index)}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  done[index]
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-white text-ink hover:border-accent hover:text-accent"
                }`}
              >
                {done[index] ? "완료 ✓" : "완료 표시"}
              </button>
            </div>
            <pre className="mt-4 max-h-56 overflow-auto rounded-md bg-neutral-950 p-4 text-sm leading-7 text-neutral-100">
              <code>{step.promptText}</code>
            </pre>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <PromptCopyButton text={step.promptText} slug={`${slug}#${index + 1}`} event="chain_step_copy" />
              <OpenInButtons text={step.promptText} slug={`${slug}#${index + 1}`} />
            </div>
            {step.tip ? <p className="mt-3 text-sm leading-6 text-muted">💡 {step.tip}</p> : null}
            {index < steps.length - 1 ? (
              <p className="mt-3 text-xs leading-5 text-muted">
                ↓ 이 단계의 결과를 복사해 다음 단계 프롬프트의{" "}
                <code className="rounded bg-neutral-100 px-1">{`{step${index + 1}_result}`}</code> 자리에 붙여넣으세요.
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
