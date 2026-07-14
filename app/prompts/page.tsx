import Link from "next/link";
import { ContentCard } from "@/components/ContentCard";
import { CHAINS } from "@/lib/chains";
import { getAll } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "프롬프트",
  description: "복사해 바로 쓸 수 있는 AI 프롬프트 라이브러리",
  pathname: "/prompts"
});

export default function PromptsPage() {
  const prompts = getAll("prompts");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">프롬프트</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">모델과 목적에 맞춰 재사용할 수 있는 프롬프트를 모읍니다.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/prompts/builder"
          className="rounded-lg border border-accent bg-white p-6 shadow-sm transition hover:shadow-md"
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
            className="rounded-lg border border-accent bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-semibold text-accent">⛓ 프롬프트 체인</p>
            <h2 className="mt-2 text-xl font-bold text-ink">{chain.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{chain.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold text-ink">프롬프트 라이브러리</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {prompts.map((prompt) => (
          <ContentCard key={prompt.slug} type="prompts" meta={prompt} />
        ))}
      </div>
    </div>
  );
}
