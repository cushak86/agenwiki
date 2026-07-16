"""출처 블록의 URL이 지금도 살아 있는지(실 200) 확인한다.

왜 Python·왜 여기인가:
  scripts/pipeline/ 은 표준 라이브러리만 쓴다(README에 명문화돼 있지는 않지만, 이 폴더의
  모든 .py 가 실제로 stdlib + 로컬 config 만 import 한다 — argparse/urllib/re/xml.etree 등).
  이 검사기도 stdlib(urllib.request)만으로 충분하고, 무엇보다 같은 출처 블록 정규식을
  공유하는 publish.py 옆에 두는 편이 규칙이 갈라질 위험이 적어서 Python 으로 썼다.

왜 빌드에 넣지 않는가:
  네트워크 호출은 빌드를 비결정적으로 만든다. arXiv 가 잠깐 죽으면 배포가 통째로 막힌다.
  빌드는 출처 블록의 '존재'만 강제하고(lib/content.ts), '살아있음'은 이 독립 스크립트가
  주기 실행·발행 전 수동 실행으로 확인한다.

사용법:
  python3 scripts/pipeline/check_source_links.py            # 전체 콘텐츠 검사
  python3 scripts/pipeline/check_source_links.py --type guides
  python3 scripts/pipeline/check_source_links.py --json     # 기계 판독용

종료 코드: 0 = 전부 통과, 1 = 죽은 링크 있음, 2 = 검사 자체가 실패(설정 오류 등).
"""

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request

from config import REPO_ROOT, USER_AGENT

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass


CONTENT_TYPES = ["guides", "glossary", "prompts", "newsletter"]

# lib/content.ts 의 sourceBlockPattern·publish.py 의 SOURCE_BLOCK_RE 와 같은 형식을 본다.
SOURCE_BLOCK_RE = re.compile(r"(?m)^>\s*출처:.*$")
# 출처 블록 줄에서 URL만 뽑는다. 마크다운 괄호·따옴표·문장부호가 꼬리에 붙는 것을 잘라낸다.
URL_RE = re.compile(r"https?://[^\s<>\"')\]]+")
TRAILING_PUNCT = ".,;:)]}>\"'"


def extract_urls(text):
    urls = []
    for line in SOURCE_BLOCK_RE.findall(text):
        for url in URL_RE.findall(line):
            urls.append(url.rstrip(TRAILING_PUNCT))
    return urls


def collect(types):
    """(url -> [출처가 적힌 파일 경로]) 매핑. 같은 URL 이 여러 글에 있으면 한 번만 때린다."""
    found = {}
    for content_type in types:
        directory = REPO_ROOT / "content" / content_type
        if not directory.is_dir():
            continue
        for path in sorted(directory.glob("*.mdx")):
            text = path.read_text(encoding="utf-8")
            for url in extract_urls(text):
                rel = str(path.relative_to(REPO_ROOT))
                found.setdefault(url, [])
                if rel not in found[url]:
                    found[url].append(rel)
    return found


def probe(url, timeout, method):
    request = urllib.request.Request(url, method=method)
    request.add_header("User-Agent", USER_AGENT)
    # 일부 호스트는 Accept 가 없으면 406 을 준다.
    request.add_header("Accept", "*/*")
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.status, response.geturl()


def check(url, timeout, retries):
    """(ok, status, detail, final_url). HEAD 거부 호스트(arXiv 등) 대비로 GET 폴백."""
    last = None
    for attempt in range(retries + 1):
        for method in ("HEAD", "GET"):
            try:
                status, final_url = probe(url, timeout, method)
                if status == 200:
                    return True, status, "", final_url
                last = (status, f"HTTP {status}")
            except urllib.error.HTTPError as exc:
                # 405/403 은 HEAD 를 막는 것일 수 있으니 GET 으로 한 번 더 본다.
                last = (exc.code, f"HTTP {exc.code} {exc.reason}")
                if method == "HEAD" and exc.code in (403, 405, 400, 501):
                    continue
                break
            except urllib.error.URLError as exc:
                last = (None, f"연결 실패: {exc.reason}")
                break
            except (TimeoutError, OSError) as exc:
                last = (None, f"연결 실패: {exc}")
                break
        if attempt < retries:
            time.sleep(1.5 * (attempt + 1))
    status, detail = last if last else (None, "알 수 없는 오류")
    return False, status, detail, url


def main():
    parser = argparse.ArgumentParser(description="출처 블록 URL의 실 200 여부를 확인한다.")
    parser.add_argument("--type", action="append", choices=CONTENT_TYPES,
                        help="검사할 콘텐츠 타입(반복 지정 가능). 기본: 전체")
    parser.add_argument("--timeout", type=float, default=15.0, help="요청 타임아웃 초 (기본 15)")
    parser.add_argument("--retries", type=int, default=1, help="실패 시 재시도 횟수 (기본 1)")
    parser.add_argument("--delay", type=float, default=0.5, help="요청 간 간격 초 (기본 0.5)")
    parser.add_argument("--json", action="store_true", help="JSON 으로 출력")
    args = parser.parse_args()

    types = args.type or CONTENT_TYPES
    found = collect(types)

    if not found:
        message = f"검사할 출처 URL이 없습니다 (대상 타입: {', '.join(types)})."
        print(json.dumps({"checked": 0, "ok": 0, "dead": [], "note": message}, ensure_ascii=False)
              if args.json else message)
        return 0

    results = []
    for index, (url, files) in enumerate(sorted(found.items())):
        if index and args.delay:
            time.sleep(args.delay)
        ok, status, detail, final_url = check(url, args.timeout, args.retries)
        results.append({"url": url, "ok": ok, "status": status, "detail": detail,
                        "finalUrl": final_url, "files": files})
        if not args.json:
            mark = "OK  " if ok else "DEAD"
            print(f"  {mark} {status or '---':>4}  {url}")
            if not ok:
                print(f"        ↳ {detail}")
                for ref in files:
                    print(f"        ↳ 사용처: {ref}")

    dead = [item for item in results if not item["ok"]]

    if args.json:
        print(json.dumps({"checked": len(results), "ok": len(results) - len(dead), "dead": dead},
                         ensure_ascii=False, indent=2))
    else:
        print()
        if dead:
            print(f"실패: 출처 URL {len(results)}개 중 {len(dead)}개가 200이 아닙니다.")
            print("죽은 링크는 원문을 다시 찾아 URL을 고치거나, 원문이 사라졌다면 본문에서 그 사실을 밝히세요.")
        else:
            print(f"통과: 출처 URL {len(results)}개 전부 200. 죽은 링크 없음.")
        print(f"(대상 타입: {', '.join(types)} · 검사 시각 {time.strftime('%Y-%m-%d %H:%M:%S %Z')})")

    return 1 if dead else 0


if __name__ == "__main__":
    sys.exit(main())
