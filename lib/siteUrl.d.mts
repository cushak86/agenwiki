// lib/siteUrl.mjs 의 타입 선언.
//
// .mjs 로 둔 이유는 그 파일 머리말에 있다 — next.config.mjs 와 scripts/*.mjs 가 .ts 를 import 할 수 없어서다.
// 대신 TypeScript 는 .mjs 의 타입을 모르므로(implicitly any) 선언이 필요하다. 이 파일이 그 한 줄이다.
export declare const SITE_URL: string;
