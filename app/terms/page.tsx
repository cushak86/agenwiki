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
//   - 회원가입·로그인 기능은 없다. 없는 계정 조항을 지어내지 마라.
//   - 다만 /store 에서 유료 디지털 상품을 판다(lib/products.ts). "유료 기능이 없다"고 다시 쓰지 마라 —
//     파는 동안에는 거짓이다. 결제·파일 발송·결제 취소는 래피드(Latpeed)가 대행한다.
//   - 4절 청약철회 기준은 "콘텐츠를 열람하기 전"이다. 이걸 "파일이 전달되기 전"으로 좁히지 마라.
//     법정 최소선(제공 개시)보다 소비자에게 넓게 주는 것은 언제나 유효하고, 원래 공개했던 조건이며,
//     래피드가 "결제 즉시 자동 발송"하는 구조에서 "전달 전"은 환불 창이 사실상 0이 되어 형해화한다.
//     같은 문장이 /store 와 public/rankup/index.html(결제 안내 본문·약관 모달 4절)에도 있다 —
//     한 곳을 고치면 세 곳을 함께 고쳐 표현을 일치시켜라. 이 문서가 정본이다.
const EFFECTIVE_DATE = "2026-08-08";
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
          사이트는 AI 전반의 지식을 한국어로 정리해 제공하는 지식백과입니다. 가이드·용어집·프롬프트·뉴스레터의
          네 가지 형식으로 글을 싣고, 이 글들은 회원가입이나 결제 없이 읽으실 수 있습니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          그와 별개로 <a href="/store" className="font-semibold text-ink hover:text-accent">스토어</a>에서
          전자책·템플릿 같은 <strong className="font-semibold text-ink">유료 디지털 상품</strong>을 판매합니다.
          결제와 파일 발송은 콘텐츠 판매 플랫폼 <strong className="font-semibold text-ink">래피드(Latpeed)</strong>가
          처리하며, 사이트는 상품을 안내하고 래피드의 판매 페이지로 연결하는 역할을 합니다.
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
          사이트에 실린 글은 &ldquo;있는 그대로(as-is)&rdquo; 제공됩니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">4. 유료 상품의 결제와 청약철회</h2>
        <p className="mt-3 leading-8 text-muted">
          스토어에서 판매하는 상품은 결제 후 내려받는 디지털 콘텐츠입니다. 결제·파일 발송·결제 취소는 모두
          래피드(Latpeed)가 대행하며, 결제 수단과 영수증에 관한 사항은 래피드의 정책을 따릅니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          <strong className="font-semibold text-ink">
            콘텐츠를 열람(다운로드해 내용을 확인)하기 전이라면 결제 후 7일 이내 전액 환불
          </strong>
          해 드립니다. 콘텐츠를 열람한 뒤에는 디지털 콘텐츠의 성격상{" "}
          <strong className="font-semibold text-ink">전자상거래법 제17조 제2항</strong>에 따라 청약철회가 제한될 수
          있습니다. 환불 신청은 아래 문의 이메일로 받으며, 접수 후 지체 없이 처리합니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">5. 저작권과 이용</h2>
        <p className="mt-3 leading-8 text-muted">
          사이트가 직접 작성한 글은 개인적·비상업적 학습 목적으로 자유롭게 읽고 인용하실 수 있습니다. 인용하실
          때는 출처(사이트 이름과 해당 글 주소)를 밝혀 주세요. 글 안에서 소개하는 논문·기사·외부 자료의 저작권은
          각 원저작자에게 있으며, 사이트는 근거로 삼은 원문이 있는 글에는 글 끝에 출처를 표기합니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">6. 외부 링크</h2>
        <p className="mt-3 leading-8 text-muted">
          사이트는 논문·문서 등 외부 사이트로 연결되는 링크를 포함합니다. 링크된 외부 사이트의 내용과 운영은 해당
          사이트의 책임이며, 사이트는 이에 대해 통제하거나 보증하지 않습니다. 표기된 출처 링크가 시간이 지나 접속되지
          않을 수 있습니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">7. 금지 행위</h2>
        <p className="mt-3 leading-8 text-muted">
          사이트의 정상적인 운영을 방해하는 행위(과도한 자동 수집으로 서버에 부담을 주는 행위, 사이트의 정보를
          사실인 것처럼 오도하여 재배포하는 행위 등)는 삼가 주세요.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">8. 개인정보</h2>
        <p className="mt-3 leading-8 text-muted">
          개인정보의 처리에 관한 사항은{" "}
          <a href="/privacy" className="font-semibold text-ink hover:text-accent">개인정보처리방침</a>을 따릅니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">9. 약관의 변경</h2>
        <p className="mt-3 leading-8 text-muted">
          이 약관은 필요에 따라 개정될 수 있으며, 변경 시 이 페이지에서 갱신하고 아래 시행일을 함께 옮깁니다.
          변경 이후에도 사이트를 계속 이용하시면 개정된 약관에 동의한 것으로 봅니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">10. 문의</h2>
        <p className="mt-3 leading-8 text-muted">
          약관·결제·환불과 관련한 문의는 이메일로 받습니다 —{" "}
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
