"""Generate an SVG cover for a guide from cover_template.svg.

Usage:
    python make_cover.py <slug> --title1 "핵심 키워드" [--title2 "둘째 줄"] [--category "AI 연구"]

Writes public/images/covers/<slug>.svg (self-contained, 1200x630).
See scripts/prompts/style_guide.md §9 for the cover rules.
"""

import argparse
import sys
from pathlib import Path

PIPELINE_DIR = Path(__file__).resolve().parent
REPO_ROOT = PIPELINE_DIR.parents[1]
TEMPLATE = PIPELINE_DIR / "cover_template.svg"
COVERS_DIR = REPO_ROOT / "public" / "images" / "covers"

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass


def xml_escape(text):
    return (
        text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    )


def main():
    parser = argparse.ArgumentParser(description="Generate an SVG cover from the template.")
    parser.add_argument("slug")
    parser.add_argument("--title1", required=True, help="first title line (2-4 keywords)")
    parser.add_argument("--title2", default="", help="second title line (optional)")
    parser.add_argument("--category", default="AI 연구")
    args = parser.parse_args()

    svg = TEMPLATE.read_text(encoding="utf-8")
    svg = svg.replace("{TITLE_LINE1}", xml_escape(args.title1))
    svg = svg.replace("{TITLE_LINE2}", xml_escape(args.title2))
    svg = svg.replace("{CATEGORY}", xml_escape(args.category))

    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    out = COVERS_DIR / f"{args.slug}.svg"
    out.write_text(svg, encoding="utf-8")
    print(f"cover written: {out}")


if __name__ == "__main__":
    main()
