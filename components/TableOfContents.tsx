import Link from "next/link";
import { slugify } from "@/lib/slugify";

const H2_PATTERN = /^##\s+(.+)$/gm;
const MIN_HEADINGS = 2;

type Heading = {
  id: string;
  text: string;
};

function extractHeadings(body: string): Heading[] {
  const headings: Heading[] = [];
  const pattern = new RegExp(H2_PATTERN);
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(body)) !== null) {
    const text = match[1].trim();
    headings.push({ id: slugify(text), text });
  }

  return headings;
}

/**
 * 본문(raw markdown)에서 h2(`## `) 헤딩을 추출해 목차를 렌더링한다.
 * 헤딩이 2개 미만이면 표시하지 않는다.
 * id는 mdx-components.tsx의 h2 렌더러와 동일한 slugify 규칙을 써서
 * 실제 앵커와 항상 일치시킨다.
 */
export function TableOfContents({ body }: { body: string }) {
  const headings = extractHeadings(body);

  if (headings.length < MIN_HEADINGS) {
    return null;
  }

  return (
    <nav aria-label="목차" className="prose-shell mb-8 rounded-lg border border-line bg-white p-5">
      <p className="text-sm font-semibold text-ink">목차</p>
      <ol className="mt-3 space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link href={`#${heading.id}`} className="text-muted transition hover:text-accent">
              {heading.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
