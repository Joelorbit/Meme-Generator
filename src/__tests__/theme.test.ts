import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getThemeMode,
  toggleColorMode,
  readStoredMode,
  applyTheme,
  DEFAULT_THEME,
  DEFAULT_LIGHT_THEME
} from '../lib/theme';

describe('Theme Engine Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = '';
    document.documentElement.dataset.mode = '';
  });

  it('should identify light and dark theme modes properly', () => {
    expect(getThemeMode('monochrome-light')).toBe('light');
    expect(getThemeMode('eyu-light')).toBe('light');
    expect(getThemeMode('light')).toBe('light');
    expect(getThemeMode('monochrome-dark')).toBe('dark');
    expect(getThemeMode('dark')).toBe('dark');
  });

  it('should toggle theme mode between light and dark', () => {
    expect(toggleColorMode('dark')).toBe('light');
    expect(toggleColorMode('light')).toBe('dark');
  });

  it('should read stored mode from localStorage or fallback', () => {
    expect(readStoredMode('dark')).toBe('dark');
    localStorage.setItem('eyu-mode', 'light');
    expect(readStoredMode('dark')).toBe('light');
  });

  it('should apply theme attributes to document element', () => {
    const result = applyTheme('monochrome-dark', true, 'dark');
    expect(result).toBe('monochrome-dark');
    expect(document.documentElement.dataset.mode).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('monochrome-dark');
    expect(localStorage.getItem('eyu-mode')).toBe('dark');
  });

  it('should apply light theme when toggled', () => {
    const result = applyTheme('monochrome-light', true, 'light');
    expect(result).toBe('monochrome-light');
    expect(document.documentElement.dataset.mode).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('monochrome-light');
    expect(localStorage.getItem('eyu-mode')).toBe('light');
  });
});
