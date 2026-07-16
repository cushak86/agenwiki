"""OG 카드용 PNG 커버 생성기 (1200x630).

왜 PNG인가:
    `og:image`가 SVG면 X·페이스북·링크드인·슬랙·카카오톡 어디에서도 미리보기 카드가
    렌더링되지 않는다(이들은 JPG/PNG/WEBP/GIF만 지원). 2026-07-16 기준 사이트의
    og:image가 전부 SVG여서 모든 공유 카드가 빈칸이었다. 그 수선용.

왜 정적 생성인가:
    next/og(ImageResponse)로 런타임 생성도 가능하지만, 한글 글리프를 위해 폰트를
    엣지 번들에 넣어야 해 용량·배포 리스크가 붙는다. 정적 생성은 폰트가 **생성 시점에만**
    필요하므로 런타임 의존성이 0이다.

디자인은 `scripts/pipeline/cover_template.svg`와 동일 사양을 재현한다 — 둘을 함께 고쳐라.

의존성 (콘텐츠 파이프라인과 분리 — pipeline/은 표준 라이브러리만 쓴다는 규약 유지):
    pip install Pillow
    폰트는 최초 실행 시 자동 내려받아 scripts/design/.fonts/ 에 캐시한다(gitignore 대상).

사용법:
    python scripts/design/make_og_png.py default --title1 "AI 지식백과" --title2 "그리고 실전 가이드" --category "agenwiki"
    python scripts/design/make_og_png.py <slug> --title1 "핵심 키워드" [--title2 "둘째 줄"] [--category "AI 연구"]
    → public/images/covers/<slug>.png
"""

import argparse
import sys
import urllib.request
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow가 필요합니다: pip install Pillow")

DESIGN_DIR = Path(__file__).resolve().parent
REPO_ROOT = DESIGN_DIR.parents[1]
COVERS_DIR = REPO_ROOT / "public" / "images" / "covers"
FONT_DIR = DESIGN_DIR / ".fonts"
FONT_PATH = FONT_DIR / "NotoSansKR.ttf"
FONT_URL = "https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf"

W, H = 1200, 630

# cover_template.svg 와 동일한 색 (바꾸려면 둘 다 고쳐라)
BG_STOPS = [(0.0, (0x0B, 0x12, 0x20)), (0.55, (0x11, 0x1A, 0x2E)), (1.0, (0x1A, 0x24, 0x40))]
ACCENT_FROM, ACCENT_TO = (0x38, 0xBD, 0xF8), (0x81, 0x8C, 0xF8)
GLOW_RGB, GLOW_ALPHA = (0x38, 0xBD, 0xF8), 0.28
CATEGORY_FILL = (0x7D, 0xD3, 0xFC)
TITLE_FILL = (0xF8, 0xFA, 0xFC)
WORDMARK_FILL = (0xE2, 0xE8, 0xF0)
TAGLINE_FILL = (0x64, 0x74, 0x8B)


def ensure_font():
    if FONT_PATH.exists():
        return
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"폰트 내려받는 중 (최초 1회): {FONT_URL}")
    req = urllib.request.Request(FONT_URL, headers={"User-Agent": "agenwiki-og-generator"})
    with urllib.request.urlopen(req, timeout=120) as r, open(FONT_PATH, "wb") as f:
        f.write(r.read())
    print(f"폰트 캐시됨: {FONT_PATH}")


def font(size, weight):
    """Noto Sans KR 가변폰트에서 굵기 축을 지정해 인스턴스를 얻는다.

    가변폰트를 그냥 열면 기본 인스턴스(Thin)가 잡혀 디자인이 뭉개진다.
    """
    f = ImageFont.truetype(str(FONT_PATH), size)
    try:
        f.set_variation_by_axes([weight])
    except (OSError, AttributeError):
        pass  # 가변축 미지원 빌드면 기본 굵기로 진행
    return f


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def stop_color(t):
    """다구간 그라디언트에서 t(0~1) 위치의 색."""
    for i in range(len(BG_STOPS) - 1):
        t0, c0 = BG_STOPS[i]
        t1, c1 = BG_STOPS[i + 1]
        if t0 <= t <= t1:
            return lerp(c0, c1, (t - t0) / (t1 - t0) if t1 > t0 else 0)
    return BG_STOPS[-1][1]


