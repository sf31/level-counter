import { detectPwaInstallGuide } from './pwa.utils';

describe('detectPwaInstallGuide', () => {
  it('detects Firefox on Android', () => {
    const guide = detectPwaInstallGuide(
      'Mozilla/5.0 (Android 16; Mobile; rv:150.0) Gecko/150.0 Firefox/150.0',
    );

    expect(guide.id).toBe('firefox-android');
  });

  it('uses the generic fallback for Samsung Internet', () => {
    const guide = detectPwaInstallGuide(
      'Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 Chrome/150.0 Mobile Safari/537.36 SamsungBrowser/29.0',
    );

    expect(guide.id).toBe('generic');
  });

  it('uses the Chromium guide for Chrome on Android', () => {
    const guide = detectPwaInstallGuide(
      'Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 Chrome/150.0 Mobile Safari/537.36',
    );

    expect(guide.id).toBe('chromium-android');
  });

  it('detects Firefox on Windows', () => {
    const guide = detectPwaInstallGuide(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0',
    );

    expect(guide.id).toBe('firefox-windows');
  });

  it('reports unsupported Firefox desktop platforms', () => {
    const guide = detectPwaInstallGuide(
      'Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0',
    );

    expect(guide.id).toBe('firefox-unsupported');
  });

  it('detects iPadOS when it identifies itself as macOS', () => {
    const guide = detectPwaInstallGuide(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
      'MacIntel',
      5,
    );

    expect(guide.id).toBe('ios');
  });

  it('detects Safari on macOS', () => {
    const guide = detectPwaInstallGuide(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
      'MacIntel',
    );

    expect(guide.id).toBe('safari-macos');
  });

  it('uses the shared Chromium desktop guide for Edge', () => {
    const guide = detectPwaInstallGuide(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0 Safari/537.36 Edg/150.0',
    );

    expect(guide.id).toBe('chromium-desktop');
  });

  it('falls back safely for an unknown browser', () => {
    const guide = detectPwaInstallGuide('Unknown Browser');

    expect(guide.id).toBe('generic');
  });
});
