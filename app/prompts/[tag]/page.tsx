import Link from "next/link";
import { notFound } from "next/navigation";
import { AiDisclosure } from "@/components/AiDisclosure";
import { Mdx } from "@/components/Mdx";
import { OpenInButtons } from "@/components/OpenInButtons";
import { PromptCopyButton } from "@/components/PromptCopyButton";
import { Prose } from "@/components/Prose";
import { RelatedContent } from "@/components/RelatedContent";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getAll, getBySlug } from "@/lib/content";
import { promptHubOf } from "@/lib/meta";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getTopicDescription, getTopicName } from "@/lib/topics";
import type { GuideMeta, PromptMeta } from "@/lib/types";

export const dynamic = "force-static";
export const dynamicParams = false;

// 프롬프트 허브. 개별 프롬프트 URL(2026-08-09 폐지)을 대체한다 — 왜 묶었는지는 lib/meta.ts 주석 참조.
//
// ⚠️ 이 동적 세그먼트는 `/prompts/builder`·`/prompts/chains/...` 와 같은 자리에 있다.
//    Next 는 정적 세그먼트를 동적보다 먼저 매칭하므로 충돌하지 않지만,
//    generateStaticParams 가 'builder'·'chains' 를 뱉지 않도록 **태그에서만** 파생시킨다.

function promptsByHub() {
  const grouped = new Map<string, PromptMeta[]>();
  for (const meta of getAll("prompts") as PromptMeta[]) {
    const hub = promptHubOf(meta.tags);
    grouped.set(hub, [...(grouped.get(hub) ?? []), meta]);
  }
  return grouped;
}

export function generateStaticParams() {
  return [...promptsByHub().keys()].map((tag) => ({ tag }));
}

export function generateMetadata({ params }: { params: { tag: string } }) {
  const items = promptsByHub().get(params.tag);
  if (!items) {
    return {};
  }

  const name = getTopicName(params.tag);
  return buildMetadata({
    title: `${name} — 복사해 쓰는 프롬프트 ${items.length}개`,
    description: `${getTopicDescription(params.tag) ?? name}. 변수 자리만 채우면 바로 쓸 수 있게 정리했고, 각 프롬프트마다 언제 쓰는지와 주의점을 함께 적었습니다.`,
    pathname: `/prompts/${params.tag}`
  });
}

export default function PromptHubPage({ params }: { params: { tag: string } }) {
  const grouped = promptsByHub();
  const items = grouped.get(params.tag);

  if (!items) {
    notFound();
  }

  const name = getTopicName(params.tag);
  const others = [...grouped.entries()].filter(([tag]) => tag !== params.tag);
  const relatedGuides = (getAll("guides") as GuideMeta[]).filter((meta) => meta.tags.includes(params.tag));

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "홈", pathname: "/" },
    { name: "프롬프트", pathname: "/prompts" },
    { name, pathname: `/prompts/${params.tag}` }
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">프롬프트</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{name}</h1>
        <p className="mt-4 leading-8 text-muted">
          {getTopicDescription(params.tag) ?? name}. 아래 {items.length}개를 한 화면에 모았습니다. 변수 자리(
          <code className="rounded bg-panel px-1.5 py-0.5 text-sm">{"{like_this}"}</code>)만 채우면 바로 쓸 수 있고,
          각각 언제 쓰는지와 주의점을 함께 적었습니다.
        </p>
      </div>

      {/* 목차 — 프롬프트가 많은 허브에서 원하는 것으로 바로 뛰게 한다 */}
      <nav aria-label="이 페이지의 프롬프트" className="mt-8 max-w-3xl rounded-lg border border-line bg-panel p-5">
        <p className="text-sm font-semibold text-ink">이 페이지에 있는 프롬프트</p>
        <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {items.map((meta) => (
            <li key={meta.slug}>
              <Link href={`#${meta.slug}`} className="text-sm text-muted transition hover:text-accent">
                {meta.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12 space-y-16">
        {items.map((meta) => {
          const record = getBySlug("prompts", meta.slug);
          return (
            // scroll-mt: 앵커로 뛰었을 때 제목이 상단에 붙어 잘리지 않게 여백을 준다
            <article key={meta.slug} id={meta.slug} className="scroll-mt-24 border-t border-line pt-10">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold text-accent">{meta.targetModel}</p>
                <h2 className="mt-2 text-2xl font-bold leading-snug text-ink">{meta.title}</h2>
                <p className="mt-3 leading-8 text-muted">{meta.description}</p>
              </div>
              <section className="mt-6 max-w-3xl rounded-lg border border-line bg-panel p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-ink">복사 대상 프롬프트</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <PromptCopyButton text={meta.promptText} slug={meta.slug} />
                    <OpenInButtons text={meta.promptText} slug={meta.slug} />
                  </div>
                </div>
                {/* pre-wrap: 한 줄 프롬프트가 모바일에서 가로 오버플로를 만들던 것을 줄바꿈으로 해소 */}
                <pre className="whitespace-pre-wrap break-words rounded-md bg-neutral-950 p-4 text-sm leading-7 text-neutral-100">
                  <code>{meta.promptText}</code>
                </pre>
              </section>
              <div className="mt-8 max-w-3xl">
                <Prose>
                  {/* 27편의 소제목이 글자까지 같아 접두어 없이는 h2 id 가 한 페이지에서 겹친다
                      (HTML 무효 + 앵커가 첫 번째로만 간다). 개별 페이지였을 땐 없던 문제다. */}
                  <Mdx source={record.body} idPrefix={meta.slug} />
                </Prose>
              </div>
            </article>
          );
        })}
      </div>

      {/* 같은 태그를 단 가이드. 이 허브가 토픽 페이지를 대체하므로, 토픽 페이지가 보여주던 것을
          여기가 마저 보여줘야 한다 — 안 그러면 그 가이드가 갈 곳을 잃는다.
          실제로 meeting-notes-summary-automation 은 productivity-prompts 단일 태그라
          토픽 페이지가 유일한 묶음 진입로였고, 인바운드 0인 고아이기도 했다. */}
      {relatedGuides.length > 0 && (
        <section className="mt-16 max-w-3xl">
          <h2 className="text-xl font-semibold text-ink">같은 주제의 가이드</h2>
          <p className="mt-2 text-sm text-muted">프롬프트만으로 부족할 때 읽을 것들입니다.</p>
          <ul className="mt-4 space-y-3">
            {relatedGuides.map((guide) => (
              <li key={guide.slug} className="rounded-lg border border-line bg-panel p-4">
                <Link href={`/guides/${guide.slug}`} className="font-semibold text-ink hover:text-accent">
                  {guide.title}
                </Link>
                <p className="mt-1 text-sm leading-6 text-muted">{guide.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold text-ink">다른 묶음</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {others.map(([tag, list]) => (
            <li key={tag}>
              <Link
                href={`/prompts/${tag}`}
                className="block rounded-lg border border-line bg-panel p-4 transition hover:border-accent/60"
              >
                <p className="text-sm font-bold text-ink">{getTopicName(tag)}</p>
                <p className="mt-1 text-xs text-muted">{list.length}개</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AiDisclosure title={name} pathname={`/prompts/${params.tag}`} />
      <RelatedContent type="prompts" slug={items[0].slug} tags={[params.tag]} />
      <section id="subscribe" className="mt-12">
        <SubscribeForm source="prompt" />
      </section>
    </div>
  );
}
