"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";

const TARGETS = [
  { key: "chatgpt", label: "ChatGPT에서 열기", base: "https://chatgpt.com/", withQuery: (t: string) => `https://chatgpt.com/?q=${encodeURIComponent(t)}` },
  { key: "claude", label: "Claude에서 열기", base: "https://claude.ai/new", withQuery: (t: string) => `https://claude.ai/new?q=${encodeURIComponent(t)}` }
] as const;

// URL 길이 한계를 넘는 프롬프트는 쿼리로 못 싣는다. 복사해 두고 서비스만 연다.
const MAX_QUERY_TEXT = 1800;

export function OpenInButtons({ text, slug }: { text: string; slug: string }) {
  const [notice, setNotice] = useState<string | null>(null);

  async function openIn(target: (typeof TARGETS)[number]) {
    track("prompt_open", { slug, target: target.key });

    if (text.length > MAX_QUERY_TEXT) {
      await navigator.clipboard.writeText(text);
      setNotice("프롬프트가 길어 복사해 두었습니다. 열린 창에 붙여넣어 주세요.");
      window.setTimeout(() => setNotice(null), 4000);
      window.open(target.base, "_blank", "noopener");
      return;
    }

    window.open(target.withQuery(text), "_blank", "noopener");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TARGETS.map((target) => (
          <button
            key={target.key}
            type="button"
            onClick={() => openIn(target)}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            {target.label} ↗
          </button>
        ))}
      </div>
      {notice ? <p className="mt-2 text-xs leading-5 text-accent">{notice}</p> : null}
    </div>
  );
}
