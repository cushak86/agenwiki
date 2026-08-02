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
          href="/tools/llm-cost"
          className="rounded-lg border border-accent bg-panel p-6 transition hover:border-accentSoft"
        >
          <p className="text-sm font-semibold text-accent">💰 LLM API 요금 계산기</p>
          <h2 className="mt-2 text-xl font-bold text-ink">내 사용량이면 한 달에 얼마?</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            월 요청 수와 토큰만 넣으면 GPT·Claude·Gemini 등 주요 모델 월 비용을 원화로 비교합니다.
          </p>
        </Link>
        <Link
          href="/tools/model-compare"
          className="rounded-lg border border-accent bg-panel p-6 transition hover:border-accentSoft"
        >
          <p className="text-sm font-semibold text-accent">📊 모델 스펙 비교표</p>
          <h2 className="mt-2 text-xl font-bold text-ink">단가·컨텍스트 정렬 비교</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            주요 모델의 API 단가와 컨텍스트 윈도우를 열 클릭으로 정렬해 비교합니다.
          </p>
        </Link>
        <Link
          href="/tools/model-picker"
          className="rounded-lg border border-accent bg-panel p-6 transition hover:border-accentSoft"
        >
          <p className="text-sm font-semibold text-accent">🧭 모델 선택 위저드</p>
          <h2 className="mt-2 text-xl font-bold text-ink">질문 3개로 모델 후보 좁히기</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            용도·예산·분량을 고르면 조건에 맞는 후보 3개를 근거와 함께 추천합니다.
          </p>
        </Link>
        <Link
          href="/tools/chunking"
          className="rounded-lg border border-accent bg-panel p-6 transition hover:border-accentSoft"
        >
          <p className="text-sm font-semibold text-accent">✂️ RAG 청킹 시뮬레이터</p>
          <h2 className="mt-2 text-xl font-bold text-ink">문서가 어떻게 잘리는지 눈으로 확인</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            텍스트를 붙여넣고 청크 크기·오버랩·전략을 바꿔 보며 RAG 분할 동작을 실험합니다.
          </p>
        </Link>
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
