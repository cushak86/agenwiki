import Link from "next/link";
import { topicHref } from "@/lib/meta";

const chipClass =
  "rounded-full border border-line bg-panel px-3 py-1 text-xs font-medium text-muted transition hover:border-accent hover:text-accent";

/**
 * 태그 칩 목록.
 * 기본은 토픽 페이지로 이동하는 링크. onTagClick 이 주어지면(목록 페이지의 필터 모드)
 * 페이지 이동 대신 콜백을 호출하는 버튼이 된다 — "태그로 연결한"이 목록 안에서 작동하게.
 */
export function TagChips({ tags, onTagClick }: { tags: string[]; onTagClick?: (tag: string) => void }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) =>
        onTagClick ? (
          <button key={tag} type="button" onClick={() => onTagClick(tag)} className={chipClass}>
            #{tag}
          </button>
        ) : (
          // 경로를 조립하지 마라 — `*-prompts` 태그는 토픽이 아니라 허브로 간다(lib/meta.ts).
          <Link key={tag} href={topicHref(tag)} className={chipClass}>
            #{tag}
          </Link>
        )
      )}
    </div>
  );
}
