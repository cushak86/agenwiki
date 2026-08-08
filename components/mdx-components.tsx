import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { ModelPriceTable } from "@/components/ModelPriceTable";
import { headingTextFromNode, slugify } from "@/lib/slugify";

/**
 * MDX 컴포넌트 맵을 만든다.
 *
 * `idPrefix` 가 필요한 이유 (2026-08-09): 한 페이지에 여러 MDX 를 이어 붙이면 h2 id 가 충돌한다.
 * 프롬프트 30편은 소제목이 "언제 쓰나 / 사용법 / 사용 예시 / 팁"으로 27편이 동일했고,
 * 허브로 묶는 순간 한 페이지에 같은 id 가 9개씩 생겼다(HTML 무효 + 앵커가 첫 번째로만 간다).
 * 개별 페이지였을 땐 드러나지 않던 문제라, 묶는 쪽이 접두어를 줘야 한다.
 */
export function createMdxComponents(idPrefix = ""): MDXComponents {
  const withPrefix = (id: string) => (id ? (idPrefix ? `${idPrefix}--${id}` : id) : undefined);

  return {
  h2: ({ children, ...props }) => {
    const id = withPrefix(slugify(headingTextFromNode(children)));
    return (
      <h2 id={id} className="mt-10 scroll-mt-24 text-2xl font-semibold text-ink" {...props}>
        {children}
      </h2>
    );
  },
  h3: (props) => <h3 className="mt-8 text-xl font-semibold text-ink" {...props} />,
  p: (props) => <p className="my-4 leading-8 text-body" {...props} />,
  ul: (props) => <ul className="my-5 list-disc space-y-2 pl-6 leading-8 text-body" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-2 pl-6 leading-8 text-body" {...props} />,
  a: ({ href = "", ...props }) => {
    if (href.startsWith("/")) {
      return <Link href={href} className="font-medium text-accent underline underline-offset-4" {...props} />;
    }

    return (
      <a
        href={href}
        className="font-medium text-accent underline underline-offset-4"
        rel="noreferrer"
        target="_blank"
        {...props}
      />
    );
  },
  code: (props) => <code className="rounded bg-panel2 px-1.5 py-0.5 text-sm text-ink" {...props} />,
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-line bg-neutral-950 p-4 text-sm leading-7 text-neutral-100"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-left text-sm leading-6 text-body" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-panel2 text-ink" {...props} />,
  tr: (props) => <tr className="border-b border-line last:border-b-0" {...props} />,
  th: (props) => <th className="px-4 py-2.5 font-semibold text-ink" {...props} />,
  td: (props) => <td className="px-4 py-2.5 align-top text-body" {...props} />,
  // 본문에서 쓰는 커스텀 블록. 숫자를 MDX 에 손으로 적는 대신 데이터를 읽어 그린다 —
  // 손으로 적으면 lib/models.ts 의 갱신 규율과 이중 진실원이 된다(ModelPriceTable 주석 참조).
  ModelPriceTable
  };
}

/** 접두어 없는 기본 맵 — 한 페이지에 MDX 가 하나뿐인 상세 페이지들이 쓴다. */
export const mdxComponents: MDXComponents = createMdxComponents();
