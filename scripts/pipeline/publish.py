import argparse
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime

# Windows consoles/pipes default to cp1252, which cannot encode build output
# (e.g. Next.js "▲") or Korean slugs/messages. Force UTF-8 for all prints.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

from config import (
    DISCORD_ADAPTER,
    GIT_AUTHOR_EMAIL,
    GIT_AUTHOR_NAME,
    REPO_ROOT,
    STAGING_DIR,
    ensure_pipeline_dirs,
)


SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
SOURCE_BLOCK_RE = re.compile(r"(?m)^>\s*출처:\s*arXiv:\S+\s+https?://(?:www\.)?arxiv\.org/(?:abs|pdf)/\S+\s*$")
CONTENT_TYPES = {"guides", "glossary", "prompts", "newsletter"}


def fail(message):
    raise SystemExit(message)


def resolve_required_executable(name):
    executable = shutil.which(name)
    if not executable:
        fail(f"{name}: executable not found on PATH")
    return executable


def resolve_optional_executable(name):
    return shutil.which(name)


def parse_scalar(value):
    value = value.strip()
    if value in {"true", "false"}:
        return value == "true"
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def parse_frontmatter(path):
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        fail(f"{path}: missing frontmatter opening ---")
    try:
        end = next(index for index in range(1, len(lines)) if lines[index].strip() == "---")
    except StopIteration:
        fail(f"{path}: missing frontmatter closing ---")

    data = {}
    index = 1
    while index < end:
        line = lines[index]
        if not line.strip():
            index += 1
            continue
        if ":" not in line or line.startswith(" "):
            fail(f"{path}: unsupported frontmatter line: {line}")
        key, raw_value = line.split(":", 1)
        key = key.strip()
        raw_value = raw_value.strip()
        if raw_value:
            data[key] = parse_scalar(raw_value)
            index += 1
            continue

        values = []
        index += 1
        while index < end and lines[index].startswith("  - "):
            values.append(parse_scalar(lines[index][4:]))
            index += 1
        data[key] = values
    return data


def require_string(data, key, path):
    value = data.get(key)
    if not isinstance(value, str) or not value.strip():
        fail(f"{path}: {key} must be a non-empty string")
    return value


def require_date(data, key, path):
    value = require_string(data, key, path)
    if not DATE_RE.match(value):
        fail(f"{path}: {key} must be a valid YYYY-MM-DD date")
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        fail(f"{path}: {key} must be a valid YYYY-MM-DD date")
    if parsed.strftime("%Y-%m-%d") != value:
        fail(f"{path}: {key} must be a valid YYYY-MM-DD date")
    return value


def validate_common(data, expected_slug, path):
    slug = require_string(data, "slug", path)
    if not SLUG_RE.match(slug):
        fail(f"{path}: slug must use lowercase letters, numbers, and hyphens")
    if slug != expected_slug:
        fail(f'{path}: slug "{slug}" must match filename "{expected_slug}"')

    tags = data.get("tags")
    if isinstance(tags, str):
        tags = [tags]
    if not isinstance(tags, list) or not [str(tag).strip() for tag in tags if str(tag).strip()]:
        fail(f"{path}: tags must include at least one non-empty tag")

    if "draft" in data and not isinstance(data["draft"], bool):
        fail(f"{path}: draft must be a boolean when provided")


def validate_guide(data, expected_slug, path):
    validate_common(data, expected_slug, path)
    for key in ["title", "description", "category", "author"]:
        require_string(data, key, path)
    require_date(data, "publishedAt", path)
    require_date(data, "updatedAt", path)
    if "cover" in data:
        require_string(data, "cover", path)


def validate_frontmatter(content_type, data, expected_slug, path):
    if content_type != "guides":
        fail("MVP publisher currently supports --type guides only")
    validate_guide(data, expected_slug, path)
    if data.get("draft") is not False:
        fail(f"{path}: draft must be false before publishing")