def render_background():
    """대각 선형 그라디언트 + 방사형 글로우. SVG의 objectBoundingBox 좌표계를 재현."""
    img = Image.new("RGB", (W, H))
    px = img.load()

    # 대각 그라디언트: x1=0,y1=0 → x2=1,y2=1 (SVG defs #bg)
    row_cache = {}
    for y in range(H):
        yn = y / (H - 1)
        for x in range(W):
            t = (x / (W - 1) + yn) / 2
            key = round(t * 512)
            c = row_cache.get(key)
            if c is None:
                c = stop_color(key / 512)
                row_cache[key] = c
            px[x, y] = c

    # 방사형 글로우: cx=0.82, cy=0.15, r=0.6 (SVG defs #glow)
    # objectBoundingBox 단위라 x/y 축이 독립 스케일 → 타원
    cx, cy = 0.82 * W, 0.15 * H
    rx, ry = 0.6 * W, 0.6 * H
    glow = Image.new("L", (W, H), 0)
    gpx = glow.load()
    for y in range(H):
        dy = ((y - cy) / ry) ** 2
        if dy > 1:
            continue
        for x in range(W):
            d = ((x - cx) / rx) ** 2 + dy
            if d < 1:
                gpx[x, y] = round(255 * GLOW_ALPHA * (1 - d ** 0.5))
    img.paste(Image.new("RGB", (W, H), GLOW_RGB), (0, 0), glow)
    return img


def draw_accent_bar(img):
    """가로 그라디언트 라운드 바 (SVG: x=90 y=150 w=90 h=10 rx=5)."""
    x, y, w, h = 90, 150, 90, 10
    bar = Image.new("RGB", (w, h))
    bpx = bar.load()
    for i in range(w):
        c = lerp(ACCENT_FROM, ACCENT_TO, i / (w - 1))
        for j in range(h):
            bpx[i, j] = c
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1], radius=5, fill=255)
    img.paste(bar, (x, y), mask)


def draw_tracked_text(draw, xy, text, fnt, fill, tracking=0):
    """letter-spacing 재현 — PIL엔 자간 옵션이 없어 글자별로 그린다."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill, anchor="ls")
        x += draw.textlength(ch, font=fnt) + tracking


def render(slug, title1, title2, category):
    ensure_font()
    img = render_background()
    draw = ImageDraw.Draw(img)

    # 우상단 격자 점 (SVG: fill-opacity 0.04)
    dot = tuple(round(0x0B + (255 - 0x0B) * 0.04) for _ in range(3))
    for cy_ in (120, 170):
        for cx_ in (1060, 1110, 1160):
            draw.ellipse([cx_ - 3, cy_ - 3, cx_ + 3, cy_ + 3], fill=dot)

    draw_accent_bar(img)

    # SVG의 text y는 baseline → PIL anchor "ls"(left-baseline)로 맞춘다
    draw_tracked_text(draw, (90, 128), category, font(30, 600), CATEGORY_FILL, tracking=2)
    draw.text((88, 322), title1, font=font(92, 800), fill=TITLE_FILL, anchor="ls")
    if title2:
        draw.text((88, 432), title2, font=font(92, 800), fill=TITLE_FILL, anchor="ls")

    # 푸터 워드마크
    circ = Image.new("RGB", (28, 28))
    cpx = circ.load()
    for i in range(28):
        c = lerp(ACCENT_FROM, ACCENT_TO, i / 27)
        for j in range(28):
            cpx[i, j] = c
    cmask = Image.new("L", (28, 28), 0)
    ImageDraw.Draw(cmask).ellipse([0, 0, 27, 27], fill=255)
    img.paste(circ, (90, 542), cmask)
    draw.text((130, 566), "agenwiki", font=font(34, 700), fill=WORDMARK_FILL, anchor="ls")
    draw.text((1110, 566), "AI 인사이트", font=font(24, 500), fill=TAGLINE_FILL, anchor="rs")

    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    out = COVERS_DIR / f"{slug}.png"
    img.save(out, "PNG", optimize=True)
    print(f"cover written: {out} ({out.stat().st_size:,} bytes, {W}x{H})")
    return out


def main():
    p = argparse.ArgumentParser(description="OG 카드용 PNG 커버 생성 (1200x630)")
    p.add_argument("slug")
    p.add_argument("--title1", required=True, help="첫 줄 (키워드 2~4개)")
    p.add_argument("--title2", default="", help="둘째 줄 (선택)")
    p.add_argument("--category", default="AI 연구")
    a = p.parse_args()
    render(a.slug, a.title1, a.title2, a.category)


if __name__ == "__main__":
    main()
