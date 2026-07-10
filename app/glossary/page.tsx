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
    </div>
  );
}
