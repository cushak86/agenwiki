import Link from "next/link";

export function TagChips({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/topics/${encodeURIComponent(tag)}`}
          className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted transition hover:border-accent hover:text-accent"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
