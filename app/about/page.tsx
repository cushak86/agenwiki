import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "소개",
  description: "agenwiki 소개",
  pathname: "/about"
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">소개</h1>
      <p className="mt-4 leading-8 text-muted">
        agenwiki는 AI 전반 지식, 에이전트 워크플로우, 프롬프트, 뉴스레터를 정리하는 한국어 지식백과입니다.
      </p>
    </div>
  );
}
