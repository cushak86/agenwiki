import type { Metadata } from "next";
import type { ContentMeta, ContentType, GlossaryMeta, GuideMeta } from "@/lib/types";
import { getContentDescription, getContentHref, getContentTitle } from "@/lib/content";

export const siteConfig = {
  name: "agenwiki",
  description: "AI 전반 지식백과와 에이전트 실전 가이드",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://agenwiki.online"
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

/**
 * 사이트 전역 WebSite 스키마 — 엔티티 명시 + 사이트 내 검색(SearchAction) 선언.
 * /search 는 ?q= 초기 쿼리를 지원한다(SearchClient) — 템플릿과 실제 동작이 일치해야 한다.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "ko",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/** 사이트 전역 Organization 스키마 — 운영 주체 엔티티. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/images/logo.png"),
    contactPoint: {
      "@type": "ContactPoint",
      email: "cushak@icloud.com",
      contactType: "customer support",
      availableLanguage: ["ko"]
    }
  };
}

export function articleJsonLd(meta: GuideMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    // author 를 Person 으로 선언하면 안 된다. 콘텐츠의 author 값은 38건 전부 "agenwiki" 이고
    // 그건 사람 이름이 아니다 — 실재하지 않는 사람을 저자로 신고하는 셈이라 그 자체가 허위 신호다
    // (2026-08-08 정정). 실제 저자가 생기면 그때 Person 으로 올리고 url·sameAs 착지점을 함께 둔다.
    // 지금 이 사이트의 정직한 서술은 "조직이 AI 파이프라인으로 만든다"이고, 그건 AiDisclosure 가
    // 이미 전 페이지 하단에 밝히고 있다. 스키마도 같은 말을 해야 한다.
    author: {
      "@type": "Organization",
      name: meta.author,
      url: siteConfig.url
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
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
