import { inject, Injectable, LOCALE_ID } from '@angular/core';

export const SUPPORTED_LOCALES = ['en', 'it'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = SUPPORTED_LOCALES[0];
export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: $localize`English`,
  it: $localize`Italian`,
};

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  readonly currentLocale = localeIdToAppLocale(inject(LOCALE_ID));

  switchLocale(locale: AppLocale): void {
    persistLocale(locale);
    window.location.assign(this.localizedUrl(locale));
  }

  localizedUrl(locale: AppLocale): string {
    const url = new URL(window.location.href);
    const segments = url.pathname.split('/');

    if (isSupportedLocale(segments[1])) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }

    url.pathname = normalizeLocalePath(segments.join('/'));
    return `${url.pathname}${url.search}${url.hash}`;
  }
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

function persistLocale(locale: AppLocale): void {
  if (typeof document === 'undefined') return;
  document.cookie = `nf_lang=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function normalizeLocalePath(path: string): string {
  const normalized = path.replace(/\/+/g, '/');
  if (SUPPORTED_LOCALES.some((locale) => normalized === `/${locale}`)) {
    return `${normalized}/`;
  }
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}
