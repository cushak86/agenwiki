import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "개인정보처리방침",
  description: "agenwiki가 어떤 정보를 수집하고, 쿠키와 제3자 서비스를 어떻게 쓰는지 밝힙니다.",
  pathname: "/privacy"
});

// 이 문서는 실제 코드가 하는 일만 적는다(about 페이지와 같은 원칙). 사실이 아닌 것을 쓰지 마라:
//   - 자동 수집은 Vercel Web Analytics 뿐이다(app/layout.tsx 의 <Analytics />). 쿠키를 쓰지 않는다.
//   - 회원가입·로그인·댓글·입력 폼이 없다. 문의는 mailto 링크뿐이라 서버가 받는 개인정보가 없다.
//   - 광고는 현재 없다. Google AdSense 등을 붙이면 광고 쿠키가 생기므로, 그때 이 문서를 먼저 갱신하라.
//     (아래 "광고" 절과 "시행일"을 함께 고칠 것. 없는 광고를 있다고 쓰지 말 것.)
const EFFECTIVE_DATE = "2026-07-18";
const CONTACT_EMAIL = "cushak@icloud.com";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">개인정보처리방침</h1>
      <p className="mt-4 leading-8 text-muted">
        agenwiki(이하 &ldquo;사이트&rdquo;)는 방문자의 개인정보를 최소한으로만 다룹니다. 이 문서는 사이트가 어떤
        정보를 수집하고, 쿠키와 외부 서비스를 어떻게 쓰며, 방문자가 어떤 권리를 갖는지 밝힙니다. about 페이지와
        같은 원칙으로, 실제로 하는 일만 적습니다.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">1. 수집하지 않는 것</h2>
        <p className="mt-3 leading-8 text-muted">
          이 사이트에는 <strong className="font-semibold text-ink">회원가입·로그인·댓글·입력 폼이 없습니다.</strong>{" "}
          따라서 이름·전화번호·주소 같은 개인정보를 방문자에게 직접 입력받지 않습니다. 문의는 아래 이메일 링크로만
          받는데, 이는 방문자의 메일 프로그램에서 발송되는 것이라 사이트 서버가 그 내용을 저장하지 않습니다. 다만
          보내 주신 이메일은 운영자의 메일함에는 남습니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">2. 자동으로 수집되는 것</h2>
        <p className="mt-3 leading-8 text-muted">
          방문 통계를 파악하기 위해 <strong className="font-semibold text-ink">Vercel Web Analytics</strong>를
          사용합니다. 어떤 페이지가 얼마나 열렸는지 같은 익명 집계 데이터를 모으며,{" "}
          <strong className="font-semibold text-ink">쿠키를 사용하지 않고</strong> 개인을 식별하는 정보(이름·이메일
          등)를 저장하지 않습니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          또한 사이트는 <strong className="font-semibold text-ink">Vercel</strong>에서 호스팅되며, 웹 요청이
          처리되는 과정에서 접속 IP 주소와 브라우저 종류 같은 표준 서버 접속 기록이 Vercel에 의해 일시적으로 남을
          수 있습니다. 이는 서비스 제공과 보안을 위한 일반적인 웹 서버 동작입니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">3. 쿠키</h2>
        <p className="mt-3 leading-8 text-muted">
          <strong className="font-semibold text-ink">현재 이 사이트는 추적·광고 목적의 쿠키를 사용하지 않습니다.</strong>{" "}
          위에서 밝힌 Vercel Web Analytics도 쿠키를 쓰지 않습니다. 그래서 이 사이트를 이용하는 데 별도의 쿠키 동의
          절차가 필요하지 않습니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">4. 광고</h2>
        <p className="mt-3 leading-8 text-muted">
          <strong className="font-semibold text-ink">현재 이 사이트에는 광고가 없습니다.</strong> 앞으로 Google
          AdSense 같은 제3자 광고를 도입하면, 광고 사업자가 맞춤 광고를 위해 쿠키를 사용할 수 있습니다. 그렇게 되는
          시점에 이 방침을 먼저 갱신하여 어떤 광고 쿠키가 어떻게 쓰이는지, 방문자가 이를 어떻게 거부할 수 있는지를
          이 자리에 명시하겠습니다. 도입 전에는 그런 쿠키가 존재하지 않습니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">5. 제3자 서비스</h2>
        <p className="mt-3 leading-8 text-muted">
          사이트 운영을 위해 아래 외부 서비스를 사용합니다. 이들 서비스는 각자의 개인정보처리방침에 따라 데이터를
          처리하며, 서버는 대한민국 밖(미국 등)에 있을 수 있습니다.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">Vercel Inc.</strong> — 사이트 호스팅 및 방문 통계(Web
            Analytics). 접속 로그와 익명 집계 통계를 처리합니다.
          </li>
        </ul>
        <p className="mt-3 leading-8 text-muted">
          제3자 광고 등 새로운 외부 서비스를 추가하면 이 목록과 방침을 갱신합니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">6. 보관과 파기</h2>
        <p className="mt-3 leading-8 text-muted">
          방문 통계는 익명 집계 형태로만 보관되며 개인을 식별하지 않습니다. 이메일로 보내 주신 문의는 처리 목적이
          끝나면 지웁니다. 서버 접속 기록의 보관 기간은 호스팅 사업자(Vercel)의 정책을 따릅니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">7. 방문자의 권리</h2>
        <p className="mt-3 leading-8 text-muted">
          이 사이트는 방문자를 식별하는 개인정보를 직접 수집·보관하지 않으므로, 열람·정정·삭제를 요청할 저장된
          계정 정보가 없습니다. 다만 이메일로 문의를 보내신 경우, 그 이메일의 삭제를 언제든 아래 연락처로 요청하실
          수 있습니다. 만 14세 미만 아동을 대상으로 개인정보를 수집하지 않습니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">8. 문의처</h2>
        <p className="mt-3 leading-8 text-muted">
          개인정보 처리에 관한 문의와 요청은 이메일로 받습니다 —{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-ink hover:text-accent">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">9. 개정</h2>
        <p className="mt-3 leading-8 text-muted">
          이 방침의 내용이 바뀌면 이 페이지에서 갱신하고 아래 시행일을 함께 옮깁니다. 특히 광고나 새로운 외부
          서비스를 도입할 때는 적용 전에 먼저 이 문서를 고칩니다.
        </p>
        <p className="mt-6 leading-8 text-muted">
          <strong className="font-semibold text-ink">시행일:</strong> {EFFECTIVE_DATE}
        </p>
      </section>
    </div>
  );
}
