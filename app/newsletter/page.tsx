import { ContentCard } from "@/components/ContentCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getAll } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "뉴스레터",
  description: "AI 흐름과 도구 업데이트를 정리한 뉴스레터 아카이브",
  pathname: "/newsletter"
});

export default function NewsletterPage() {
  const issues = getAll("newsletter");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">뉴스레터</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">발행한 뉴스레터를 웹 아카이브로 보관합니다.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {issues.map((issue) => (
          <ContentCard key={issue.slug} type="newsletter" meta={issue} />
        ))}
      </div>
      <section id="subscribe" className="mt-12">
        <SubscribeForm />
      </section>
    </div>
  );
}
