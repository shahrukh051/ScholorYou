import mock from "../mock/scholarship.json";
import type { Result, Source } from "../types";
export const B: string = import.meta.env.VITE_API_BASE || "/api";
async function j<T>(p: string, init?: RequestInit): Promise<T> {
  const r = await fetch(B + p, { headers: { "Content-Type": "application/json" }, ...init });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || `Request failed (${r.status})`);
  return r.json();
}
export type WebScholarship = {
  id: string;
  title: string;
  authority: string;
  portal_url: string;
  category: string;
  course: string;
  income_limit: string;
  min_score: string;
  benefit: string;
  deadline: string;
  known_discrepancies: string;
  api_source: string;
};

export const api = {
  create: (question: string) => j<{ id: string }>("/research", { method: "POST", body: JSON.stringify({ question }) }),
  addUrl: (id: string, url: string) => j<Source>(`/research/${id}/sources/url`, { method: "POST", body: JSON.stringify({ url }) }),
  remove: (id: string, sid: string) => j(`/research/${id}/sources/${sid}`, { method: "DELETE" }),
  analyze: (id: string) => j(`/research/${id}/analyze`, { method: "POST" }),
  toggle: (id: string, k: string, done: boolean) => j(`/research/${id}/checklist/${k}`, { method: "PATCH", body: JSON.stringify({ done }) }).catch(() => {}),
  searchScholarships: (q: string = "", category: string = "", course: string = "") =>
    j<{ query: string; total: number; scholarships: WebScholarship[] }>(
      `/scholarships/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&course=${encodeURIComponent(course)}`
    ),
};
export async function getResult(id: string): Promise<{ data: Result; sample: boolean }> {
  if (id !== "demo") try { return { data: await j<Result>(`/research/${id}/results`), sample: false }; } catch {}
  try { return { data: await j<Result>("/demo/scholarship"), sample: true }; } catch { return { data: mock as unknown as Result, sample: true }; }
}
