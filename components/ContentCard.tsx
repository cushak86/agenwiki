import Link from "next/link";
import { getContentDescription, getContentTitle } from "@/lib/content";
import type { ContentMeta, ContentType } from "@/lib/types";
import { TagChips } from "@/components/TagChips";

const typeLabels: Record<ContentType, string> = {
  guides: "가이드",
  glossary: "용어",
  prompts: "프롬프트",
  newsletter: "뉴스레터"
};

function getDate(meta: ContentMeta) {
  if ("publishedAt" in meta) {
    return meta.publishedAt;
  }

  return "updatedAt" in meta ? meta.updatedAt : undefined;
}

export function ContentCard({ type, meta }: { type: ContentType; meta: ContentMeta }) {
  const title = getContentTitle(meta);
  const description = getContentDescription(meta);
  const date = getDate(meta);

  return (
    <article className="group flex min-h-56 flex-col justify-between rounded-xl border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:border-accent/60">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs font-bold">
          <span className="uppercase tracking-widest text-accentSoft">{typeLabels[type]}</span>
          {date ? (
            <time dateTime={date} className="font-medium tabular-nums text-muted">
              {date}
            </time>
          ) : null}
        </div>
        <h3 className="text-lg font-bold leading-snug text-ink">
          <Link href={`/${type}/${meta.slug}`} className="transition group-hover:text-accentSoft">
            {title}
          </Link>
        </h3>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="mt-5">
        <TagChips tags={meta.tags} />
      </div>
    </article>
  );
}
