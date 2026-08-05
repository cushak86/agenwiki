import type { MetadataRoute } from "next";
import { CHAINS } from "@/lib/chains";
import { getAll, getAllTags } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import type { ContentMeta, ContentType } from "@/lib/types";

const staticRoutes = [
  "/",
  "/guides",
  "/glossary",
  "/prompts",
  "/prompts/builder",
  "/tools",
  "/tools/claude-md",
  "/tools/llm-cost",
  "/tools/model-compare",
  "/tools/model-picker",
  "/tools/chunking",
  ...CHAINS.map((chain) => `/prompts/chains/${chain.slug}`),
  "/newsletter",
  "/topics",
  "/about",
  "/lab/index-log",
  "/terms",
  "/privacy",
  "/rankup",
  "/rankup/tools/keyword-vault.html"
];
const contentTypes: ContentType[] = ["guides", "glossary", "prompts", "newsletter"];

const lastModified = (meta: ContentMeta) =>
  "updatedAt" in meta ? meta.updatedAt : meta.publishedAt;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = staticRoutes.map((route) => ({ url: absoluteUrl(route) }));
  const contentPages = contentTypes.flatMap((type) =>
    getAll(type).map((meta) => ({
      url: absoluteUrl(`/${type}/${meta.slug}`),
      lastModified: lastModified(meta)
    }))
  );
  const topicPages = getAllTags().map((tag) => ({
    url: absoluteUrl(`/topics/${encodeURIComponent(tag)}`)
  }));

  return [...pages, ...contentPages, ...topicPages];
}
