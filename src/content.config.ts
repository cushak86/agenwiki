import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 프론트매터를 빌드 시점에 검증한다. 형식이 틀리면 빌드가 실패 → 발행 사고 방지.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(15).max(65),
    description: z.string().min(60).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // 본문 수치를 공식 자료와 마지막으로 대조한 날짜
    verifiedDate: z.coerce.date(),
    // 신청 마감일이 정해진 제도만 (홈 '마감이 다가오는 지원금'에 노출)
    deadline: z.coerce.date().optional(),
    deadlineLabel: z.string().optional(),
    category: z.enum(['income', 'finance', 'business', 'welfare']),
    keyword: z.string().min(2),            // 메인 키워드
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    pillar: z.boolean().default(false),
    // 글 상단 "한눈에 보기" 요약 박스 (지원 대상 / 지원 내용 / 신청 기간)
    summary: z.object({
      target: z.string().min(5),
      benefit: z.string().min(5),
      period: z.string().min(2),
    }),
    // 관할 기관과 공식 문의처
    agency: z.object({
      name: z.string().min(2),
      phone: z.string().optional(),
      url: z.string().url(),
    }),
    // 본문 수치의 근거가 된 공식 자료 (최소 2개)
    sources: z
      .array(z.object({ name: z.string().min(2), url: z.string().url() }))
      .min(2),
  }),
});

export const collections = { posts };


