"use client";

import { track } from "@vercel/analytics";
import { useState, type FormEvent } from "react";

// Stibee 구독 API 엔드포인트(공개 폼용). 이메일을 x-www-form-urlencoded로 POST하면
// Stibee가 구독을 접수하고 확인 메일(더블 옵트인)을 발송한다. CORS 허용됨(Access-Control-Allow-Origin: *).
const SUBSCRIBE_ENDPOINT =
  "https://stibee.com/api/v1.0/lists/0GNODHMz0if-k0uvUE8Q6zw_alMCHg==/public/subscribers";

type Status = "idle" | "loading" | "success" | "error";

export function SubscribeForm({
  heading = "뉴스레터 구독",
  description = "AI 에이전트, 도구, 프롬프트 업데이트를 정리해 보냅니다.",
  source = "newsletter"
}: {
  heading?: string;
  description?: string;
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed) {
      setStatus("error");
      setMessage("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(SUBSCRIBE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}`
      });
      const text = await res.text();
      if (text.includes("@ERROR_MSG:")) {
        const msg = text.split("@ERROR_MSG:")[1].split("-->")[0].trim();
        setStatus("error");
        setMessage(msg || "구독에 실패했습니다. 이메일 주소를 확인해 주세요.");
      } else {
        setStatus("success");
        setMessage(
          "구독 신청이 접수되었습니다. 메일함으로 보내드린 확인 메일의 링크를 눌러 구독을 완료해 주세요. (메일이 없으면 스팸함도 확인해 주세요.)"
        );
        track("subscribe_submit", { source });
        setEmail("");
        setAgreed(false);
      }
    } catch {
      setStatus("error");
      setMessage("일시적인 오류로 구독하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-5">
      <h2 className="text-lg font-semibold text-ink">{heading}</h2>
      <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="email@example.com"
          className="h-11 flex-1 rounded-md border border-line px-3 text-sm outline-none transition focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 shrink-0 rounded-md bg-accent px-5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {status === "loading" ? "구독 중…" : "구독"}
        </button>
      </div>
      <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-0.5 shrink-0"
        />
        <span>
          (필수) 뉴스레터 발송을 위한 개인정보(이메일) 수집 및 이용에 동의합니다. 수집한 정보는 발송 외
          목적으로 사용하지 않으며, 구독을 해지하면 즉시 파기됩니다.
        </span>
      </label>
      {status === "success" || status === "error" ? (
        <p
          role="status"
          className={`mt-3 text-sm leading-6 ${status === "success" ? "text-accent" : "text-red-600"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
