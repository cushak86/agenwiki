import type { MetadataRoute } from "next";
import { getAll, getAllTags } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import type { ContentType } from "@/lib/types";

const staticRoutes = ["/", "/guides", "/glossary", "/prompts", "/newsletter", "/about", "/terms", "/privacy"];
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
