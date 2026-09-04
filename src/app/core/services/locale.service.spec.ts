import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { localeIdToAppLocale, LocaleService } from './locale.service';

describe('LocaleService', () => {
  let originalUrl: string;

  beforeEach(() => {
    originalUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  });

  afterEach(() => {
    history.replaceState(null, '', originalUrl);
    TestBed.resetTestingModule();
  });

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
});
