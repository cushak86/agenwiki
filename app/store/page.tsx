import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { chronicleProducts, comboProduct, formatPrice, rankupProducts } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "스토어 — 실제로 굴린 기록으로 만든 상품들",
  description:
    "AI 에이전트 6명이 428커밋을 쌓으며 실제로 회사를 굴린 기록에서 나온 전자책·템플릿 키트, 그리고 검색되는 사이트를 만드는 랭크업 코스.",
  pathname: "/store"
});

export default function StorePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">Store</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink md:text-4xl">
          실제로 굴린 기록으로만 만듭니다
        </h1>
        <p className="mt-4 leading-8 text-body">
          이 스토어의 상품은 전부 이 사이트를 운영하는 1인 AI 회사의 실제 운영 기록에서 나왔습니다.
          각색은 없습니다 — 거짓 증거 적발, 날조 출처 12곳, 규칙 준수율 8%, 매출 0원 결산까지 그대로
          공개하는 것이 이 회사의 방식입니다.
        </p>
      </header>

      <a
        href={comboProduct.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-10 flex flex-col overflow-hidden rounded-2xl border border-accent/40 bg-panel transition hover:-translate-y-0.5 hover:border-accent sm:flex-row"
      >
        <div className="w-full shrink-0 sm:w-64">
          <Image
            src={comboProduct.cover}
            alt={`${comboProduct.name} 커버`}
            width={500}
            height={500}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 p-6 md:p-8">
          <span className="w-fit rounded-full bg-accentDeep px-3 py-1 text-xs font-bold text-white">
            {comboProduct.badge} · 가장 알뜰한 구성
          </span>
          <h2 className="mt-1 text-2xl font-extrabold leading-snug text-ink transition group-hover:text-accentSoft">
            {comboProduct.name}
          </h2>
          <p className="text-sm leading-6 text-body">{comboProduct.description}</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-sm text-muted line-through">148,800원</span>
            <span className="text-2xl font-extrabold tabular-nums text-ink">{formatPrice(comboProduct)}</span>
            <span className="ml-auto text-sm font-bold text-accent transition group-hover:translate-x-0.5">
              세트로 받기 →
            </span>
          </div>
        </div>
      </a>

      <section className="mt-14">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-ink">실전 기록 시리즈</h2>
          <span className="text-sm text-muted">멀티에이전트 운영의 기록과 파일</span>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {chronicleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-ink">랭크업 — 검색되는 사이트 만들기</h2>
          <span className="text-sm text-muted">이 회사가 자기 사이트에 직접 적용 중인 코스</span>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rankupProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          <div className="flex flex-col justify-center rounded-xl border border-dashed border-line p-6">
            <h3 className="font-bold text-ink">키워드금고 템플릿 (무료 도구)</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              검색 수요가 검증된 키워드 30개를 뽑는 시트. 판정 수식이 내장되어 있어 검색수만 넣으면
              황금/채택/탈락이 자동 계산됩니다.
            </p>
            <a
              href="/rankup/tools/keyword-vault.html"
              className="mt-4 text-sm font-bold text-accent hover:text-accentSoft"
            >
              템플릿 받으러 가기 →
            </a>
          </div>
        </div>
      </section>

      <section className="mt-14 rounded-xl border border-line bg-panel p-6 md:p-8">
        <h2 className="text-lg font-bold text-ink">구매 전에 알아두실 것</h2>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-body">
          <li>· 결제와 파일 발송은 콘텐츠 판매 플랫폼 래피드(Latpeed)가 처리하며, 결제 즉시 자동 발송됩니다.</li>
          <li>· 랭크업은 순위를 보장하지 않습니다. 완주 후 8주 내 색인율 90%·노출 100회 미달 시 전액 환급합니다.</li>
          <li>
            · 상품의 근거가 된 기록은 이 사이트의{" "}
            <a href="/guides" className="font-medium text-accent underline underline-offset-4">
              가이드
            </a>
            에서 무료로 읽을 수 있습니다. 가이드가 원리라면, 상품은 파일과 순서입니다.
          </li>
        </ul>
      </section>
    </div>
  );
}
