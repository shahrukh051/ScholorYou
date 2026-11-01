import type { StudentProfile } from "../types";

const STORAGE_KEY = "scholoryou_student_profile";
const LEGACY_STORAGE_KEY = "dds_student_profile";
const EVENT_NAME = "scholoryou_student_profile_changed";

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: "Aditya Verma",
  email: "aditya.v@iitd.ac.in",
  college: "IIT Delhi",
  course: "B.Tech Computer Science",
  year: "2nd Year",
  category: "OBC-NCL",
  state: "Delhi",
  familyIncome: "₹2.5L - ₹6.0 Lakhs",
  gpaOrMarks: "8.4 CGPA"
};

export function getStoredProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: profile }));
  } catch (e) {
    console.error("Failed to save student profile", e);
  }
}

export function clearStoredProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
  } catch (e) {
    console.error("Failed to clear student profile", e);
  }
}

export function subscribeToProfile(callback: (profile: StudentProfile | null) => void): () => void {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<StudentProfile | null>;
    callback(custom.detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("dds_student_profile_changed", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("dds_student_profile_changed", handler);
  };
}
