import argparse
import json
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

from config import QUEUE_DIR, SEEN_PATH, USER_AGENT, ensure_pipeline_dirs


ARXIV_API = "https://export.arxiv.org/api/query"
ATOM = "{http://www.w3.org/2005/Atom}"
ARXIV = "{http://arxiv.org/schemas/atom}"


def clean_text(value):
    return " ".join((value or "").replace("\r", " ").replace("\n", " ").split())


def load_seen():
    if not SEEN_PATH.exists():
        return set()
    try:
        data = json.loads(SEEN_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return set()
    if not isinstance(data, list):
        return set()
    return {str(item) for item in data}


def save_seen(seen):
    SEEN_PATH.write_text(json.dumps(sorted(seen), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def arxiv_id_from_url(url):
    return url.rstrip("/").rsplit("/", 1)[-1]


def safe_file_id(arxiv_id):
    return arxiv_id.replace("/", "_")


def text_of(parent, tag):
    node = parent.find(f"{ATOM}{tag}")
    return clean_text(node.text if node is not None else "")


def parse_entry(entry):
    entry_id = text_of(entry, "id")
    arxiv_id = arxiv_id_from_url(entry_id)
    links = {}
    for link in entry.findall(f"{ATOM}link"):
        rel = link.attrib.get("rel", "")
        title = link.attrib.get("title", "")
        href = link.attrib.get("href", "")
        if title == "pdf":
            links["pdf"] = href
        elif rel == "alternate":
            links["abs"] = href

    categories = [node.attrib.get("term", "") for node in entry.findall(f"{ATOM}category") if node.attrib.get("term")]
    primary = entry.find(f"{ARXIV}primary_category")

    return {
        "id": arxiv_id,
        "title": text_of(entry, "title"),
        "abstract": text_of(entry, "summary"),
        "authors": [text_of(author, "name") for author in entry.findall(f"{ATOM}author")],
        "primary_category": primary.attrib.get("term", "") if primary is not None else "",
        "categories": categories,
        "published": text_of(entry, "published"),
        "updated": text_of(entry, "updated"),
        "arxiv_url": links.get("abs", entry_id),
        "pdf_url": links.get("pdf", ""),
        "source": "arXiv API",
    }


def fetch(category, max_results):
    params = {
        "search_query": f"cat:{category}",
        "start": "0",
        "max_results": str(max_results),
        "sortBy": "submittedDate",
        "sortOrder": "descending",
    }
    url = f"{ARXIV_API}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    time.sleep(3)
    retries = 3
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read()
        except urllib.error.HTTPError as error:
            retryable = error.code == 429 or 500 <= error.code <= 599
            if not retryable or attempt == retries:
                raise SystemExit(f"arXiv fetch failed with HTTP {error.code}: {error.reason}") from error
            time.sleep(2 ** attempt)
        except urllib.error.URLError as error:
            if attempt == retries:
                raise SystemExit(f"arXiv fetch failed: {error.reason}") from error
            time.sleep(2 ** attempt)


def write_new_entries(entries, seen, since):
    written = []
    for entry in entries:
        published_date = entry["published"][:10]
        if since and published_date < since:
            continue
        if entry["id"] in seen:
            continue
        output_path = QUEUE_DIR / f"{safe_file_id(entry['id'])}.json"
        output_path.write_text(json.dumps(entry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        seen.add(entry["id"])
        written.append(output_path)
    save_seen(seen)
    return written


def main():
    parser = argparse.ArgumentParser(description="Fetch recent arXiv metadata into scripts/queue.")
    parser.add_argument("--category", required=True, help="arXiv category such as cs.AI or cs.CL")
    parser.add_argument("--max", type=int, default=10, help="maximum results to request")
    parser.add_argument("--since", help="optional YYYY-MM-DD lower bound using arXiv published date")
    args = parser.parse_args()

    if args.max < 1:
        raise SystemExit("--max must be at least 1")

    ensure_pipeline_dirs()
    raw = fetch(args.category, args.max)
    root = ET.fromstring(raw)
    entries = [parse_entry(entry) for entry in root.findall(f"{ATOM}entry")]
    seen = load_seen()
    written = write_new_entries(entries, seen, args.since)

    print(json.dumps({
        "category": args.category,
        "requested": args.max,
        "received": len(entries),
        "written": [str(path) for path in written],
        "deduped": len(entries) - len(written),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
