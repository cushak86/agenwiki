import type { MetadataRoute } from "next";
import { CHAINS } from "@/lib/chains";
import { getAll, getAllTags } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import type { ContentType } from "@/lib/types";

const staticRoutes = [
  "/",
  "/guides",
  "/glossary",
  "/prompts",
  "/prompts/builder",
  ...CHAINS.map((chain) => `/prompts/chains/${chain.slug}`),
  "/newsletter",
  "/topics",
  "/about",
  "/terms",
  "/privacy"
];
const contentTypes: ContentType[] = ["guides", "glossary", "prompts", "newsletter"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = staticRoutes.map((route) => ({ url: absoluteUrl(route) }));
  const contentPages = contentTypes.flatMap((type) =>
    getAll(type).map((meta) => ({
      url: absoluteUrl(`/${type}/${meta.slug}`)
    }))
  );
  const topicPages = getAllTags().map((tag) => ({
    url: absoluteUrl(`/topics/${encodeURIComponent(tag)}`)
  }));

  return [...pages, ...contentPages, ...topicPages];
}
