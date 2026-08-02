import Link from "next/link";
import { getContentDescription, getContentTitle } from "@/lib/meta";
import type { ContentMeta, ContentType } from "@/lib/types";
import { PromptCopyButton } from "@/components/PromptCopyButton";
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

export function ContentCard({
  type,
  meta,
  onTagClick
}: {
  type: ContentType;
  meta: ContentMeta;
  onTagClick?: (tag: string) => void;
}) {
  const title = getContentTitle(meta);
  const description = getContentDescription(meta);
  const date = getDate(meta);
  // 가이드는 난이도(입문/실전/비교/AI 연구)를 목록에서도 보여준다 — 입문자와 실무자의 첫 클릭 오류를 줄인다.
  const badge = type === "guides" && "category" in meta ? meta.category : undefined;

  return (
    <article className="group relative flex min-h-56 flex-col justify-between rounded-xl border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:border-accent/60">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs font-bold">
          <span className="flex items-center gap-2">
            <span className="uppercase tracking-widest text-accentSoft">{typeLabels[type]}</span>
            {badge ? (
              <span className="rounded-full border border-accent/40 px-2 py-0.5 text-[11px] font-bold text-accentSoft">
                {badge}
              </span>
            ) : null}
          </span>
          {date ? (
            <time dateTime={date} className="font-medium tabular-nums text-muted">
              {date}
            </time>
          ) : null}
        </div>
        <h3 className="text-lg font-bold leading-snug text-ink">
          {/* after 오버레이로 카드 전체를 클릭 타깃으로 만든다 — 태그는 z-10 으로 위에 띄워 따로 클릭된다 */}
          <Link
            href={`/${type}/${meta.slug}`}
            className="transition after:absolute after:inset-0 group-hover:text-accentSoft"
          >
            {title}
          </Link>
        </h3>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="relative z-10 mt-5 space-y-3">
        <TagChips tags={meta.tags} onTagClick={onTagClick} />
        {"promptText" in meta ? (
          // 프롬프트 카드는 상세 진입 없이 목록에서 바로 복사할 수 있게 한다 (개선안 2-5 잔여 항목)
          <PromptCopyButton text={meta.promptText} slug={meta.slug} event="prompt_copy_list" />
        ) : null}
      </div>
    </article>
  );
}
