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
    <article className="flex min-h-56 flex-col justify-between rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted">
          <span>{typeLabels[type]}</span>
          {date ? <time dateTime={date}>{date}</time> : null}
        </div>
        <h3 className="text-lg font-semibold leading-snug text-ink">
          <Link href={`/${type}/${meta.slug}`} className="hover:text-accent">
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
