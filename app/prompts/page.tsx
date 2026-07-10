import { ContentCard } from "@/components/ContentCard";
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
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {prompts.map((prompt) => (
          <ContentCard key={prompt.slug} type="prompts" meta={prompt} />
        ))}
      </div>
    </div>
  );
}
