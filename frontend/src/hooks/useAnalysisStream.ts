import { useEffect, useState } from "react"; import { B } from "../api/client";
export type Ev = { stage: string; status: "running" | "done" | "failed"; detail: string };
export function useAnalysisStream(id: string, on: boolean) {
  const [ev, setEv] = useState<Ev[]>([]);
  useEffect(() => { if (!on) return; setEv([]);
    const es = new EventSource(`${B}/research/${id}/events`);
    es.onmessage = e => setEv(p => [...p, JSON.parse(e.data)]); es.onerror = () => es.close();
    return () => es.close(); }, [id, on]);
  return ev;
}
