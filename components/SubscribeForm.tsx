export function SubscribeForm() {
  const subscribeUrl = process.env.NEXT_PUBLIC_SUBSCRIBE_URL;

  return (
    <form
      action={subscribeUrl || undefined}
      method="post"
      className="flex flex-col gap-3 rounded-lg border border-line bg-white p-5 md:flex-row md:items-center"
    >
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-ink">뉴스레터 구독</h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          AI 에이전트, 도구, 프롬프트 업데이트를 정리해 보냅니다.
        </p>
      </div>
      <input
        type="email"
        name="email"
        required
        disabled={!subscribeUrl}
        placeholder="email@example.com"
        className="h-11 rounded-md border border-line px-3 text-sm outline-none transition focus:border-accent disabled:bg-neutral-100"
      />
      <button
        type="submit"
        disabled={!subscribeUrl}
        className="h-11 rounded-md bg-accent px-5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        title={!subscribeUrl ? "NEXT_PUBLIC_SUBSCRIBE_URL 설정 후 활성화됩니다." : undefined}
      >
        구독
      </button>
      {/* TODO: 외부 ESP(Stibee/Buttondown 등) action URL을 NEXT_PUBLIC_SUBSCRIBE_URL에 연결한다. */}
    </form>
  );
}
