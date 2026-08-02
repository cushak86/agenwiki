"""갱신 주기 점검: 빨리 낡는 카테고리의 문서가 60일 넘게 방치됐는지 확인한다.

근거: 최근 2개월 내 갱신된 페이지가 AI 검색 인용을 더 받는다는 2026년 공개 통계들과,
비교·연구 글은 시점이 지나면 내용 자체가 틀려진다는 사이트 자체 정책(기준 시점 배너).

대상: content/guides 중 category 가 "비교" / "AI 연구" / "AI 소식" 인 문서.
개념 설명(입문)과 실전 기록은 잘 낡지 않으므로 대상에서 뺀다.

사용: python3 scripts/pipeline/check_stale_content.py
  - 초과 문서가 있으면 목록을 출력하고 종료 코드 1 (크론·CI에서 알림으로 쓸 수 있게)
  - 없으면 종료 코드 0

이 검사는 발행 게이트가 아니다 — 새 글을 막는 것이 아니라 기존 글의 재점검을 알리는 용도라서
publish.py 에 붙이지 않고 독립 스크립트로 둔다(check_source_links.py 와 같은 위상).
"""

import re
import sys
from datetime import date, timedelta
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
GUIDES_DIR = REPO_ROOT / "content" / "guides"

STALE_CATEGORIES = {"비교", "AI 연구", "AI 소식"}
MAX_AGE_DAYS = 60

CATEGORY_RE = re.compile(r'^category:\s*"?([^"\n]+)"?\s*$', re.MULTILINE)
UPDATED_RE = re.compile(r'^updatedAt:\s*"?(\d{4}-\d{2}-\d{2})"?\s*$', re.MULTILINE)


MODELS_TS = REPO_ROOT / "lib" / "models.ts"
MODELS_AS_OF_RE = re.compile(r'MODELS_AS_OF\s*=\s*"(\d{4}-\d{2}-\d{2})"')


def check_models_freshness(cutoff: date) -> str | None:
    """도구(요금 계산기·비교표·위저드)의 단가 기준 시점도 같은 60일 규칙으로 점검한다.

    단가는 문서보다 빨리 낡고, 낡은 단가는 계산기 신뢰를 직접 깎는다.
    갱신 방법: lib/models.ts 의 단가를 공식 요금 페이지와 대조해 고치고 MODELS_AS_OF 를 올린다.
    """
    match = MODELS_AS_OF_RE.search(MODELS_TS.read_text(encoding="utf-8"))
    if not match:
        return "lib/models.ts 에서 MODELS_AS_OF 를 찾지 못했습니다 — 형식이 바뀌었는지 확인 필요"
    as_of = date.fromisoformat(match.group(1))
    if as_of < cutoff:
        age = (date.today() - as_of).days
        return f"도구 단가 기준(MODELS_AS_OF={as_of}) {age}일 경과 — lib/models.ts 단가 재확인 필요"
    return None


def main() -> int:
    cutoff = date.today() - timedelta(days=MAX_AGE_DAYS)
    stale = []

    for path in sorted(GUIDES_DIR.glob("*.mdx")):
        text = path.read_text(encoding="utf-8")
        category_match = CATEGORY_RE.search(text)
        updated_match = UPDATED_RE.search(text)
        if not category_match or not updated_match:
            continue
        category = category_match.group(1).strip()
        if category not in STALE_CATEGORIES:
            continue
        updated = date.fromisoformat(updated_match.group(1))
        if updated < cutoff:
            stale.append((updated, category, path.name))

    models_warning = check_models_freshness(cutoff)

    if not stale and not models_warning:
        print(f"OK: 비교·연구 글과 도구 단가 전부 {MAX_AGE_DAYS}일 이내 갱신 상태입니다.")
        return 0

    if models_warning:
        print(models_warning)

    if not stale:
        return 1

    print(f"재점검 필요 {len(stale)}건 ({MAX_AGE_DAYS}일 초과):")
    for updated, category, name in sorted(stale):
        age = (date.today() - updated).days
        print(f"  {updated} ({age}일 경과) [{category}] {name}")
    print("\n내용을 재확인하고 고친 뒤 updatedAt 을 올리세요. 내용이 그대로 유효해도")
    print("재확인했다면 updatedAt 을 올립니다(기준 시점 배너가 이 값을 씁니다).")
    return 1


if __name__ == "__main__":
    sys.exit(main())
