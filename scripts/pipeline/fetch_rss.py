import argparse
import hashlib
import html
import json
import re
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

from config import QUEUE_DIR, SEEN_PATH, USER_AGENT, ensure_pipeline_dirs


ATOM = "{http://www.w3.org/2005/Atom}"
CONTENT = "{http://purl.org/rss/1.0/modules/content/}"
DC = "{http://purl.org/dc/elements/1.1/}"
TAG_RE = re.compile(r"<[^>]+>")
SAFE_ID_RE = re.compile(r"[^a-z0-9]+")
MAX_ID_LENGTH = 96


def clean_text(value):
    return " ".join((value or "").replace("\r", " ").replace("\n", " ").split())


def strip_html(value):
    text = html.unescape(value or "")
    text = TAG_RE.sub(" ", text)
    return clean_text(text)


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


def safe_id(value):
    raw = clean_text(value)
    digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()[:12]
    normalized = SAFE_ID_RE.sub("-", raw.lower()).strip("-")
    if not normalized:
        return digest
    if len(normalized) > MAX_ID_LENGTH:
        return f"{normalized[:MAX_ID_LENGTH - 13].rstrip('-')}-{digest}"
    return normalized


def first_text(parent, tags):
    for tag in tags:
        node = parent.find(tag)
        if node is not None and node.text:
            return clean_text(node.text)
    return ""


def rss_link(item):
    guid = first_text(item, ["guid"])
    link = first_text(item, ["link"])
    return link or guid


def atom_link(entry):
    for link in entry.findall(f"{ATOM}link"):
        rel = link.attrib.get("rel", "alternate")
        href = link.attrib.get("href", "")
        if href and rel == "alternate":
            return href
    for link in entry.findall(f"{ATOM}link"):
        href = link.attrib.get("href", "")
        if href:
            return href
    return first_text(entry, [f"{ATOM}id"])


def parse_rss_item(item, source_name):
    raw_id = first_text(item, ["guid"]) or rss_link(item)
    url = rss_link(item)
    return {
        "id": safe_id(raw_id or url),
        "title": first_text(item, ["title"]),
        "abstract": strip_html(first_text(item, [f"{CONTENT}encoded", "description", "summary"])),
        "authors": [name for name in [first_text(item, [f"{DC}creator", "author"])] if name],
        "published": first_text(item, ["pubDate", "published", "updated"]),
        "primary_category": "blog",
        "arxiv_url": url,
        "source": source_name,
    }


def parse_atom_entry(entry, source_name):
    raw_id = first_text(entry, [f"{ATOM}id"]) or atom_link(entry)
    url = atom_link(entry)
    authors = [first_text(author, [f"{ATOM}name"]) for author in entry.findall(f"{ATOM}author")]
    return {
        "id": safe_id(raw_id or url),
        "title": first_text(entry, [f"{ATOM}title", "title"]),
        "abstract": strip_html(first_text(entry, [f"{ATOM}content", f"{ATOM}summary", "content", "summary"])),
        "authors": [author for author in authors if author],
        "published": first_text(entry, [f"{ATOM}published", f"{ATOM}updated", "published", "updated"]),
        "primary_category": "blog",
        "arxiv_url": url,
        "source": source_name,
    }


def feed_title(root):
    channel = root.find("channel")
    if channel is not None:
        title = first_text(channel, ["title"])
        if title:
            return title
    return first_text(root, [f"{ATOM}title", "title"])


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    retries = 3
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read()
        except urllib.error.HTTPError as error:
            retryable = error.code == 429 or 500 <= error.code <= 599
            if not retryable or attempt == retries:
                raise SystemExit(f"RSS fetch failed with HTTP {error.code}: {error.reason}") from error
            time.sleep(2 ** attempt)
        except urllib.error.URLError as error:
            if attempt == retries:
                raise SystemExit(f"RSS fetch failed: {error.reason}") from error
            time.sleep(2 ** attempt)


def parse_feed(raw, source_name):
    root = ET.fromstring(raw)
    source = source_name or feed_title(root) or "RSS feed"
    channel = root.find("channel")
    if channel is not None:
        return [parse_rss_item(item, source) for item in channel.findall("item")]
    atom_entries = root.findall(f"{ATOM}entry")
    if atom_entries:
        return [parse_atom_entry(entry, source) for entry in atom_entries]
    return [parse_rss_item(item, source) for item in root.findall(".//item")]


def write_new_entries(entries, seen):
    written = []
    for entry in entries:
        if entry["id"] in seen:
            continue
        output_path = QUEUE_DIR / f"{entry['id']}.json"
        output_path.write_text(json.dumps(entry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        seen.add(entry["id"])
        written.append(output_path)
    save_seen(seen)
    return written


def main():
    parser = argparse.ArgumentParser(description="Fetch RSS or Atom feed entries into scripts/queue.")
    parser.add_argument("--feed", required=True, help="RSS or Atom feed URL")
    parser.add_argument("--max", type=int, default=10, help="maximum feed entries to write")
    parser.add_argument("--source-name", help="source name stored in queue JSON; defaults to feed title")
    args = parser.parse_args()

    if args.max < 1:
        raise SystemExit("--max must be at least 1")

    ensure_pipeline_dirs()
    raw = fetch(args.feed)
    entries = parse_feed(raw, args.source_name)[:args.max]
    seen = load_seen()
    written = write_new_entries(entries, seen)

    print(json.dumps({
        "feed": args.feed,
        "requested": args.max,
        "received": len(entries),
        "written": [str(path) for path in written],
        "deduped": len(entries) - len(written),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
