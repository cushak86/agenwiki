# agenwiki Content Pipeline

This is a semi-manual content pipeline (fetch → generate → format validation → publish). It does not call an LLM API; the orchestrator worker is the LLM seam. There is no review step — see "Reality vs. design intent" below.

**Sources**: arXiv API (`fetch_arxiv.py`) and content-carrying / CC-licensed RSS-Atom feeds (`fetch_rss.py`). Feed-provided content only — no HTML full-text scraping.

**Content types** (`--type`): `guides`, `glossary`, `prompts`, `newsletter`. Prompts per type: `a_model_guide.md`, `a_model_blog.md`, `glossary_term.md`, `prompt_entry.md`, `newsletter_issue.md`.

## ⚠️ Reality vs. design intent

Sections below describe the pipeline **as designed**. Where design and reality differ,
reality is stated here. Do not cite this file as evidence of what the pipeline does.

**What actually runs**: fetch → LLM draft → `publish.py` format validation → publish.

`publish.py` validates the frontmatter schema, requires `draft: false`, refuses to
overwrite an existing slug, and runs `npm run build`. For `--type guides` only, it also
checks that a line matching `^> 출처:.*https?://` exists.

**What does NOT run**: nothing verifies factual accuracy. Nothing checks that source URLs
resolve, that quotes match the original, or that the source block matches the content.
The `guides`-only source check is a string-presence test, not source verification —
any URL passes. `glossary`, `prompts`, and `newsletter` get no source check at all.
**No human fact-check gate is enforced anywhere in this repo.** `draft: false` is a flag
a script sets, not evidence that a person read the draft.

As of 2026-07-16, 12 of 59 published pieces carry a source block
(guides 12/28, glossary 0/19, prompts 0/8, newsletter 0/4). 16 guides in `content/guides/`
have no source block and therefore could not have passed `validate_source_block` —
they bypassed `publish.py` or predate the check.

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

3. Format validation (automated — NOT a review).

   `publish.py` checks frontmatter schema, slug/date validity, `draft: false`, slug
   collision, and (guides only) source-block presence. It does not read the content.

   **Design intent, not implemented**: a human fact-check seam at this point — checking
   hallucination, copyright risk, and source attribution — was the original design. No code
   enforces it and it is not part of current operation. Treat it as a proposal.

4. Publish after format validation:

   ```powershell
   python scripts/pipeline/publish.py <slug>
   ```

   The publisher validates frontmatter, requires `draft: false`, moves the file to `content/guides/`, runs `npm run build`, sends a best-effort Discord publish message through the shared adapter, commits with `suhun.lee59@gmail.com`, and prints `git push`. It only pushes when `--push` is explicitly passed. For `--type guides` only, it also checks that a source-block line exists — a string-presence test, not source verification (any URL passes; it is not arXiv-specific despite the error message). `npm run build` is a syntax/route sanity check; it does not validate factual accuracy or copyright safety.

## Scheduling the fetch step (optional)

`scheduled_fetch.py` runs the configured sources to fill the queue. It automates
**ingestion only** — generation and publish stay manual seams. (There is no review seam;
a person invokes them, but nothing requires that person to have read the draft.)

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

- `publish.py` must be invoked by a person, but nothing requires that person to have read
  the draft. The pipeline is not unattended, but it is not reviewed either — do not
  describe it as human-reviewed.
- Sources are arXiv + feed-provided content only. No HTML full-text scraping (copyright/dependency reasons). Prefer low-risk sources: official APIs, press releases, CC-licensed or content-carrying feeds.
- On a fresh Windows Python install, TLS may fail if Python cannot find a CA bundle. Set `SSL_CERT_FILE` to a CA bundle (e.g. Git for Windows `ca-bundle.crt`, or a `certifi` bundle) before fetching; `scheduled_fetch.py` auto-detects the Git bundle.
- `publish.py` supports `--type guides|glossary|prompts|newsletter`. Frontmatter arrays may be inline (`["a","b"]`) or multiline. Use `--skip-build` to batch-publish, then run `npm run build` once.
- `npm run build` is a syntax/route sanity check; it does not validate factual accuracy or copyright safety.
- Discord webhook logic is not implemented here; `MULTIAGENT_ROOT` points to the existing shared adapter and defaults to `C:\agents\multi-agent`.

## IndexNow submission (`indexnow-submit.mjs`)

`scripts/indexnow-submit.mjs` pushes every URL in the **live** `sitemap.xml` to IndexNow in
one request, so participating engines pick up new and changed pages without waiting for a
crawl.

**Google does not support IndexNow.** This script reaches Bing, Naver, Yandex and Seznam
only. For Google you still have to request indexing by hand, one URL at a time, in Google
Search Console → URL Inspection → Request Indexing. Do not treat a successful IndexNow
submission as evidence that Google was notified.

**Deploy first, then submit.** IndexNow proves ownership by fetching a key file at
`https://agenwiki.online/<key>.txt`. The script verifies that file itself before submitting
and aborts with a non-zero exit if it is not HTTP 200 with the key as its exact body. So the
order is: commit `public/<key>.txt` → deploy to production → run the script. Running it
before the deploy lands aborts at the key check — that is the intended behaviour, not a bug.

Dry run first — it prints the URL list and the exact JSON payload without submitting:

```bash
npm run indexnow -- --dry
```

Then submit for real:

```bash
npm run indexnow
```

HTTP 200 (accepted) and 202 (accepted, key verification pending) count as success; anything
else exits non-zero.

Run this **when content actually changed**, not habitually after every deploy. The script
submits the whole sitemap each time, and IndexNow asks publishers to send changed or new URLs
only — repeated full-list submissions can get deprioritised. The script also aborts when the
sitemap's host differs from `BASE`, which is what a half-finished domain switch looks like.

The site address comes from `process.env.NEXT_PUBLIC_SITE_URL ?? "https://agenwiki.online"`,
duplicating the fallback in `lib/seo.ts` because a `.mjs` script cannot import the `.ts`
source of truth. **Change the domain in both places.** The script also aborts if the key file
request gets redirected, which catches the `agenwiki.vercel.app` → `agenwiki.online` 308 in
`next.config.mjs` — submitting under an alias host would send a `host`/`keyLocation` pair
that does not match the canonical site.
