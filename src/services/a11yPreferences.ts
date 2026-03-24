import { storage } from './storage';

export type Theme = 'light' | 'dark' | 'contrast';

export type A11yPreferences = {
  theme: Theme;
  bigText: boolean;
  bigSpace: boolean;
  focus: boolean;
  blindMode: boolean;
  motorMode: boolean;
  contentScale: number;
};

const DEFAULT_PREFS: A11yPreferences = {
  theme: 'light',
  bigText: false,
  bigSpace: false,
  focus: false,
  blindMode: false,
  motorMode: false,
  contentScale: 1
};

function readBool(key: string) {
  return storage.get(key) === '1';
}

function readTheme(): Theme {
  const saved = storage.get('theme');
  return saved === 'dark' || saved === 'contrast' ? saved : 'light';
}

function readScale() {
  const saved = Number(storage.get('a11y-content-scale') || '1');
  return Number.isFinite(saved) && saved >= 0.9 && saved <= 1.4 ? saved : 1;
}

export function loadA11yPreferences(): A11yPreferences {
  return {
    theme: readTheme(),
    bigText: readBool('a11y-text'),
    bigSpace: readBool('a11y-space'),
    focus: readBool('a11y-focus'),
    blindMode: readBool('a11y-blind'),
    motorMode: readBool('a11y-motor'),
    contentScale: readScale()
  };
}

export function saveA11yPreferences(prefs: A11yPreferences) {
  storage.set('theme', prefs.theme);
  storage.set('a11y-text', prefs.bigText ? '1' : '0');
  storage.set('a11y-space', prefs.bigSpace ? '1' : '0');
  storage.set('a11y-focus', prefs.focus ? '1' : '0');
  storage.set('a11y-blind', prefs.blindMode ? '1' : '0');
  storage.set('a11y-motor', prefs.motorMode ? '1' : '0');
  storage.set('a11y-content-scale', prefs.contentScale.toFixed(2));
}

export function applyA11yPreferences(prefs: A11yPreferences) {
  const html = document.documentElement;
  html.classList.remove('theme-dark', 'theme-contrast');

  if (prefs.theme === 'dark') html.classList.add('theme-dark');
  if (prefs.theme === 'contrast') html.classList.add('theme-contrast');

  html.classList.toggle('a11y-text', prefs.bigText);
  html.classList.toggle('a11y-space', prefs.bigSpace);
  html.classList.toggle('a11y-focus', prefs.focus);
  html.classList.toggle('a11y-motor', prefs.motorMode);
  html.style.setProperty('--content-scale', prefs.contentScale.toFixed(2));
}

export function getDefaultA11yPreferences(): A11yPreferences {
  return { ...DEFAULT_PREFS };
}
