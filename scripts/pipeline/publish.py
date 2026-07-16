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
SOURCE_BLOCK_RE = re.compile(r"(?m)^>\s*출처:.*https?://\S+")
CONTENT_TYPES = {"guides", "glossary", "prompts", "newsletter"}

# 출처 블록 필수 규칙 — lib/content.ts 의 SOURCE_REQUIRED_TYPE/SOURCE_REQUIRED_CATEGORIES 와
# 반드시 같은 값을 유지한다. 근거(왜 type 기준이 아니라 category 기준인지, 왜 guides 로
# 한정하는지)는 lib/content.ts 주석에 있다 — 여기서 중복 서술하지 않는다.
#
# 진짜 게이트는 lib/content.ts 다. 그쪽은 빌드 중 content/ 의 모든 .mdx 에 대해 돌아서 우회할 수
# 없지만, 이 스크립트는 일반 커밋으로 우회된다(실제로 출처 없는 guides 16건이 그렇게 들어왔다).
# 여기 검사는 발행 시점에 더 일찍·더 친절하게 알려주는 용도이고, 규칙이 갈라지면 안 된다.
SOURCE_REQUIRED_TYPE = "guides"
SOURCE_REQUIRED_CATEGORIES = {"AI 연구", "AI 소식"}


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


def parse_inline_array(value):
    inner = value[1:-1].strip()
    if not inner:
        return []
    return [parse_scalar(item.strip()) for item in inner.split(",")]


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
            if raw_value.startswith("[") and raw_value.endswith("]"):
                data[key] = parse_inline_array(raw_value)
            else:
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


def require_list(data, key, path):
    value = data.get(key)
    if not isinstance(value, list):
        fail(f"{path}: {key} must be an array")
    return value


def validate_slug_list(data, key, path):
    values = data.get(key)
    if values is None:
        return
    if not isinstance(values, list):
        fail(f"{path}: {key} must be an array")
    for value in values:
        if not isinstance(value, str) or not SLUG_RE.match(value):
            fail(f"{path}: {key} must contain only lowercase slug strings")


def validate_glossary(data, expected_slug, path):
    validate_common(data, expected_slug, path)
    for key in ["term", "shortDef", "category"]:
        require_string(data, key, path)
    require_date(data, "updatedAt", path)
    aliases = require_list(data, "aliases", path)
    for alias in aliases:
        if not isinstance(alias, str) or not alias.strip():
            fail(f"{path}: aliases must contain only non-empty strings")
    validate_slug_list(data, "related", path)
    for key in ["publishedAt", "title", "description", "author"]:
        if key in data:
            fail(f"{path}: glossary frontmatter must not include {key}")


def validate_prompts(data, expected_slug, path):
    validate_common(data, expected_slug, path)
    for key in ["title", "description", "targetModel", "promptText"]:
        require_string(data, key, path)
    require_date(data, "publishedAt", path)
    if "variables" in data:
        require_list(data, "variables", path)
    for key in ["term", "shortDef", "aliases", "related"]:
        if key in data:
            fail(f"{path}: prompts frontmatter must not include {key}")


def validate_newsletter(data, expected_slug, path):
    validate_common(data, expected_slug, path)
    for key in ["title", "summary"]:
        require_string(data, key, path)
    issue_number = data.get("issueNumber")
    if isinstance(issue_number, bool):
        fail(f"{path}: issueNumber must be an integer")
    try:
        int(issue_number)
    except (TypeError, ValueError):
        fail(f"{path}: issueNumber must be an integer")
    require_date(data, "publishedAt", path)


def validate_frontmatter(content_type, data, expected_slug, path):
    if content_type == "guides":
        validate_guide(data, expected_slug, path)
    elif content_type == "glossary":
        validate_glossary(data, expected_slug, path)
    elif content_type == "prompts":
        validate_prompts(data, expected_slug, path)
    elif content_type == "newsletter":
        validate_newsletter(data, expected_slug, path)
    else:
        fail(f"unsupported content type: {content_type}")
    if data.get("draft") is not False:
        fail(f"{path}: draft must be false before publishing")


def requires_source_block(content_type, data):
    if content_type != SOURCE_REQUIRED_TYPE:
        return False
    return data.get("category") in SOURCE_REQUIRED_CATEGORIES


def validate_source_block(content_type, data, path):
    """근거로 삼은 원문이 있는 글(연구/소식 카테고리)에 출처 블록이 달렸는지 검사한다.

    존재 여부만 본다 — URL 이 실제로 200 인지, 본문과 관련이 있는지, arXiv ID 가 유효한지는
    검사하지 않는다. 실 200 확인은 check_source_links.py 가 따로 한다.
    """
    if not requires_source_block(content_type, data):
        return

    text = path.read_text(encoding="utf-8")
    if SOURCE_BLOCK_RE.search(text):
        return

    category = data.get("category")
    allowed = '" / "'.join(sorted(SOURCE_REQUIRED_CATEGORIES))
    fail(
        f'{path}: category "{category}" 는 출처 블록이 필수인데 본문에서 찾지 못했습니다.\n'
        f'  왜: "{allowed}" 카테고리는 근거로 삼은 원문이 있는 글입니다.\n'
        "      /about 출처 정책에 그렇게 공개돼 있어 코드가 어긋나면 안 됩니다.\n"
        "  고치는 법 — 둘 중 하나:\n"
        "    1) 원문이 있다면 본문 끝에 출처 블록을 추가하세요:\n"
        '         > 출처: Kim et al., "논문 제목" (arXiv:2501.12345) https://arxiv.org/abs/2501.12345\n'
        '       형식: 줄 맨 앞이 ">", "출처:" 뒤 같은 줄에 http(s) URL 이 하나 이상.\n'
        "    2) 특정 원문에 기대지 않는 글이면 category 를 바꾸세요: 입문 / 비교 / 실전\n"
        "  같은 규칙이 빌드에도 걸려 있습니다(lib/content.ts) — 여기를 통과해도 거기서 막힙니다."
    )


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
    parser.add_argument("--skip-build", action="store_true", help="skip npm run build before commit")
    args = parser.parse_args()

    if not SLUG_RE.match(args.slug):
        fail("slug must use lowercase letters, numbers, and hyphens")

    ensure_pipeline_dirs()
    staging_path = STAGING_DIR / f"{args.slug}.mdx"
    if not staging_path.exists():
        fail(f"staging file not found: {staging_path}")

    data = parse_frontmatter(staging_path)
    validate_frontmatter(args.type, data, args.slug, staging_path)
    validate_source_block(args.type, data, staging_path)

    target_dir = REPO_ROOT / "content" / args.type
    target_path = target_dir / f"{args.slug}.mdx"
    if target_path.exists():
        fail(f"target file already exists: {target_path}")

    target_dir.mkdir(parents=True, exist_ok=True)
    shutil.move(str(staging_path), str(target_path))

    if args.skip_build:
        print("build skipped")
    else:
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
