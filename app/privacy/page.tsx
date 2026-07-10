import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "개인정보",
  description: "agenwiki 개인정보 처리방침",
  pathname: "/privacy"
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">개인정보</h1>
      <p className="mt-4 leading-8 text-muted">개인정보 처리방침 문서는 추후 확정합니다.</p>
    </div>
  );
}
