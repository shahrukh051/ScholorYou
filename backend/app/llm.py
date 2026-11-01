import json, os
import httpx
from pydantic import BaseModel, ValidationError

class LLMError(Exception): ...

async def complete_json(system: str, user: str, schema: type[BaseModel]):
    base = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
    sys = system + "\nReturn ONLY JSON matching this schema: " + json.dumps(schema.model_json_schema())
    msgs = [{"role": "system", "content": sys}, {"role": "user", "content": user}]
    async with httpx.AsyncClient(timeout=60) as c:
        for _ in range(2):  # one repair retry
            r = await c.post(f"{base}/chat/completions",
                headers={"Authorization": "Bearer " + os.getenv("LLM_API_KEY", "")},
                json={"model": os.getenv("LLM_MODEL", "gpt-4o-mini"), "temperature": 0.1, "messages": msgs,
                      "response_format": {"type": "json_object"}})
            r.raise_for_status()
            txt = r.json()["choices"][0]["message"]["content"]
            try: return schema.model_validate_json(txt)
            except ValidationError as e:
                msgs += [{"role": "assistant", "content": txt}, {"role": "user", "content": f"Invalid JSON for the schema ({e.error_count()} errors). Fix it and return only JSON."}]
    raise LLMError("Model returned invalid JSON twice")
