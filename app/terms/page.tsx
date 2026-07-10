import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "약관",
  description: "agenwiki 이용약관",
  pathname: "/terms"
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">약관</h1>
      <p className="mt-4 leading-8 text-muted">서비스 약관 문서는 추후 확정합니다.</p>
    </div>
  );
}
