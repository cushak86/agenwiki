import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

// description에 "검수"를 쓰지 않는다 — 사람이 글을 읽고 승인하는 단계가 없으므로 거짓이 된다.
export const metadata = buildMetadata({
  title: "소개",
  description: "agenwiki가 무엇이고, 글을 어떻게 만드는지, 무엇을 하지 않는지 밝힙니다.",
  pathname: "/about"
});

// 제작 방식 서술의 근거(문구를 고칠 때 반드시 확인할 것):
//   - 형식 검사만 돈다 → publish.py가 프론트매터 스키마·draft:false·슬러그 중복·npm run build 를 검사한다.
//     출처 블록 검사는 category 기준이다: guides 이면서 "AI 연구"/"AI 소식" 일 때만 필수
//     (규칙 정의는 lib/content.ts 의 SOURCE_REQUIRED_CATEGORIES). publish.py 뿐 아니라
//     lib/content.ts 의 parseFile 에서도 걸려서 빌드가 막는다 — 그마저 URL 존재 여부만 본다.
//   - 사람이 건별로 읽는 단계는 없다 → 이 저장소 어디에도 사실 확인 게이트가 없다.
// 이 페이지에서 "검수했다"고 말하지 않는 이유가 이것이다. 파이프라인이 바뀌기 전에는 문구를 넓히지 마라.
//
// 아래 "링크한 주소가 지금도 살아 있는지는 자동으로 확인하지 않습니다"(출처 정책)를 지울 생각이라면 멈춰라.
// check_source_links.py 가 생겼지만 빌드·발행 어디에도 걸려 있지 않다(수동·주기 실행). 실행을 강제하는
// 것이 없으므로 "자동으로 확인한다"는 여전히 거짓이다. 그 스크립트를 CI/발행에 붙이기 전에는 고치지 마라.
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">소개</h1>
      <p className="mt-4 leading-8 text-muted">
        agenwiki는 AI 전반 지식, 에이전트 워크플로우, 프롬프트, 뉴스레터를 정리하는 한국어 지식백과입니다. 이
        페이지는 이 사이트가 무엇이고, 글을 어떻게 만들며, 무엇을 하지 않는지 밝힙니다.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">이 사이트는 무엇인가</h2>
        <p className="mt-3 leading-8 text-muted">
          agenwiki는 AI를 한국어로 따라잡으려는 실무자와 학습자를 위한 지식백과입니다. 네 가지 형식으로
          정리합니다 — 개념을 풀어 쓴 <strong className="font-semibold text-ink">가이드</strong>, 용어를 짧게
          정의한 <strong className="font-semibold text-ink">용어집</strong>, 복사해 바로 쓰는{" "}
          <strong className="font-semibold text-ink">프롬프트</strong>, 그리고 주기적으로 묶는{" "}
          <strong className="font-semibold text-ink">뉴스레터</strong>입니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          하는 일은 하나입니다. 논문과 공개 문서처럼 근거가 있는 내용을 한국어로 옮기고, 그것이 실무에서 무엇을
          뜻하는지 덧붙입니다. 모든 글은 무료로 공개합니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">어떻게 만드는가</h2>
        <p className="mt-3 leading-8 text-muted">
          이 사이트의 글은 AI가 초안을 씁니다. 감추는 것보다 밝히는 편이 낫다고 판단해 적습니다.
        </p>
        <p className="mt-3 leading-8 text-muted">제작은 네 단계입니다.</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">수집</strong> — arXiv API와 본문을 제공하는 공개 피드에서
            원문을 가져옵니다.
          </li>
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">초안</strong> — 수집한 원문을 근거로 LLM이 초안을 씁니다.
          </li>
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">형식 검사</strong> — 발행 스크립트가 형식을 검사합니다.
            제목·날짜·태그 같은 항목이 규격에 맞는지, 주소가 중복되지 않는지, 사이트가 정상적으로 빌드되는지를
            봅니다.
          </li>
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">발행</strong> — 형식 검사를 통과하면 공개됩니다.
          </li>
        </ol>
        <p className="mt-3 leading-8 text-muted">
          <strong className="font-semibold text-ink">3단계는 형식 검사이지 사실 확인이 아닙니다.</strong> 글에
          적힌 내용이 맞는지, 인용이 원문과 일치하는지, 링크한 주소가 살아 있는지는 검사하지 않습니다. 사람이
          파이프라인을 운영하고 무엇을 실을지 정하지만,{" "}
          <strong className="font-semibold text-ink">발행 전에 글을 한 건씩 읽지는 않습니다.</strong>
        </p>
        <p className="mt-3 leading-8 text-muted">
          그래서 한계를 분명히 적어 둡니다. 이 사이트의 글에는{" "}
          <strong className="font-semibold text-ink">
            사실관계 오류나 원문 왜곡이 그대로 남아 있을 수 있습니다.
          </strong>{" "}
          자동 검사는 그런 것을 잡지 못하고, 사람이 잡는 단계는 없습니다. 중요한 판단에 쓰실 내용이라면 아래 출처
          정책을 보시고 원문을 직접 확인하시는 편이 안전합니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          색인이 실제로 어떻게 쌓이는지는{" "}
          <Link href="/lab/index-log" className="font-medium text-ink hover:text-accent">
            색인 실측 기록
          </Link>
          에 회차별로 공개합니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">무엇을 하지 않는가</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">원문을 통째로 긁어오지 않습니다.</strong> 수집은 arXiv
            API와 본문을 제공하는 공개 피드로 한정합니다. 웹페이지 전문을 스크래핑하지 않습니다.
          </li>
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">원문 문장을 그대로 옮기지 않습니다.</strong> 인용이
            필요하면 출처를 밝히고, 나머지는 한국어로 다시 씁니다.
          </li>
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">출처에 없는 것을 만들지 않습니다.</strong> 초록과 원문에
            없는 수치·인용·실험 결과를 추가하지 않는 것이 초안 작성 규칙입니다. 다만 이 규칙이 지켜졌는지를
            건별로 확인하는 사람은 없습니다.
          </li>
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">사람이 검수했다고 말하지 않습니다.</strong> 이 사이트에는
            사람이 글을 읽고 승인하는 단계가 없습니다. 있는 것처럼 쓰지 않겠습니다.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">출처 정책</h2>
        <p className="mt-3 leading-8 text-muted">
          근거로 삼은 원문이 있는 글에는 글 끝에 출처 블록을 답니다. arXiv 논문이면{" "}
          <code>arXiv:&lt;번호&gt;</code>와 원문 URL, 기사·블로그면 매체명과 원문 URL입니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          <strong className="font-semibold text-ink">모든 글에 출처 블록이 있는 것은 아닙니다.</strong> 특정 원문
          하나에 기대지 않는 개념 설명, 용어 정의, 프롬프트 예시에는 출처 블록이 없습니다. 이런 글은 초안을 쓴
          모델의 일반 지식에 기대고 있어서, 근거를 따라가 확인할 수단이 독자에게 없습니다. 그만큼 더 조심해서
          읽으셔야 합니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          출처 블록이 있더라도, 링크한 주소가 지금도 살아 있는지는 자동으로 확인하지 않습니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          오류를 확인하면 본문을 고치고 갱신일(<code>updatedAt</code>)을 함께 옮깁니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">연락 경로</h2>
        <p className="mt-3 leading-8 text-muted">
          오류 신고와 문의는 이메일로 받습니다 —{" "}
          <a href="mailto:cushak@icloud.com" className="font-semibold text-ink hover:text-accent">
            cushak@icloud.com
          </a>
        </p>
        <p className="mt-3 leading-8 text-muted">
          이 사이트에는 사람이 글을 검수하는 단계가 없습니다. 그래서 읽는 분이 알려 주시는 오류가 사실상 유일한
          교정 경로입니다. 사소해 보여도 알려 주시면 고치겠습니다.
        </p>
      </section>
    </div>
  );
}
