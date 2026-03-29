import { useSyncExternalStore } from 'react';

interface Preferences {
  theme: 'light' | 'dark';
  a11y: boolean;
  lowCarbon: boolean;
}

const STORAGE_KEY = 'app-preferences';

const defaults: Preferences = {
  theme: 'light',
  a11y: false,
  lowCarbon: false,
};

let state: Preferences = { ...defaults };
const listeners = new Set<() => void>();

function load(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {
    /* corrupted value -- fall through to defaults */
  }
  return { ...defaults };
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyClasses() {
  const root = document.documentElement;
  root.classList.toggle('theme-atelier-dark', state.theme === 'dark');
  root.classList.toggle('a11y', state.a11y);
  root.classList.toggle('low-carbon', state.lowCarbon);
}

function emit() {
  listeners.forEach((l) => l());
}

function update(patch: Partial<Preferences>) {
  state = { ...state, ...patch };
  persist();
  applyClasses();
  emit();
}

// --- Initialise on module load (runs before first paint) ---
state = load();
applyClasses();

// --- Public API ---

export function toggleTheme() {
  update({ theme: state.theme === 'light' ? 'dark' : 'light' });
}

export function toggleA11y() {
  update({ a11y: !state.a11y });
}

export function toggleLowCarbon() {
  update({ lowCarbon: !state.lowCarbon });
}

function getSnapshot(): Preferences {
  return state;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function usePreferences(): Preferences {
  return useSyncExternalStore(subscribe, getSnapshot);
}
