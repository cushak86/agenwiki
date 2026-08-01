import Image from "next/image";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-panel transition hover:-translate-y-0.5 hover:border-accent/60"
    >
      <div className="relative overflow-hidden">
        <Image
          src={product.cover}
          alt={`${product.name} 커버`}
          width={640}
          height={640}
          className="cover-img transition duration-300 group-hover:scale-[1.02]"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-paper/80 px-3 py-1 text-xs font-bold text-accentSoft backdrop-blur">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold leading-snug text-ink">{product.name}</h3>
        <p className="text-sm leading-6 text-muted">{product.tagline}</p>
        <div className="mt-auto flex items-baseline justify-between pt-3">
          <span className="text-lg font-extrabold tabular-nums text-ink">{formatPrice(product)}</span>
          {product.priceNote ? (
            <span className="text-xs text-muted">{product.priceNote}</span>
          ) : null}
        </div>
      </div>
    </a>
  );
}
