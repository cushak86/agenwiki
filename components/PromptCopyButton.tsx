"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";

export function PromptCopyButton({
  text,
  slug,
  event = "prompt_copy"
}: {
  text: string;
  slug?: string;
  event?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    if (slug) {
      track(event, { slug });
    }
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyPrompt}
      className="inline-flex min-h-[44px] items-center rounded-md border border-line bg-panel px-4 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
    >
      {copied ? "복사됨" : "프롬프트 복사"}
    </button>
  );
}
