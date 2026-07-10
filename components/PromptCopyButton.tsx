"use client";

import { useState } from "react";

export function PromptCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyPrompt}
      className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
    >
      {copied ? "복사됨" : "프롬프트 복사"}
    </button>
  );
}
