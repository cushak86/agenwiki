// Stibee 호스티드 구독 페이지로 링크한다. 구독 입력은 Stibee 페이지에서 처리한다.
// 공개 페이지 URL이므로 기본값으로 두고, 필요 시 NEXT_PUBLIC_SUBSCRIBE_URL로 덮어쓴다.
const DEFAULT_SUBSCRIBE_URL = "https://page.stibee.com/subscriptions/503936";

export function SubscribeForm() {
  const subscribeUrl = process.env.NEXT_PUBLIC_SUBSCRIBE_URL || DEFAULT_SUBSCRIBE_URL;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-5 md:flex-row md:items-center">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-ink">뉴스레터 구독</h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          AI 에이전트, 도구, 프롬프트 업데이트를 정리해 보냅니다.
        </p>
      </div>
      <a
        href={subscribeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-white transition hover:bg-teal-800"
      >
        구독하기
      </a>
    </div>
  );
}
