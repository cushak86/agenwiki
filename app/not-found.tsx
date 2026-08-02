import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start px-4 py-24">
      <p className="text-sm font-bold uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 max-w-xl leading-8 text-muted">
        주소가 바뀌었거나 삭제된 페이지입니다. 찾으시는 내용은 검색이나 아래 목록에서 다시 찾을 수
        있습니다.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-lg bg-accentDeep px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent"
        >
          홈으로
        </Link>
        <Link
          href="/search"
          className="rounded-lg border border-line bg-panel px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-accent"
        >
          검색하기
        </Link>
        <Link
          href="/guides"
          className="rounded-lg border border-line bg-panel px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-accent"
        >
          가이드 목록
        </Link>
      </div>
    </div>
  );
}
