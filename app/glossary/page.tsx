import { GlossaryIndex } from "@/components/GlossaryIndex";
import { getAll } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { GlossaryMeta } from "@/lib/types";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "용어사전",
  description: "AI와 에이전트 개념을 빠르게 확인하는 용어사전",
  pathname: "/glossary"
});

export default function GlossaryPage() {
  const terms = getAll("glossary") as GlossaryMeta[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">용어사전</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">AI 실무자가 자주 마주치는 개념을 짧고 명확하게 정리합니다.</p>
      <div className="mt-8">
        <GlossaryIndex items={terms} />
      </div>

      <section className="mt-12 rounded-lg border border-line bg-panel p-5">
        <h2 className="text-lg font-semibold text-ink">찾는 용어가 없나요?</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          다뤄 줬으면 하는 용어를 알려 주세요. 신청이 곧 다음 용어의 우선순위가 됩니다.
        </p>
        <a
          href={`mailto:cushak@icloud.com?subject=${encodeURIComponent("[용어 신청] ")}&body=${encodeURIComponent(
            "다뤄 줬으면 하는 용어:\n\n어떤 맥락에서 마주쳤나요? (선택):\n"
          )}`}
          className="mt-3 inline-flex min-h-[44px] items-center rounded-md border border-line bg-panel2 px-4 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
        >
          이 용어를 다뤄 주세요 →
        </a>
      </section>
    </div>
  );
}
