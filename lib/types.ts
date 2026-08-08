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
  // firsthand: 이 글이 **우리가 직접 돌리고 잰 것**인가. 모델의 일반 지식이 아니라 1차 자료라는 뜻이다.
  // /about 의 「직접 돌려 본 기록」 목록이 이 플래그에서 파생되므로, 손으로 관리하는 목록이 없다.
  // 함부로 켜지 마라 — 이 사이트에서 검증 가능한 근거를 가진 글이 어느 것인지 알리는 신호이고,
  // 남발하면 그 신호가 죽는다. 기준: 우리 자신의 로그·측정·실행 결과가 본문의 뼈대일 것.
  firsthand?: boolean;
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
