import type { GlossaryMeta } from "@/lib/types";
import { ContentCard } from "@/components/ContentCard";

function groupKey(term: string) {
  const first = term.trim().charAt(0);
  return first ? first.toUpperCase() : "#";
}

export function GlossaryIndex({ items }: { items: GlossaryMeta[] }) {
  const groups = items.reduce<Record<string, GlossaryMeta[]>>((acc, item) => {
    const key = groupKey(item.term);
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      {Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b, "ko"))
        .map(([key, terms]) => (
          <section key={key} className="space-y-4">
            <h2 className="border-b border-line pb-2 text-2xl font-semibold text-ink">{key}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {terms.map((term) => (
                <ContentCard key={term.slug} type="glossary" meta={term} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