def validate_source_block(path):
    text = path.read_text(encoding="utf-8")
    if not SOURCE_BLOCK_RE.search(text):
        fail(f"{path}: missing source block with arXiv ID and arXiv URL")


def run(command, check=True):
    command = list(command)
    if command:
        command[0] = resolve_required_executable(command[0])
    completed = subprocess.run(command, cwd=REPO_ROOT, encoding="utf-8", errors="replace", capture_output=True)
    if check and completed.returncode != 0:
        output = ((completed.stdout or "") + (completed.stderr or "")).strip()
        fail(f"command failed: {' '.join(command)}\n{output}")
    return completed


def notify_review(slug, target_path):
    if not DISCORD_ADAPTER.exists():
        print(f"discord: adapter not found at {DISCORD_ADAPTER}; skipping")
        return
    bash = resolve_optional_executable("bash")
    if not bash:
        print("discord: bash not found on PATH; skipping")
        return
    message = f"agenwiki guide published: {slug} -> {target_path}"
    try:
        completed = subprocess.run(
            [bash, str(DISCORD_ADAPTER), "review", message],
            cwd=REPO_ROOT,
            encoding="utf-8",
            errors="replace",
            capture_output=True,
        )
    except OSError as exc:
        print(f"discord: notify failed open ({exc})")
        return
    if completed.returncode != 0:
        print(f"discord: notify failed open ({completed.returncode})")
        if (completed.stderr or "").strip():
            print((completed.stderr or "").strip())
    elif (completed.stdout or "").strip():
        print((completed.stdout or "").strip())


def commit(target_path, slug):
    rel_path = str(target_path.relative_to(REPO_ROOT))
    run(["git", "add", rel_path])
    status = run(["git", "status", "--porcelain", rel_path], check=False)
    if not (status.stdout or "").strip():
        print("git: no content changes to commit")
        return
    run([
        "git",
        "-c",
        f"user.email={GIT_AUTHOR_EMAIL}",
        "-c",
        f"user.name={GIT_AUTHOR_NAME}",
        "commit",
        "--author",
        f"{GIT_AUTHOR_NAME} <{GIT_AUTHOR_EMAIL}>",
        "-m",
        f"Add guide: {slug}",
        "--",
        rel_path,
    ])


def main():
    parser = argparse.ArgumentParser(description="Validate and publish an MDX file from scripts/staging.")
    parser.add_argument("slug")
    parser.add_argument("--type", default="guides", choices=sorted(CONTENT_TYPES))
    parser.add_argument("--push", action="store_true", help="push after commit")
    args = parser.parse_args()

    if not SLUG_RE.match(args.slug):
        fail("slug must use lowercase letters, numbers, and hyphens")

    ensure_pipeline_dirs()
    staging_path = STAGING_DIR / f"{args.slug}.mdx"
    if not staging_path.exists():
        fail(f"staging file not found: {staging_path}")

    data = parse_frontmatter(staging_path)
    validate_frontmatter(args.type, data, args.slug, staging_path)
    validate_source_block(staging_path)

    target_dir = REPO_ROOT / "content" / args.type
    target_path = target_dir / f"{args.slug}.mdx"
    if target_path.exists():
        fail(f"target file already exists: {target_path}")

    target_dir.mkdir(parents=True, exist_ok=True)
    shutil.move(str(staging_path), str(target_path))

    try:
        build = run(["npm", "run", "build"])
    except SystemExit:
        if target_path.exists() and not staging_path.exists():
            shutil.move(str(target_path), str(staging_path))
        raise

    print((build.stdout or "").strip())
    notify_review(args.slug, target_path)
    commit(target_path, args.slug)

    if args.push:
        run(["git", "push"])
    else:
        print("push skipped; run: git push")

    print(json.dumps({"published": str(target_path), "route": f"/{args.type}/{args.slug}"}, ensure_ascii=False))


if __name__ == "__main__":
    main()
