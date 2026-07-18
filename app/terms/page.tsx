import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "이용약관",
  description: "agenwiki 이용약관 — 서비스 내용, AI 생성 콘텐츠의 성격과 면책, 저작권과 책임의 한계를 정리합니다.",
  pathname: "/terms"
});

// 이 문서도 about/privacy 와 같은 원칙: 사실이 아닌 것을 쓰지 마라.
//   - 이 사이트는 AI가 초안을 쓰고 사람이 건별로 검수하지 않는다(about 페이지가 공개 선언). 약관도 그 전제로 쓴다.
//   - "검수했다"거나 "정확성을 보증한다"고 쓰지 마라 — about 과 정면으로 어긋난다.
//   - 회원가입·결제·유료 기능이 없다. 없는 계정/유료 조항을 지어내지 마라.
const EFFECTIVE_DATE = "2026-07-18";
const CONTACT_EMAIL = "cushak@icloud.com";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">이용약관</h1>
      <p className="mt-4 leading-8 text-muted">
        이 약관은 agenwiki(이하 &ldquo;사이트&rdquo;)를 이용할 때 적용되는 조건을 정합니다. 사이트를 이용하시는
        것은 이 약관에 동의하는 것으로 봅니다. about 페이지와 같은 원칙으로, 실제 운영 방식을 있는 그대로 적습니다.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">1. 서비스 내용</h2>
        <p className="mt-3 leading-8 text-muted">
          사이트는 AI 전반의 지식을 한국어로 정리해 <strong className="font-semibold text-ink">무료로</strong>{" "}
          제공하는 지식백과입니다. 가이드·용어집·프롬프트·뉴스레터의 네 가지 형식으로 글을 싣습니다. 회원가입이나
          결제가 필요한 유료 기능은 없습니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">2. 콘텐츠의 성격 — 반드시 읽어 주세요</h2>
        <p className="mt-3 leading-8 text-muted">
          <strong className="font-semibold text-ink">이 사이트의 글은 AI가 초안을 쓰며, 사람이 발행 전에 한 건씩
          읽고 검수하지 않습니다.</strong> 발행 단계에서는 형식(제목·날짜·태그 등)만 자동 검사할 뿐, 내용이 사실과
          맞는지·인용이 원문과 일치하는지는 확인하지 않습니다. 그 결과{" "}
          <strong className="font-semibold text-ink">사실관계 오류나 원문 왜곡이 그대로 남아 있을 수 있습니다.</strong>{" "}
          제작 방식과 한계는 <a href="/about" className="font-semibold text-ink hover:text-accent">소개</a> 페이지에
          자세히 밝혀 두었습니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          따라서 사이트의 내용은 <strong className="font-semibold text-ink">참고용 정보</strong>이며, 의료·법률·금융·
          투자·보안처럼 잘못된 정보가 실질적 피해로 이어질 수 있는 판단에는 그대로 의존하지 마시고, 반드시 원문과
          전문가의 확인을 거치시기 바랍니다. 사이트는 어떤 내용의 정확성·완전성·최신성도 보증하지 않습니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">3. 책임의 한계</h2>
        <p className="mt-3 leading-8 text-muted">
          사이트의 정보를 이용하여 내린 판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다. 법이 허용하는 범위
          안에서, 사이트는 콘텐츠의 오류나 이용으로 인해 발생한 직접적·간접적 손해에 대해 책임을 지지 않습니다.
          사이트는 무료로 &ldquo;있는 그대로(as-is)&rdquo; 제공됩니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">4. 저작권과 이용</h2>
        <p className="mt-3 leading-8 text-muted">
          사이트가 직접 작성한 글은 개인적·비상업적 학습 목적으로 자유롭게 읽고 인용하실 수 있습니다. 인용하실
          때는 출처(사이트 이름과 해당 글 주소)를 밝혀 주세요. 글 안에서 소개하는 논문·기사·외부 자료의 저작권은
          각 원저작자에게 있으며, 사이트는 근거로 삼은 원문이 있는 글에는 글 끝에 출처를 표기합니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">5. 외부 링크</h2>
        <p className="mt-3 leading-8 text-muted">
          사이트는 논문·문서 등 외부 사이트로 연결되는 링크를 포함합니다. 링크된 외부 사이트의 내용과 운영은 해당
          사이트의 책임이며, 사이트는 이에 대해 통제하거나 보증하지 않습니다. 표기된 출처 링크가 시간이 지나 접속되지
          않을 수 있습니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">6. 금지 행위</h2>
        <p className="mt-3 leading-8 text-muted">
          사이트의 정상적인 운영을 방해하는 행위(과도한 자동 수집으로 서버에 부담을 주는 행위, 사이트의 정보를
          사실인 것처럼 오도하여 재배포하는 행위 등)는 삼가 주세요.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">7. 개인정보</h2>
        <p className="mt-3 leading-8 text-muted">
          개인정보의 처리에 관한 사항은{" "}
          <a href="/privacy" className="font-semibold text-ink hover:text-accent">개인정보처리방침</a>을 따릅니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">8. 약관의 변경</h2>
        <p className="mt-3 leading-8 text-muted">
          이 약관은 필요에 따라 개정될 수 있으며, 변경 시 이 페이지에서 갱신하고 아래 시행일을 함께 옮깁니다.
          변경 이후에도 사이트를 계속 이용하시면 개정된 약관에 동의한 것으로 봅니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">9. 문의</h2>
        <p className="mt-3 leading-8 text-muted">
          약관과 관련한 문의는 이메일로 받습니다 —{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-ink hover:text-accent">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-6 leading-8 text-muted">
          <strong className="font-semibold text-ink">시행일:</strong> {EFFECTIVE_DATE}
        </p>
      </section>
    </div>
  );
}
