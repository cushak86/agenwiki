import type { ReactNode } from "react";

/**
 * 텍스트를 앵커 id로 변환한다. 한글 등 유니코드 문자를 보존하면서
 * 공백은 하이픈으로, URL 프래그먼트에 부적합한 기호는 제거한다.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFC")
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * MDX 헤딩처럼 문자열/숫자/배열/React 엘리먼트가 섞인 children에서
 * 표시용 순수 텍스트만 뽑아낸다(앵커 id 생성용).
 */
export function headingTextFromNode(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(headingTextFromNode).join("");
  }

  if (typeof node === "object" && "props" in (node as { props?: { children?: ReactNode } })) {
    return headingTextFromNode((node as { props?: { children?: ReactNode } }).props?.children);
  }

  return "";
}
