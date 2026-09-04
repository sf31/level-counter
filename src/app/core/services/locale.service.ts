import { inject, Injectable, LOCALE_ID } from '@angular/core';

export const SUPPORTED_LOCALES = ['en', 'it'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = SUPPORTED_LOCALES[0];
export const LSK_LOCALE = 'level-counter-locale';
export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: $localize`English`,
  it: $localize`Italian`,
};

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const LOCALE_COOKIE_NAME = 'nf_lang';

type LocaleLocation = Pick<
  Location,
  'hostname' | 'pathname' | 'search' | 'hash' | 'replace'
>;

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  readonly currentLocale = localeIdToAppLocale(inject(LOCALE_ID));

  switchLocale(locale: AppLocale): void {
    if (!isSupportedLocale(locale)) return;

    persistLocale(locale);
    window.location.replace(this.localizedUrl(locale));
  }

  localizedUrl(locale: AppLocale): string {
    const url = new URL(window.location.href);
    url.pathname = localizedPath(url.pathname, locale);
    return `${url.pathname}${url.search}${url.hash}`;
  }
}

export function redirectToSavedLocale(location?: LocaleLocation): boolean {
  if (!location) {
    if (typeof window === 'undefined') return false;
    location = window.location;
  }

  if (isLocalDevelopmentHost(location.hostname)) return false;

  const savedLocale = getSavedLocale();
  const currentLocale = pathLocale(location.pathname);
  if (!savedLocale || !currentLocale || currentLocale === savedLocale) {
    return false;
  }

  location.replace(
    `${localizedPath(location.pathname, savedLocale)}${location.search}${location.hash}`,
  );
  return true;
}

export function getSavedLocale(): AppLocale | null {
  const storedLocale = readStoredLocale();
  const parsedStoredLocale = parseLocale(storedLocale);
  if (parsedStoredLocale) return parsedStoredLocale;

  return parseLocale(readLocaleCookie());
}

export function isSupportedLocale(
  value: string | undefined | null,
): value is AppLocale {
  return (
    typeof value === 'string' &&
    SUPPORTED_LOCALES.some((supportedLocale) => supportedLocale === value)
  );
}

export function localeIdToAppLocale(localeId: string): AppLocale {
  const language = localeId.toLowerCase().split(/[-_]/)[0];
  return isSupportedLocale(language) ? language : DEFAULT_LOCALE;
}

export function persistLocale(locale: AppLocale): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LSK_LOCALE, locale);
    } catch {
      // Continue with the cookie fallback when storage is unavailable.
    }
  }

  if (typeof document !== 'undefined') {
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
  }
}

function readStoredLocale(): string | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    return localStorage.getItem(LSK_LOCALE);
  } catch {
    return null;
  }
}

function readLocaleCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE_NAME}=`));
  return cookie?.slice(LOCALE_COOKIE_NAME.length + 1) ?? null;
}

function parseLocale(value: string | null): AppLocale | null {
  return isSupportedLocale(value) ? value : null;
}

function pathLocale(path: string): AppLocale | null {
  const pathLocale = path.split('/')[1];
  return isSupportedLocale(pathLocale) ? pathLocale : null;
}

function localizedPath(path: string, locale: AppLocale): string {
  const segments = path.split('/');

  if (isSupportedLocale(segments[1])) {
    segments[1] = locale;
  } else {
    segments.splice(1, 0, locale);
  }

  return normalizeLocalePath(segments.join('/'));
}

function normalizeLocalePath(path: string): string {
  const normalized = path.replace(/\/+/g, '/');
  if (SUPPORTED_LOCALES.some((locale) => normalized === `/${locale}`)) {
    return `${normalized}/`;
  }
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function isLocalDevelopmentHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '[::1]'
  );
}
