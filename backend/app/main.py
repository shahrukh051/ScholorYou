import asyncio, json, os, uuid
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
load_dotenv()
from . import extract, pipeline
from .ssrf import fetch

app = FastAPI(title="Digital Dark Spot")
app.add_middleware(CORSMiddleware, allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")], allow_methods=["*"], allow_headers=["*"])
DB: dict[str, dict] = {}
DEMO = Path(__file__).with_name("demo_scholarship.json")
class Q(BaseModel): question: str
class U(BaseModel): url: str
class D(BaseModel): done: bool
class RubricIn(BaseModel): rubric: list[dict]

def get(i):
    if i not in DB: raise HTTPException(404, "Unknown research id")
    return DB[i]
def new_source(rs, url, typ):
    if len(rs["sources"]) >= 8: raise HTTPException(400, "Maximum 8 sources")
    s = dict(id="s" + uuid.uuid4().hex[:6], title=url, url=url, type=typ, authority=extract.authority(url), status="extracting")
    rs["sources"].append(s); return s
def done(rs, s, text, title, date):
    if len(text.strip()) < 200: raise ValueError("No readable text could be extracted")
    rs["texts"][s["id"]] = text; s.update(status="ok", title=title or s["title"], date=date)

@app.get("/api/health")
def health(): return {"ok": True}

@app.post("/api/research")
def create(b: Q):
    i = uuid.uuid4().hex[:10]; DB[i] = dict(question=b.question, sources=[], texts={}, rubric=[], events=[], result=None); return {"id": i}

@app.post("/api/research/{i}/sources/url")
async def add_url(i: str, b: U):
    rs = get(i); s = new_source(rs, b.url, "url")
    try:
        data, ct = await fetch(b.url)
        if "pdf" in ct or b.url.lower().endswith(".pdf"): s["type"] = "pdf"; done(rs, s, *extract.from_pdf(data))
        else: done(rs, s, *extract.from_html(data))
    except Exception as e: s.update(status="failed", error=str(e)[:200])
    return s

@app.post("/api/research/{i}/sources/upload")
async def upload(i: str, file: UploadFile = File(...)):
    rs = get(i); data = await file.read()
    if len(data) > 10 * 1024 * 1024: raise HTTPException(413, "PDF is over 10 MB")
    s = new_source(rs, file.filename or "upload.pdf", "pdf"); s["authority"] = "secondary"
    try: done(rs, s, *extract.from_pdf(data))
    except Exception as e: s.update(status="failed", error=str(e)[:200])
    return s

@app.delete("/api/research/{i}/sources/{sid}")
def remove(i: str, sid: str):
    rs = get(i); rs["sources"][:] = [s for s in rs["sources"] if s["id"] != sid]; rs["texts"].pop(sid, None); return {"ok": True}

@app.post("/api/research/{i}/rubric")
async def rubric(i: str):
    rs = get(i); rs["rubric"] = await pipeline.make_rubric(rs["question"]); return rs["rubric"]
@app.put("/api/research/{i}/rubric")
def save_rubric(i: str, b: RubricIn): get(i)["rubric"] = b.rubric; return b.rubric

@app.post("/api/research/{i}/analyze")
async def analyze(i: str):
    rs = get(i); rs["events"].clear(); rs["result"] = None
    asyncio.create_task(pipeline.run(rs)); return {"jobId": i}

@app.get("/api/research/{i}/events")
async def events(i: str):
    rs = get(i)
    async def gen():
        n = 0
        while True:
            while n < len(rs["events"]):
                e = rs["events"][n]; n += 1; yield f"data: {json.dumps(e)}\n\n"
                if e["status"] == "failed" or (e["stage"] == "Checklist" and e["status"] == "done"): return
            await asyncio.sleep(0.4)
    return StreamingResponse(gen(), media_type="text/event-stream")

@app.get("/api/research/{i}/results")
def results(i: str):
    r = get(i)["result"]
    if not r: raise HTTPException(404, "No results yet")
    return r

@app.patch("/api/research/{i}/checklist/{k}")
def patch(i: str, k: str, b: D):
    r = results(i)
    for it in r["checklist"]:
        if it["id"] == k: it["done"] = b.done; return it
    raise HTTPException(404, "Unknown checklist item")

@app.get("/api/demo/scholarship")
def demo(): return json.loads(DEMO.read_text(encoding="utf-8"))

from .scholarships import search_all_scholarships

@app.get("/api/scholarships/search")
async def search_scholarships(q: str = "", category: str = "", course: str = ""):
    results = await search_all_scholarships(query=q, category=category, course=course)
    return {"query": q, "total": len(results), "scholarships": results}

