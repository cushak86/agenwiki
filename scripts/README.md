# agenwiki Content Pipeline

This MVP is a semi-manual arXiv-to-guide pipeline. It does not call an LLM API; the orchestrator worker is the LLM seam.

## Manual Operation

1. Fetch arXiv metadata:

   ```powershell
   python scripts/pipeline/fetch_arxiv.py --category cs.AI --max 3
   ```

   New items are written to `scripts/queue/*.json`. Seen arXiv IDs are stored in `scripts/state/seen.json`, so reruns dedupe.

2. Manual seam #1: generate a draft MDX guide.

   Give one queue JSON file and `scripts/prompts/a_model_guide.md` to the orchestrator worker. The worker writes `scripts/staging/<slug>.mdx` with `draft: true`. Do not add LLM API code to this repo.

3. Manual seam #2: review the staged draft.

   A human checks the staged MDX for hallucination, copyright risk, title/slug quality, and source attribution. Set `draft: false` only after approval; otherwise Next will exclude the guide route. Discord notification is one-way only and does not approve content.

4. Publish after review:

   ```powershell
   python scripts/pipeline/publish.py <slug>
   ```

   The publisher validates frontmatter and the arXiv source block, requires `draft: false`, moves the file to `content/guides/`, runs `npm run build`, sends a best-effort Discord publish message through the shared adapter, commits with `suhun.lee59@gmail.com`, and prints `git push`. It only pushes when `--push` is explicitly passed. `npm run build` is a syntax/route sanity check; it does not validate factual accuracy or copyright safety.

## Caveats

- Fully unattended publishing is intentionally unsupported.
- The only network source in this MVP is the arXiv API.
- On a fresh Windows Python install, TLS may fail if Python cannot find a CA bundle. Install/update `certifi` and set `SSL_CERT_FILE` to the certifi bundle path before fetching.
- `publish.py` supports `guides` for the MVP.
- Discord webhook logic is not implemented here; `MULTIAGENT_ROOT` points to the existing shared adapter and defaults to `C:\agents\multi-agent`.
