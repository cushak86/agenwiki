import Link from "next/link";

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

/**
 * 글 하단 AI 생성 고지 배너.
 * 본문 흐름을 끊지 않도록 Prose 바깥, RelatedContent 앞에 둔다.
 * 콘텐츠 타입과 무관하게 동일한 문구를 쓰므로 props를 받지 않는다.
 */
export function AiDisclosure() {
  return (
    <aside className="mt-10 max-w-3xl rounded-lg border border-line bg-white p-5">
      <p className="text-sm font-semibold text-accent">{DISCLOSURE_LABEL}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{DISCLOSURE_BODY}</p>
      <Link href="/about" className="mt-3 inline-block text-sm font-medium text-ink hover:text-accent">
        {DISCLOSURE_LINK_LABEL} →
      </Link>
    </aside>
  );
}
