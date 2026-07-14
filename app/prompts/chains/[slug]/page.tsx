import { notFound } from "next/navigation";
import { PromptChainSteps } from "@/components/PromptChainSteps";
import { CHAINS, getChain } from "@/lib/chains";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return CHAINS.map((chain) => ({ slug: chain.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const chain = getChain(params.slug);

  if (!chain) {
    return {};
  }

  return buildMetadata({
    title: chain.title,
    description: chain.description,
    pathname: `/prompts/chains/${chain.slug}`
  });
}

export default function PromptChainPage({ params }: { params: { slug: string } }) {
  const chain = getChain(params.slug);

  if (!chain) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">프롬프트 체인</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{chain.title}</h1>
        <p className="mt-4 leading-8 text-muted">{chain.description}</p>
      </div>
      <div className="mt-10 max-w-3xl">
        <PromptChainSteps slug={chain.slug} steps={chain.steps} />
      </div>
    </div>
  );
}
