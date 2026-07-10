You are writing agenwiki newsletter issue 1 as a complete MDX file.

Input:
- Recent guides list: {{RECENT_GUIDES}}

Return only the finished `.mdx` content. Do not wrap it in code fences. Do not add commentary before or after the MDX.

Frontmatter requirements:
- Include opening and closing `---`.
- `title`: non-empty string.
- `slug`: ASCII lowercase slug using only letters, numbers, and hyphens.
- `issueNumber`: `1`.
- `summary`: one concise sentence summarizing the issue.
- `tags`: array with at least one useful tag.
- `publishedAt`: `"2026-07-10"`.
- `draft`: `true`.

Content requirements:
- Summarize recently published agenwiki guides from `{{RECENT_GUIDES}}`.
- Introduce each guide in 1-2 sentences.
- Include an internal link for each guide in the form `/guides/<slug>`.
- Keep the issue concise and editorial, not promotional.
- Do not include a source block because this newsletter summarizes agenwiki content.

