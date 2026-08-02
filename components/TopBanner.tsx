"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DISMISS_KEY = "banner-store-dismissed";

/**
 * 전 페이지 상단 스토어 배너.
 * 모바일에서는 한 줄로 축약하고, 닫기 버튼을 제공한다(세션 동안 유지).
 * 첫 화면의 크롬 비중을 줄이기 위한 조치 — 헤더가 sticky 라 배너까지 크면 본문이 밀린다.
 */
export function TopBanner() {
  // SSR 은 배너를 렌더한다 — 닫은 적 있는 사용자에게만 마운트 후 숨긴다.
  // (반대로 하면 모든 방문자가 배너 팝인 레이아웃 시프트를 겪는다.)
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  if (dismissed) {
    return null;
  }

  return (
    <div className="flex items-center bg-accentDeep text-white">
      <Link
        href="/store"
        className="block min-w-0 flex-1 truncate px-4 py-2.5 text-center text-sm font-medium transition hover:opacity-90"
      >
        <span className="sm:hidden">📕 428커밋의 기록이 상품이 됐습니다 →</span>
        <span className="hidden sm:inline">
          📕 이 사이트를 굴린 428커밋의 기록이 상품이 됐습니다 — 전자책·스타터 키트 보기 →
        </span>
      </Link>
      <button
        type="button"
        aria-label="배너 닫기"
        onClick={() => {
          window.sessionStorage.setItem(DISMISS_KEY, "1");
          setDismissed(true);
        }}
        className="flex h-10 w-10 shrink-0 items-center justify-center text-white/80 transition hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
