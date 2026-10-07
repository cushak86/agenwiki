import { getCollection } from 'astro:content';
import { catOf } from '../site.config';

// 검색 페이지용 정적 인덱스 (빌드 때 생성)
export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const items = posts.map((p) => {
    const c = catOf(p.data.category);
    return {
      slug: p.id,
      title: p.data.title,
      description: p.data.description,
      cat: c.label,
      color: c.color,
      art: c.art,
      text: [p.data.title, p.data.description, p.data.keyword, ...p.data.tags, c.label].join(' ').toLowerCase(),
    };
  });
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
