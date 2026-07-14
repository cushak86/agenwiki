import { PromptBuilder } from "@/components/PromptBuilder";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "프롬프트 만들기 — 클릭 몇 번으로 완성",
  description:
    "작업 유형·독자·톤을 고르고 품질 규칙을 담으면 ChatGPT·Claude에 바로 쓸 수 있는 프롬프트가 완성됩니다. 회원가입 없이 무료.",
  pathname: "/prompts/builder"
});

export default function PromptBuilderPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">프롬프트 빌더</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">클릭 몇 번으로 프롬프트 완성</h1>
        <p className="mt-4 leading-8 text-muted">
          무엇을 할지 고르고, 누가 읽을지 정하고, 품질 규칙을 담으세요. 복사해서 ChatGPT·Claude 등 쓰시는 챗봇에
          붙여넣으면 됩니다. 로그인도 비용도 없습니다.
        </p>
      </div>
      <div className="mt-10 max-w-3xl">
        <PromptBuilder />
      </div>
    </div>
  );
}
