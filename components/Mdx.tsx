import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { createMdxComponents, mdxComponents } from "@/components/mdx-components";

/**
 * @param idPrefix 한 페이지에 MDX 를 여러 개 이어 붙일 때 h2 id 충돌을 막는 접두어.
 *   프롬프트 허브가 그렇다 — 27편의 소제목이 글자까지 같아 접두어 없이는 id 가 9개씩 겹친다.
 *   상세 페이지처럼 MDX 가 하나뿐이면 넘기지 않는다(접두어 없는 깔끔한 앵커가 유지된다).
 */
export function Mdx({ source, idPrefix }: { source: string; idPrefix?: string }) {
  return (
    <MDXRemote
      source={source}
      components={idPrefix ? createMdxComponents(idPrefix) : mdxComponents}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
    />
  );
}
