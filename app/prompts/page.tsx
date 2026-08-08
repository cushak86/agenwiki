import Link from "next/link";
import { FilteredCardList } from "@/components/FilteredCardList";
import { CHAINS } from "@/lib/chains";
import { getAll } from "@/lib/content";
import { promptHubOf } from "@/lib/meta";
import { buildMetadata } from "@/lib/seo";
import { getTopicDescription, getTopicName } from "@/lib/topics";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "프롬프트",
  description: "복사해 바로 쓸 수 있는 AI 프롬프트 라이브러리",
  pathname: "/prompts"
});

export default function PromptsPage() {
  const prompts = getAll("prompts");

  // 허브 목록은 프롬프트의 태그에서 파생시킨다 — 손으로 적은 두 번째 목록을 만들지 않는다.
  const grouped = new Map<string, typeof prompts>();
  for (const meta of prompts) {
    const hub = promptHubOf(meta.tags);
    grouped.set(hub, [...(grouped.get(hub) ?? []), meta]);
  }
  const hubs = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">프롬프트</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">모델과 목적에 맞춰 재사용할 수 있는 프롬프트를 모읍니다.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/prompts/builder"
          className="rounded-lg border border-accent bg-panel p-6 transition hover:border-accent"
        >
          <p className="text-sm font-semibold text-accent">🧪 프롬프트 빌더</p>
          <h2 className="mt-2 text-xl font-bold text-ink">클릭 몇 번으로 프롬프트 완성</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            작업·독자·톤을 고르고 품질 규칙을 담으면 바로 쓸 수 있는 프롬프트가 조립됩니다. 로그인 없음.
          </p>
        </Link>
        {CHAINS.map((chain) => (
          <Link
            key={chain.slug}
            href={`/prompts/chains/${chain.slug}`}
            className="rounded-lg border border-accent bg-panel p-6 transition hover:border-accent"
          >
            <p className="text-sm font-semibold text-accent">⛓ 프롬프트 체인</p>
            <h2 className="mt-2 text-xl font-bold text-ink">{chain.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{chain.description}</p>
          </Link>
        ))}
        <Link
          href="/tools/claude-md"
          className="rounded-lg border border-accent bg-panel p-6 transition hover:border-accent"
        >
          <p className="text-sm font-semibold text-accent">🤖 도구</p>
          <h2 className="mt-2 text-xl font-bold text-ink">CLAUDE.md 생성기</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            AI 코딩 도구용 설정 파일(CLAUDE.md·AGENTS.md·.cursor/rules)을 클릭으로 만듭니다.
          </p>
        </Link>
      </div>

      {/* 허브로 가는 직접 경로. 아래 카드 목록도 같은 곳(허브 앵커)으로 가지만, 그건 클라이언트
          필터 UI 라 크롤러가 링크를 다 보지 못한다 — 색인되는 페이지는 허브 7개이므로
          서버 렌더되는 링크를 따로 둔다. */}
      <h2 className="mt-12 text-xl font-bold text-ink">묶음별로 보기</h2>
      <p className="mt-2 text-sm text-muted">
        프롬프트는 개별 페이지 대신 묶음 한 화면에 모아 두었습니다. 한 페이지에서 비교하고 바로 복사하세요.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map(([tag, items]) => (
          <Link
            key={tag}
            href={`/prompts/${tag}`}
            className="rounded-lg border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:border-accent/60"
          >
            <h3 className="text-base font-bold text-ink">{getTopicName(tag)}</h3>
            <p className="mt-1 text-xs font-medium text-accent">프롬프트 {items.length}개</p>
            <p className="mt-2 text-sm leading-6 text-muted">{getTopicDescription(tag) ?? ""}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold text-ink">전체 목록에서 찾기</h2>
      <div className="mt-6">
        <FilteredCardList entries={prompts.map((meta) => ({ type: "prompts" as const, meta }))} />
      </div>
    </div>
  );
}
