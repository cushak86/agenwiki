import Link from "next/link";
import { notFound } from "next/navigation";
import { SubscribeForm } from "@/components/SubscribeForm";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

// Pro 비전 페이지 런치 스위치. 켜기 전까지 이 페이지는 404이고 어디에도 링크되지 않는다.
// 켜는 법: Vercel 환경변수 NEXT_PUBLIC_PRO_PAGE_ENABLED=1 설정 후 재배포,
//          그리고 sitemap·prompts 목록 카드에 /pro 링크 추가.
const PRO_PAGE_ENABLED = process.env.NEXT_PUBLIC_PRO_PAGE_ENABLED === "1";

export const metadata = PRO_PAGE_ENABLED
  ? buildMetadata({
      title: "Pro 로드맵 — 준비 중",
      description:
        "agenwiki의 무료 도구는 계속 무료입니다. 그 위에 준비 중인 Pro 자산(완성 템플릿 팩·레시피 팩·가이드북)의 로드맵을 미리 보여드립니다.",
      pathname: "/pro"
    })
  : {};

const FREE_ITEMS = [
  { name: "프롬프트 빌더", desc: "작업·독자·톤·품질 규칙 조합 마법사", href: "/prompts/builder" },
  { name: "프롬프트 체인", desc: "보고서 작성 4단계 워크플로", href: "/prompts/chains/report-writing" },
  { name: "CLAUDE.md 생성기", desc: "AI 코딩 설정 파일 3형식 생성", href: "/tools/claude-md" },
  { name: "프롬프트 라이브러리", desc: "복사해 바로 쓰는 프롬프트 모음", href: "/prompts" },
  { name: "레시피 공유·보관", desc: "만든 조합을 링크로 공유, 브라우저에 저장", href: "/prompts/builder" },
  { name: "AI 지식백과", desc: "가이드·용어사전·뉴스레터", href: "/guides" }
];

const PRO_TEASERS = [
  {
    name: "CLAUDE.md 완성 템플릿 팩",
    desc: "업종·스택별로 실전 검증 규칙을 채워 넣은 완성본 모음. 생성기로 뼈대를 만들었다면, 팩은 바로 쓰는 완제품입니다."
  },
  {
    name: "직군별 프롬프트 레시피 팩",
    desc: "기획·마케팅·개발·운영 직군의 반복 업무를 커버하는 검증된 레시피 세트. few-shot 예시까지 포함."
  },
  {
    name: "체인 라이브러리 전권",
    desc: "회의록→후속조치, 자료조사→요약보고, 콘텐츠 기획→발행까지 — 업무 하나를 끝까지 끌고 가는 다단계 워크플로 모음."
  },
  {
    name: "프롬프트 실전 가이드북",
    desc: "이 사이트의 도구와 지식을 한 권으로 엮은 전자책. 도구 사용법부터 직접 레시피를 설계하는 법까지."
  }
];

export default function ProPage() {
  if (!PRO_PAGE_ENABLED) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">Pro 로드맵</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">지금 있는 건 전부 무료. 그 위에 준비 중인 것.</h1>
        <p className="mt-4 leading-8 text-muted">
          agenwiki의 도구는 로그인 없이 무료로 쓸 수 있고, 앞으로도 그렇습니다. 그 위에 &ldquo;바로 쓰는
          완제품&rdquo; 형태의 Pro 자산을 준비하고 있습니다 — 출시되면 외부 마켓(크몽 등)에서 판매하고, 이 페이지와
          뉴스레터로 알립니다.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold text-ink">✅ 무료 — 지금 바로</h2>
          <ul className="mt-4 space-y-3">
            {FREE_ITEMS.map((item) => (
              <li key={item.name} className="rounded-lg border border-line bg-white p-4">
                <Link href={item.href} className="font-semibold text-ink hover:text-accent">
                  {item.name} →
                </Link>
                <p className="mt-1 text-sm leading-6 text-muted">{item.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">🔒 Pro — 준비 중</h2>
          <ul className="mt-4 space-y-3">
            {PRO_TEASERS.map((item) => (
              <li key={item.name} className="rounded-lg border border-dashed border-line bg-white p-4">
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{item.desc}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-muted">
            구성과 출시 시기는 준비 상황에 따라 달라질 수 있습니다. 확정되지 않은 것을 확정된 것처럼 말하지
            않겠습니다.
          </p>
        </section>
      </div>

      <div className="mt-12 max-w-3xl">
        <SubscribeForm
          heading="Pro 출시 알림 받기"
          description="출시 소식과 얼리버드 혜택을 뉴스레터로 가장 먼저 알려드립니다. 그 전까지는 평소처럼 AI 도구·프롬프트 소식이 갑니다."
          source="pro_waitlist"
        />
      </div>
    </div>
  );
}
