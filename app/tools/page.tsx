import Link from "next/link";
import { CHAINS } from "@/lib/chains";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "도구",
  description: "프롬프트 빌더, 프롬프트 체인, CLAUDE.md 생성기 — 로그인 없이 쓰는 인터랙티브 도구",
  pathname: "/tools"
});

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">도구</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">
        읽는 데서 끝나지 않도록, 직접 만들어 볼 수 있는 도구를 모았습니다. 전부 로그인 없이 브라우저에서
        바로 동작합니다.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/prompts/builder"
          className="rounded-lg border border-accent bg-panel p-6 transition hover:border-accentSoft"
        >
          <p className="text-sm font-semibold text-accent">🧪 프롬프트 빌더</p>
          <h2 className="mt-2 text-xl font-bold text-ink">클릭 몇 번으로 프롬프트 완성</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            작업·독자·톤을 고르고 품질 규칙을 담으면 바로 쓸 수 있는 프롬프트가 조립됩니다.
          </p>
        </Link>
        {CHAINS.map((chain) => (
          <Link
            key={chain.slug}
            href={`/prompts/chains/${chain.slug}`}
            className="rounded-lg border border-accent bg-panel p-6 transition hover:border-accentSoft"
          >
            <p className="text-sm font-semibold text-accent">⛓ 프롬프트 체인</p>
            <h2 className="mt-2 text-xl font-bold text-ink">{chain.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{chain.description}</p>
          </Link>
        ))}
        <Link
          href="/tools/claude-md"
          className="rounded-lg border border-accent bg-panel p-6 transition hover:border-accentSoft"
        >
          <p className="text-sm font-semibold text-accent">🤖 CLAUDE.md 생성기</p>
          <h2 className="mt-2 text-xl font-bold text-ink">AI 코딩 도구 설정 파일 만들기</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            CLAUDE.md·AGENTS.md·.cursor/rules 설정 파일을 클릭으로 만듭니다.
          </p>
        </Link>
      </div>

      <section className="mt-12 rounded-lg border border-line bg-panel p-5">
        <h2 className="text-lg font-semibold text-ink">함께 보면 좋은 가이드</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/guides/how-to-write-claude-md" className="text-muted transition hover:text-accent">
              CLAUDE.md 작성법 → CLAUDE.md 생성기와 함께
            </Link>
          </li>
          <li>
            <Link href="/guides/prompt-engineering-how-to" className="text-muted transition hover:text-accent">
              프롬프트 엔지니어링 하는 법 → 프롬프트 빌더와 함께
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
