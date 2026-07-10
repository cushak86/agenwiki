export type ContentType = "guides" | "glossary" | "prompts" | "newsletter";

export type BaseMeta = {
  slug: string;
  tags: string[];
  draft?: boolean;
};

export type GuideMeta = BaseMeta & {
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  cover?: string;
};

export type GlossaryMeta = BaseMeta & {
  term: string;
  aliases: string[];
  shortDef: string;
  category: string;
  updatedAt: string;
  related?: string[];
};

export type PromptMeta = BaseMeta & {
  title: string;
  description: string;
  targetModel: string;
  publishedAt: string;
  promptText: string;
  variables?: string[];
};

export type NewsletterMeta = BaseMeta & {
  title: string;
  issueNumber: number;
  publishedAt: string;
  summary: string;
};

export type ContentMeta = GuideMeta | GlossaryMeta | PromptMeta | NewsletterMeta;

export type ContentRecord<TMeta extends ContentMeta = ContentMeta> = {
  meta: TMeta;
  body: string;
};

export type TaggedContent = {
  type: ContentType;
  meta: ContentMeta;
};

export type SearchItem = {
  type: ContentType;
  slug: string;
  title: string;
  description: string;
  tags: string[];
};
