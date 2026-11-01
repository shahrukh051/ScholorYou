import asyncio, ipaddress, socket
from urllib.parse import urlparse, urljoin
import httpx
MAX = 5 * 1024 * 1024

def check(url: str):
    p = urlparse(url)
    if p.scheme not in ("http", "https") or not p.hostname:
        raise ValueError("Only http/https URLs are allowed")
    for i in socket.getaddrinfo(p.hostname, p.port or (443 if p.scheme == "https" else 80)):
        ip = ipaddress.ip_address(i[4][0])
        if ip.is_loopback or ip.is_private or ip.is_link_local or ip.is_reserved or ip.is_multicast or ip.is_unspecified:
            raise ValueError("Blocked address (private, loopback or link-local)")

async def fetch(url: str):
    async with httpx.AsyncClient(timeout=10, follow_redirects=False, headers={"User-Agent": "DigitalDarkSpot/0.1"}) as c:
        for _ in range(5):
            await asyncio.to_thread(check, url)  # re-checked on every redirect
            async with c.stream("GET", url) as r:
                if r.is_redirect:
                    url = urljoin(url, r.headers["location"]); continue
                r.raise_for_status()
                buf = b""
                async for ch in r.aiter_bytes():
                    buf += ch
                    if len(buf) > MAX: raise ValueError("Page is over the 5 MB cap")
                return buf, r.headers.get("content-type", "")
    raise ValueError("Too many redirects")
