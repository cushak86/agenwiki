import Link from "next/link";
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="mt-10 text-2xl font-semibold text-ink" {...props} />,
  h3: (props) => <h3 className="mt-8 text-xl font-semibold text-ink" {...props} />,
  p: (props) => <p className="my-4 leading-8 text-neutral-700" {...props} />,
  ul: (props) => <ul className="my-5 list-disc space-y-2 pl-6 leading-8 text-neutral-700" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-2 pl-6 leading-8 text-neutral-700" {...props} />,
  a: ({ href = "", ...props }) => {
    if (href.startsWith("/")) {
      return <Link href={href} className="font-medium text-accent underline underline-offset-4" {...props} />;
    }

    return (
      <a
        href={href}
        className="font-medium text-accent underline underline-offset-4"
        rel="noreferrer"
        target="_blank"
        {...props}
      />
    );
  },
  code: (props) => <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm text-ink" {...props} />,
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-line bg-neutral-950 p-4 text-sm leading-7 text-neutral-100"
      {...props}
    />
  )
};
