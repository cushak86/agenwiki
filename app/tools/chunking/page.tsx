import Link from "next/link";
import { ChunkingSimulator } from "@/components/ChunkingSimulator";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "RAG 청킹 시뮬레이터",
  description:
    "텍스트를 붙여넣고 청크 크기·오버랩·분할 전략을 바꿔 보며 RAG 문서 분할이 어떻게 동작하는지 눈으로 확인합니다.",
  pathname: "/tools/chunking"
});

export default function ChunkingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-semibold text-accent">도구</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">RAG 청킹 시뮬레이터</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">
        문서를 붙여넣고 청크 크기·오버랩·분할 전략을 조절하면 문서가 실제로 어떻게 잘리는지 바로
        보입니다. 겹치는 구간은 하이라이트로 표시됩니다. 텍스트는 서버로 전송되지 않습니다.
      </p>

      <div className="mt-8">
        <ChunkingSimulator />
      </div>

      <section className="mt-12 max-w-2xl rounded-lg border border-line bg-panel p-5">
        <h2 className="text-lg font-semibold text-ink">개념이 낯설다면</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/glossary/chunking" className="text-muted transition hover:text-accent">
              청킹이란? — 왜 문서를 나누는가
            </Link>
          </li>
          <li>
            <Link href="/glossary/reranking" className="text-muted transition hover:text-accent">
              리랭킹이란? — 검색된 청크의 순서를 다시 매기는 이유
            </Link>
          </li>
          <li>
            <Link href="/guides/what-is-rag" className="text-muted transition hover:text-accent">
              RAG란 무엇인가 — 전체 파이프라인 이해하기
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
