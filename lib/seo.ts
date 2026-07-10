import type { Metadata } from "next";
import type { ContentMeta, ContentType, GlossaryMeta, GuideMeta } from "@/lib/types";
import { getContentDescription, getContentHref, getContentTitle } from "@/lib/content";

export const siteConfig = {
  name: "agenwiki",
  description: "AI 전반 지식백과와 에이전트 실전 가이드",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://agenwiki.vercel.app"
};

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
  const images = image ? [{ url: absoluteUrl(image) }] : undefined;

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
