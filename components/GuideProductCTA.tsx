import Image from "next/image";
import { formatPrice, products } from "@/lib/products";

/**
 * 가이드 슬러그와 매핑된 상품(products.ts의 relatedGuides)을 카드형 CTA로 보여준다.
 * 매핑이 없는 가이드에는 아무것도 렌더하지 않는다 — 억지 판매 금지.
 */
export function GuideProductCTA({ guideSlug }: { guideSlug: string }) {
  const related = products.filter((p) => p.relatedGuides.includes(guideSlug)).slice(0, 2);

  if (related.length === 0) {
    return null;
  }

  return (
    <aside className="mt-10 max-w-3xl space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">
        이 글의 내용을 파일·기록으로
      </p>
      {related.map((p) => (
        <a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-stretch gap-5 overflow-hidden rounded-xl border border-line bg-panel transition hover:-translate-y-0.5 hover:border-accent/60"
        >
          <div className="w-28 shrink-0 sm:w-36">
            <Image
              src={p.cover}
              alt={`${p.name} 커버`}
              width={288}
              height={288}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1.5 py-4 pr-5">
            <h3 className="font-bold leading-snug text-ink transition group-hover:text-accentSoft">
              {p.name}
            </h3>
            <p className="text-sm leading-6 text-muted">{p.tagline}</p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="font-extrabold tabular-nums text-ink">{formatPrice(p)}</span>
              {p.priceNote ? <span className="text-xs text-muted">{p.priceNote}</span> : null}
              <span className="ml-auto text-sm font-bold text-accent transition group-hover:translate-x-0.5">
                보러 가기 →
              </span>
            </div>
          </div>
        </a>
      ))}
    </aside>
  );
}
