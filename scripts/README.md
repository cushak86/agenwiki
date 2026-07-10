# agenwiki Content Pipeline

This is a semi-manual content pipeline (fetch → generate → review → publish). It does not call an LLM API; the orchestrator worker is the LLM seam.

**Sources**: arXiv API (`fetch_arxiv.py`) and content-carrying / CC-licensed RSS-Atom feeds (`fetch_rss.py`). Feed-provided content only — no HTML full-text scraping.

**Content types** (`--type`): `guides`, `glossary`, `prompts`, `newsletter`. Prompts per type: `a_model_guide.md`, `a_model_blog.md`, `glossary_term.md`, `prompt_entry.md`, `newsletter_issue.md`.

## Manual Operation

1. Fetch arXiv metadata:

   ```powershell
   python scripts/pipeline/fetch_arxiv.py --category cs.AI --max 3
   ```

   New items are written to `scripts/queue/*.json`. Seen arXiv IDs are stored in `scripts/state/seen.json`, so reruns dedupe.

   RSS/Atom feeds can also be queued without extra dependencies:
   `python scripts/pipeline/fetch_rss.py --feed https://example.com/feed.xml --max 3 --source-name "Example Blog"`.
   Use `scripts/prompts/a_model_blog.md`; only use feed-provided content, rewrite transformatively, and keep source attribution.

2. Manual seam #1: generate a draft MDX guide.

   Give one queue JSON file and `scripts/prompts/a_model_guide.md` to the orchestrator worker. The worker writes `scripts/staging/<slug>.mdx` with `draft: true`. Do not add LLM API code to this repo.

3. Manual seam #2: review the staged draft.

   A human checks the staged MDX for hallucination, copyright risk, title/slug quality, and source attribution. Set `draft: false` only after approval; otherwise Next will exclude the guide route. Discord notification is one-way only and does not approve content.

4. Publish after review:

   ```powershell
   python scripts/pipeline/publish.py <slug>
   ```

   The publisher validates frontmatter and the arXiv source block, requires `draft: false`, moves the file to `content/guides/`, runs `npm run build`, sends a best-effort Discord publish message through the shared adapter, commits with `suhun.lee59@gmail.com`, and prints `git push`. It only pushes when `--push` is explicitly passed. `npm run build` is a syntax/route sanity check; it does not validate factual accuracy or copyright safety.

## Scheduling the fetch step (optional)

`scheduled_fetch.py` runs the configured sources to fill the queue. It automates
**ingestion only** — generation, review, and publish stay manual seams.

```powershell
copy scripts\pipeline\sources.example.json scripts\pipeline\sources.json   # then edit
python scripts\pipeline\scheduled_fetch.py
```

Register it with Windows Task Scheduler (daily 09:00):

```powershell
schtasks /create /tn "agenwiki-fetch" /tr "python C:\agents\agenwiki\scripts\pipeline\scheduled_fetch.py" /sc daily /st 09:00
```

cron equivalent: `0 9 * * * python /path/to/scripts/pipeline/scheduled_fetch.py`

`sources.json` (gitignored, user-specific) lists arXiv categories and RSS feeds; see `sources.example.json`.

## Caveats

- Fully unattended publishing is intentionally unsupported; the scheduler fills the queue but does not generate or publish.
- Sources are arXiv + feed-provided content only. No HTML full-text scraping (copyright/dependency reasons). Prefer low-risk sources: official APIs, press releases, CC-licensed or content-carrying feeds.
- On a fresh Windows Python install, TLS may fail if Python cannot find a CA bundle. Set `SSL_CERT_FILE` to a CA bundle (e.g. Git for Windows `ca-bundle.crt`, or a `certifi` bundle) before fetching; `scheduled_fetch.py` auto-detects the Git bundle.
- `publish.py` supports `--type guides|glossary|prompts|newsletter`. Frontmatter arrays may be inline (`["a","b"]`) or multiline. Use `--skip-build` to batch-publish, then run `npm run build` once.
- `npm run build` is a syntax/route sanity check; it does not validate factual accuracy or copyright safety.
- Discord webhook logic is not implemented here; `MULTIAGENT_ROOT` points to the existing shared adapter and defaults to `C:\agents\multi-agent`.
