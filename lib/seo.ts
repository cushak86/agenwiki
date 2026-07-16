import type { Metadata } from "next";
import type { ContentMeta, ContentType, GlossaryMeta, GuideMeta } from "@/lib/types";
import { getContentDescription, getContentHref, getContentTitle } from "@/lib/content";

export const siteConfig = {
  name: "agenwiki",
  description: "AI 전반 지식백과와 에이전트 실전 가이드",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://agenwiki.vercel.app"
};

// 페이지별 cover가 없을 때 쓰는 사이트 기본 OG 이미지.
// SVG 금지 — X·페이스북·슬랙·카카오톡은 SVG를 카드로 렌더링하지 않는다(JPG/PNG/WEBP/GIF만).
// PNG 생성: scripts/design/make_og_png.py
const DEFAULT_OG_IMAGE = "/images/covers/default.png";

// OG 카드 규격. 명시하면 플랫폼이 원본을 받기 전에 레이아웃을 잡을 수 있다.
const OG_IMAGE_SIZE = { width: 1200, height: 630 };

// cover가 SVG면 카드가 빈칸으로 나가므로 PNG 짝으로 교체한다.
// (구 콘텐츠의 frontmatter가 .svg를 가리키는 동안의 안전망)
function rasterizedCover(image?: string) {
  if (!image) return undefined;
  return image.endsWith(".svg") ? image.replace(/\.svg$/, ".png") : image;
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString();
}

export function buildMetadata({
  title,
  description,
  pathname,
  image,
  ogType = "website"
}: {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  ogType?: "article" | "website";
}): Metadata {
  const url = absoluteUrl(pathname);
  const images = [{ url: absoluteUrl(rasterizedCover(image) ?? DEFAULT_OG_IMAGE), ...OG_IMAGE_SIZE }];

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: ogType,
      locale: "ko_KR",
      images
    }
  };
}

export function metadataForContent(type: ContentType, meta: ContentMeta): Metadata {
  const image = type === "guides" && "cover" in meta ? meta.cover : undefined;

  return buildMetadata({
    title: getContentTitle(meta),
    description: getContentDescription(meta),
    pathname: getContentHref(type, meta.slug),
    image,
    ogType: type === "guides" || type === "newsletter" ? "article" : "website"
  });
}

export function articleJsonLd(meta: GuideMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    author: {
      "@type": "Person",
      name: meta.author
    },
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt,
    mainEntityOfPage: absoluteUrl(`/guides/${meta.slug}`)
  };
}

export function definedTermJsonLd(meta: GlossaryMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: meta.term,
    description: meta.shortDef,
    alternateName: meta.aliases,
    url: absoluteUrl(`/glossary/${meta.slug}`)
  };
}

export type BreadcrumbItem = {
  name: string;
  pathname: string;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.pathname)
    }))
  };
}
