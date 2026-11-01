import io, re
from urllib.parse import urlparse
import trafilatura
from pypdf import PdfReader
OFFICIAL = (".gov", ".gov.in", ".nic.in", ".edu", ".ac.in")
COMMUNITY = ("reddit.com", "quora.com", "facebook.com", "x.com", "twitter.com", "t.me", "youtube.com")
DATE = re.compile(r"\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}-\d{2}-\d{2})\b")

def authority(url: str) -> str:
    h = (urlparse(url).hostname or "").lower()
    if h.endswith(OFFICIAL): return "official"
    if any(h == d or h.endswith("." + d) for d in COMMUNITY): return "community"
    return "secondary"

def from_html(b: bytes):
    html = b.decode("utf-8", "replace")
    text = trafilatura.extract(html) or ""
    m = trafilatura.extract_metadata(html)
    d = (m.date if m and m.date else None) or (DATE.search(text[:3000]).group(1) if DATE.search(text[:3000]) else None)
    return text, (m.title if m else None), d  # dates come only from metadata or visible text

def from_pdf(b: bytes):
    r = PdfReader(io.BytesIO(b))
    text = "\n".join((p.extract_text() or "") for p in r.pages)
    t = (r.metadata.title if r.metadata else None)
    return text, t, (DATE.search(text[:3000]).group(1) if DATE.search(text[:3000]) else None)
