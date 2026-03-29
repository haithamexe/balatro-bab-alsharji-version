import type { RunState } from "../types/run";

const SAVE_KEY = "balatro-redux-prototype-save";

export function saveRun(state: RunState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadRun(): RunState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(SAVE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as RunState;
  } catch {
    window.localStorage.removeItem(SAVE_KEY);
    return null;
  }
}

export function clearSavedRun(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SAVE_KEY);
}
