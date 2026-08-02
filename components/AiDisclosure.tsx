import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

// AI 생성 고지: 모든 글 하단(본문과 관련 글 사이)에 들어간다 — guides·glossary·prompts·newsletter 전 타입.
//
// 문구를 고칠 때 지켜야 할 선: 여기 적은 것은 전 타입 59건 **전부**에서 참이어야 한다.
// "형식 검사"라고 좁게 쓴 이유가 이것이다 — lib/content.ts의 validateMeta가 전 타입 프론트매터를 검사해
// 규격에 어긋나면 빌드를 막으므로 59건 전부에서 참이다.
// 다음으로 넓히지 마라. 넓히는 순간 고지가 거짓이 된다:
//   - "사람이 검수" → 발행 전 글을 건별로 읽는 단계가 이 저장소에 없다.
//   - "출처 검증"   → publish.py:310이 `if args.type == "guides"`로 guides에만 검사를 건다.
//                     출처 블록 보유는 guides 12/28 · glossary 0/19 · prompts 0/8 · newsletter 0/4 (12/59).
const DISCLOSURE_LABEL = "이 글의 제작 방식";

const DISCLOSURE_BODY =
  "이 글은 AI가 초안을 쓰고, 형식 검사를 통과하면 발행됩니다. 사실관계를 사람이 건별로 확인하지는 않습니다. 사실과 다른 내용을 발견하시면 cushak@icloud.com으로 알려 주시면 고치겠습니다.";

const DISCLOSURE_LINK_LABEL = "제작 과정 자세히 보기";

const REPORT_EMAIL = "cushak@icloud.com";

/**
 * 오류를 발견한 그 자리(개별 문서)에서 바로 제보할 수 있게 문서 제목·URL을 프리필한 mailto 링크를 만든다.
 * 독자 제보가 사실상 유일한 교정 경로라서(/about), 진입 마찰을 최대한 줄이는 것이 목적.
 */
function reportHref(title?: string, pathname?: string) {
  if (!title || !pathname) {
    return `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent("[오류 제보] agenwiki")}`;
  }

  const subject = encodeURIComponent(`[오류 제보] ${title}`);
  const body = encodeURIComponent(`문서: ${absoluteUrl(pathname)}\n\n틀린 부분:\n`);
  return `mailto:${REPORT_EMAIL}?subject=${subject}&body=${body}`;
}

/**
 * 글 하단 AI 생성 고지 배너 + 오류 제보 버튼.
 * 본문 흐름을 끊지 않도록 Prose 바깥, RelatedContent 앞에 둔다.
 * title/pathname을 주면 제보 메일에 문서 정보가 프리필된다.
 */
export function AiDisclosure({ title, pathname }: { title?: string; pathname?: string } = {}) {
  return (
    <aside className="mt-10 max-w-3xl rounded-lg border border-line bg-panel p-5">
      <p className="text-sm font-semibold text-accent">{DISCLOSURE_LABEL}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{DISCLOSURE_BODY}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a
          href={reportHref(title, pathname)}
          className="inline-flex min-h-[44px] items-center rounded-md border border-line bg-panel2 px-4 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
        >
          이 문서에서 틀린 부분을 봤나요? 알려주기
        </a>
        <Link href="/about" className="text-sm font-medium text-ink hover:text-accent">
          {DISCLOSURE_LINK_LABEL} →
        </Link>
      </div>
    </aside>
  );
}
