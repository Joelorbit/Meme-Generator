export type ThemeMode = 'light' | 'dark';
export type ThemeId = string;

export const DEFAULT_THEME: ThemeId = 'default';
export const DEFAULT_LIGHT_THEME: ThemeId = 'default';
export const THEME_STORAGE_KEY = 'memestudio-theme';
export const MOTION_STORAGE_KEY = 'memestudio-motion';
export const MODE_STORAGE_KEY = 'memestudio-mode';

function canUseDOM() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function getSystemMode(): ThemeMode {
  if (!canUseDOM()) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function getThemeMode(themeId: ThemeId): ThemeMode {
  return themeId.includes('light') || themeId === 'light' ? 'light' : 'dark';
}

export function readStoredMode(fallback: ThemeMode = 'dark'): ThemeMode {
  if (!canUseDOM()) return fallback;
  const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  const legacy = window.localStorage.getItem('theme');
  if (legacy === 'light' || legacy === 'dark') return legacy;
  return fallback;
}

export function applyTheme(themeId: ThemeId, persist = true, mode?: ThemeMode) {
  if (!canUseDOM()) return themeId;
  const activeMode = mode || (document.documentElement.dataset.mode as ThemeMode | undefined) || getThemeMode(themeId);
  document.documentElement.dataset.theme = themeId;
  document.documentElement.dataset.mode = activeMode;
  document.documentElement.style.colorScheme = activeMode;
  if (persist) {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeId);
    window.localStorage.setItem(MODE_STORAGE_KEY, activeMode);
  }
  return themeId;
}

export function readStoredTheme(fallback = DEFAULT_THEME): ThemeId {
  if (!canUseDOM()) return fallback;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) || window.localStorage.getItem('theme');
  if (stored === 'light') return DEFAULT_LIGHT_THEME;
  if (stored === 'dark') return fallback;
  return stored || fallback;
}

export function toggleMode(currentTheme: ThemeId): ThemeId {
  return getThemeMode(currentTheme) === 'dark' ? DEFAULT_LIGHT_THEME : DEFAULT_THEME;
}

export function toggleColorMode(currentMode: ThemeMode): ThemeMode {
  return currentMode === 'dark' ? 'light' : 'dark';
}

export function applyMotionPreference(preference: 'system' | 'full' | 'reduced' = 'system', persist = true) {
  if (!canUseDOM()) return preference;
  const reduced = preference === 'reduced' || (preference === 'system' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  if (persist) window.localStorage.setItem(MOTION_STORAGE_KEY, preference);
  return preference;
}

export function readStoredMotion(): 'system' | 'full' | 'reduced' {
  if (!canUseDOM()) return 'system';
  const value = window.localStorage.getItem(MOTION_STORAGE_KEY);
  return value === 'full' || value === 'reduced' ? value : 'system';
}
