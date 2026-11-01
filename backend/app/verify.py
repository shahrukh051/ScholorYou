import re
from rapidfuzz import fuzz
norm = lambda s: re.sub(r"\s+", " ", s or "").strip().lower()

def verify_quote(quote: str, text: str) -> bool:
    q, t = norm(quote), norm(text)
    return bool(q) and (q in t or fuzz.partial_ratio(q, t) >= 92)

def shingles(t: str, n: int = 5):
    w = norm(t).split()
    return {" ".join(w[i:i + n]) for i in range(max(0, len(w) - n + 1))}

def jaccard(a, b):
    return len(a & b) / len(a | b) if a and b else 0.0
