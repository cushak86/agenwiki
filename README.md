# agenwiki

Korean AI knowledge base built with Next.js 14 App Router, Tailwind CSS, and MDX files under `content/`.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` for local overrides.

- `NEXT_PUBLIC_SITE_URL`: canonical site origin used by metadata, sitemap, robots, and RSS.
- `NEXT_PUBLIC_SUBSCRIBE_URL`: external newsletter form action. Leave empty to render the disabled subscription stub.

## Content

Content lives in `content/{guides,glossary,prompts,newsletter}/*.mdx`.

The loader validates frontmatter at build time. Each file's `slug` must match its filename without `.mdx`.

## Build

```bash
npm run build
```

## Deployment

The project is Vercel-ready through the default Next.js framework detection. Set the public environment variables above in Vercel before production deployment.
