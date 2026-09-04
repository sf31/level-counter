import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  getSavedLocale,
  localeIdToAppLocale,
  LocaleService,
  LSK_LOCALE,
  persistLocale,
  redirectToSavedLocale,
} from './locale.service';

describe('LocaleService', () => {
  let originalUrl: string;

  beforeEach(() => {
    originalUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    localStorage.removeItem(LSK_LOCALE);
    clearLocaleCookie();
  });

  afterEach(() => {
    history.replaceState(null, '', originalUrl);
    localStorage.removeItem(LSK_LOCALE);
    clearLocaleCookie();
    TestBed.resetTestingModule();
  });

  function setLocaleCookie(locale: string): void {
    document.cookie = `nf_lang=${locale}; Path=/; Max-Age=3600`;
  }

  function clearLocaleCookie(): void {
    document.cookie = 'nf_lang=; Path=/; Max-Age=0';
  }

  function createService(localeId: string): LocaleService {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: localeId }],
    });
    return TestBed.inject(LocaleService);
  }

  it('uses LOCALE_ID as the current locale instead of the URL', () => {
    history.replaceState(null, '', '/it/parties');

    expect(createService('en').currentLocale).toBe('en');
  });

  it('normalizes regional locale IDs', () => {
    expect(localeIdToAppLocale('it-IT')).toBe('it');
    expect(localeIdToAppLocale('en-US')).toBe('en');
    expect(localeIdToAppLocale('fr-FR')).toBe('en');
  });

  it('prefers a valid localStorage locale over the cookie', () => {
    localStorage.setItem(LSK_LOCALE, 'it');
    setLocaleCookie('en');

    expect(getSavedLocale()).toBe('it');
  });

  it('uses the cookie for users without a localStorage preference', () => {
    setLocaleCookie('it');

    expect(getSavedLocale()).toBe('it');
  });

  it('rejects invalid saved locale values', () => {
    localStorage.setItem(LSK_LOCALE, 'fr');
    setLocaleCookie('it');

    expect(getSavedLocale()).toBe('it');

    setLocaleCookie('fr');
    expect(getSavedLocale()).toBeNull();
  });

  it('corrects an explicit locale while preserving route, query, and hash', () => {
    localStorage.setItem(LSK_LOCALE, 'it');
    const replace = jasmine.createSpy('replace');
    const location = {
      hostname: 'level-counter.example',
      pathname: '/en/parties/party-1',
      search: '?from=home',
      hash: '#active',
      replace,
    };

    expect(redirectToSavedLocale(location)).toBeTrue();
    expect(replace).toHaveBeenCalledWith(
      '/it/parties/party-1?from=home#active',
    );
  });

  it('does not redirect without a differing explicit locale or valid preference', () => {
    const replace = jasmine.createSpy('replace');
    const location = {
      hostname: 'level-counter.example',
      pathname: '/parties/party-1',
      search: '',
      hash: '',
      replace,
    };

    expect(redirectToSavedLocale(location)).toBeFalse();
    expect(replace).not.toHaveBeenCalled();

    localStorage.setItem(LSK_LOCALE, 'it');
    location.pathname = '/it/parties/party-1';
    expect(redirectToSavedLocale(location)).toBeFalse();
    expect(replace).not.toHaveBeenCalled();
  });

  it('does not redirect local development hosts', () => {
    localStorage.setItem(LSK_LOCALE, 'it');
    const replace = jasmine.createSpy('replace');
    const location = {
      hostname: 'localhost',
      pathname: '/en/parties',
      search: '',
      hash: '',
      replace,
    };

    expect(redirectToSavedLocale(location)).toBeFalse();
    expect(replace).not.toHaveBeenCalled();
  });

  it('preserves the localized route when switching locale', () => {
    history.replaceState(null, '', '/it/parties?from=home#active');

    const service = createService('it');

    expect(service.localizedUrl('en')).toBe('/en/parties?from=home#active');
  });

  it('adds a locale prefix while preserving an unlocalized route', () => {
    history.replaceState(null, '', '/parties/party-1');

    const service = createService('en');

    expect(service.localizedUrl('it')).toBe('/it/parties/party-1');
  });

  it('persists the locale preference in localStorage and the cookie', () => {
    persistLocale('it');

    expect(localStorage.getItem(LSK_LOCALE)).toBe('it');
    expect(document.cookie).toContain('nf_lang=it');
  });
});
