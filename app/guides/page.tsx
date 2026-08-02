import { FilteredCardList } from "@/components/FilteredCardList";
import { getAll } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "가이드",
  description: "AI 도구와 에이전트 워크플로우를 다루는 실전 가이드",
  pathname: "/guides"
});

export default function GuidesPage() {
  const guides = getAll("guides");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">가이드</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">
        AI 에이전트, 도구, 자동화 워크플로우를 실전 중심으로 정리합니다. 난이도 탭과 태그로 원하는
        글만 좁혀 볼 수 있습니다.
      </p>
      <div className="mt-8">
        <FilteredCardList entries={guides.map((meta) => ({ type: "guides" as const, meta }))} withDifficultyTabs />
      </div>
    </div>
  );
}
