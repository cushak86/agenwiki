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
  // 이 용어를 깊게 다룬 guides 슬러그. 용어 페이지에서 본문 상단 링크로 노출한다.
  // 짧은 정의(용어)와 두꺼운 해설(가이드)이 같은 검색어를 두고 서로 잠식하지 않도록,
  // 어느 쪽이 정본인지 방문자와 검색엔진 모두에게 알리는 것이 목적이다. 없어도 된다.
  guide?: string;
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
  excerpt: string;
};
