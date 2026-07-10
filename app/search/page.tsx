import { SearchClient } from "@/components/SearchClient";
import { getSearchIndex } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = {
  ...buildMetadata({
    title: "검색",
    description: "agenwiki의 가이드, 용어사전, 프롬프트, 뉴스레터를 한 번에 검색합니다.",
    pathname: "/search"
  }),
  // 검색 결과는 클라이언트 상태로만 표현되고(고유 쿼리 URL 없음) 기존 목록/토픽
  // 페이지와 내용이 중복되므로 색인 대상에서 제외한다. 페이지 자체는 접근 가능하도록 유지.
  robots: {
    index: false,
    follow: true
  }
};

export default function SearchPage() {
  const items = getSearchIndex();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">검색</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">
        가이드, 용어사전, 프롬프트, 뉴스레터 전체를 제목·설명·태그 기준으로 검색합니다.
      </p>
      <div className="mt-8">
        <SearchClient items={items} />
      </div>
    </div>
  );
}
