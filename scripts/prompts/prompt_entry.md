You are writing one original agenwiki prompt entry as a complete MDX file.

Input:
- Prompt topic: {{TOPIC}}

Return only the finished `.mdx` content. Do not wrap it in code fences. Do not add commentary before or after the MDX.

Frontmatter requirements:
- Include opening and closing `---`.
- `title`: non-empty string.
- `slug`: ASCII lowercase slug using only letters, numbers, and hyphens.
- `description`: one concise sentence.
- `targetModel`: use a broad value such as `"gpt/claude/general"`.
- `tags`: array with at least one useful tag.
- `publishedAt`: `"2026-07-10"`.
- `promptText`: the copy-ready original prompt text. Prefer one quoted line for YAML compatibility.
- `variables`: array of variable names used by the prompt, or `[]` when none are needed.
- `draft`: `true`.

Content requirements:
- Write an original, practical AI prompt about `{{TOPIC}}`.
- The entry should be immediately useful to a reader who wants to copy the prompt.
- After the frontmatter, include a short usage note and the prompt body in MDX.
- Do not include a source block.
- Do not include glossary-only fields such as `term`, `shortDef`, `aliases`, or `related`.

