"""Scheduled fetch wrapper for the agenwiki content pipeline.

Automates ONLY the ingestion (fetch) step: it fills scripts/queue/ from the
sources listed in a config file. Generation (LLM = orchestrator worker), review
(Discord, one-way), and publish stay manual human-in-the-loop seams by design —
this wrapper never generates or publishes anything.

Meant to be invoked by Windows Task Scheduler or cron (see scripts/README.md).
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

PIPELINE_DIR = Path(__file__).resolve().parent

# Force UTF-8 so Korean/emoji fetch output doesn't crash on a cp1252 console.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass


def resolve_ssl_env():
    """Return an env dict with SSL_CERT_FILE set if needed.

    Fresh Windows Python installs ship without a CA bundle usable by urllib,
    so HTTPS fetches fail with CERTIFICATE_VERIFY_FAILED. If SSL_CERT_FILE is
    already set we keep it; otherwise fall back to Git for Windows' CA bundle.
    """
    env = dict(os.environ)
    if env.get("SSL_CERT_FILE"):
        return env
    for candidate in (
        r"C:\Program Files\Git\mingw64\ssl\certs\ca-bundle.crt",
        r"C:\Program Files\Git\usr\ssl\certs\ca-bundle.crt",
        "/usr/ssl/certs/ca-bundle.crt",
    ):
        if Path(candidate).exists():
            env["SSL_CERT_FILE"] = candidate
            break
    return env


def load_config(path):
    if not path.exists():
        example = PIPELINE_DIR / "sources.example.json"
        print(f"[warn] config not found at {path}; using {example.name}")
        path = example
    if not path.exists():
        raise SystemExit(f"no sources config found (looked for {path})")
    return json.loads(path.read_text(encoding="utf-8"))


def run_fetch(script, args, env):
    cmd = [sys.executable, str(PIPELINE_DIR / script), *args]
    print(f"[run] {script} {' '.join(args)}")
    completed = subprocess.run(
        cmd, cwd=str(PIPELINE_DIR), env=env,
        encoding="utf-8", errors="replace", capture_output=True,
    )
    tail = ((completed.stdout or "") + (completed.stderr or "")).strip().splitlines()
    for line in tail[-6:]:
        print("   " + line)
    return completed.returncode == 0


def main():
    parser = argparse.ArgumentParser(description="Run configured fetch sources to fill the queue.")
    parser.add_argument("--config", default=str(PIPELINE_DIR / "sources.json"))
    args = parser.parse_args()

    config = load_config(Path(args.config))
    env = resolve_ssl_env()

    ok, fail = 0, 0
    for src in config.get("arxiv", []):
        fa = ["--category", str(src["category"]), "--max", str(src.get("max", 5))]
        if src.get("since"):
            fa += ["--since", str(src["since"])]
        if run_fetch("fetch_arxiv.py", fa, env):
            ok += 1
        else:
            fail += 1

    for src in config.get("rss", []):
        fr = ["--feed", str(src["feed"]), "--max", str(src.get("max", 3))]
        if src.get("source_name"):
            fr += ["--source-name", str(src["source_name"])]
        if run_fetch("fetch_rss.py", fr, env):
            ok += 1
        else:
            fail += 1

    print(json.dumps({"sources_ok": ok, "sources_failed": fail}, ensure_ascii=False))
    # fail-soft: a bad source must not abort the whole scheduled run
    sys.exit(0)


if __name__ == "__main__":
    main()
