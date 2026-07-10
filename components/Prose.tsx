import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return <article className="prose-shell">{children}</article>;
}
