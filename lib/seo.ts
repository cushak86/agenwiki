import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteUrl.mjs";
import type { ContentMeta, ContentType, GlossaryMeta, GuideMeta } from "@/lib/types";
import { getContentDescription, getContentHref, getContentTitle } from "@/lib/content";

export const siteConfig = {
  name: "agenwiki",
  description: "AI 전반 지식백과와 에이전트 실전 가이드",
  url: SITE_URL
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

/**
 * ⚠️ 루트의 슬래시 불일치는 **결함이 아니다. 고치지 마라.** (2026-08-09 확인)
 *
 * 사이트맵은 `https://agenwiki.online/`(슬래시 있음)을 싣고, 홈 canonical 은
 * `https://agenwiki.online`(없음)로 렌더된다. absoluteUrl("/") 은 슬래시를 붙이지만
 * Next 가 alternates.canonical 에서 루트 슬래시를 정규화해 떼기 때문이다.
 *
 * 전수 점검(2026-08-09 · 4개 사이트 193개 URL)에서 이 한 건만 "불일치"로 잡혔고
 * 세 Next 사이트에 똑같이 나타난다. 그런데 두 주소는 **바이트 단위로 같은 응답**이다
 * (md5 일치, 각 87,152 bytes). RFC 3986 상 빈 경로는 "/" 와 동치라 구글도 같게 취급한다.
 *
 * 즉 사용자에게도 크롤러에게도 아무 일이 일어나지 않는다. Next 의 정규화를 거슬러
 * 맞추려 들면 얻는 것 없이 새 버그만 만든다 — 같은 날 아침 /topics/rag 를
 * "404 니까 리다이렉트를 넣자"고 고쳤다가 무한 루프를 만든 것이 정확히 그 실수였다.
 * **기계적 불일치가 곧 결함은 아니다. 사용자에게 무슨 일이 일어나는지를 먼저 재라.**
 */

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
    pathname: getContentHref(type, meta),
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
