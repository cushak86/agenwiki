import { getAll, getContentDescription, getContentTitle } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import type { ContentMeta, ContentType } from "@/lib/types";

export const dynamic = "force-static";

const contentTypes: ContentType[] = ["guides", "newsletter"];

function itemDate(meta: ContentMeta) {
  return "publishedAt" in meta ? meta.publishedAt : new Date().toISOString();
}

export function GET() {
  const items = contentTypes
    .flatMap((type) => getAll(type).map((meta) => ({ type, meta })))
    .sort((a, b) => itemDate(b.meta).localeCompare(itemDate(a.meta)));

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    ${items
      .map(({ type, meta }) => {
        const href = absoluteUrl(`/${type}/${meta.slug}`);
        return `<item>
      <title><![CDATA[${getContentTitle(meta)}]]></title>
      <link>${href}</link>
      <guid>${href}</guid>
      <pubDate>${new Date(itemDate(meta)).toUTCString()}</pubDate>
      <description><![CDATA[${getContentDescription(meta)}]]></description>
    </item>`;
      })
      .join("\n    ")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
