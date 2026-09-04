export type PwaInstallGuideId =
  | 'chromium-android'
  | 'chromium-desktop'
  | 'firefox-android'
  | 'firefox-unsupported'
  | 'firefox-windows'
  | 'ios'
  | 'safari-macos'
  | 'generic';

export interface PwaInstallGuide {
  id: PwaInstallGuideId;
  title: string;
  steps: readonly string[];
}

export const PWA_INSTALL_GUIDES: readonly PwaInstallGuide[] = [
  {
    id: 'chromium-android',
    title: $localize`Chrome / Edge — Android`,
    steps: [
      $localize`Open the three-dot menu.`,
      $localize`Choose Install app or Add to Home screen.`,
      $localize`Follow the confirmation shown by the browser.`,
    ],
  },
  {
    id: 'chromium-desktop',
    title: $localize`Chrome / Edge — Linux, macOS, Windows`,
    steps: [
      $localize`Select the install icon in the address bar, if shown.`,
      $localize`Otherwise, look for Install app in the browser menu.`,
      $localize`Follow the confirmation shown by the browser.`,
    ],
  },
  {
    id: 'firefox-android',
    title: $localize`Firefox — Android`,
    steps: [
      $localize`Open the three-dot menu.`,
      $localize`Tap Install.`,
      $localize`Confirm with Add automatically, or place the icon yourself.`,
    ],
  },
  {
    id: 'firefox-unsupported',
    title: $localize`Firefox — Linux/macOS (not supported)`,
    steps: [
      $localize`Firefox does not currently install web apps on macOS or Linux.`,
      $localize`You can still use LevelCounter in Firefox and bookmark it for quick access.`,
    ],
  },
  {
    id: 'firefox-windows',
    title: $localize`Firefox — Windows`,
    steps: [
      $localize`Use Firefox 143 or later.`,
      $localize`Click the web app button in the address bar.`,
      $localize`Optionally pin LevelCounter to the taskbar when prompted.`,
    ],
  },
  {
    id: 'ios',
    title: $localize`Safari — iPhone/iPad`,
    steps: [
      $localize`Open the Share menu.`,
      $localize`Choose Add to Home Screen.`,
      $localize`Turn on Open as Web App, then tap Add.`,
    ],
  },
  {
    id: 'safari-macos',
    title: $localize`Safari — macOS`,
    steps: [
      $localize`Open the File menu.`,
      $localize`Choose Add to Dock.`,
      $localize`Confirm with Add.`,
    ],
  },
  {
    id: 'generic',
    title: $localize`Other browser/device`,
    steps: [
      $localize`Open the browser menu and look for Install app or Add to Home screen.`,
      $localize`If it is not available, your browser or device may not support installing web apps.`,
    ],
  },
];

export function detectPwaInstallGuide(
  userAgent: string,
  platform = '',
  maxTouchPoints = 0,
): PwaInstallGuide {
  const ua = userAgent.toLowerCase();
  const isIpad =
    ua.includes('ipad') || (platform === 'MacIntel' && maxTouchPoints > 1);

  if (/iphone|ipod/.test(ua) || isIpad) {
    return guide('ios');
  }

  if (ua.includes('android')) {
    if (ua.includes('samsungbrowser')) return guide('generic');
    if (ua.includes('firefox') || ua.includes('fennec')) {
      return guide('firefox-android');
    }
    return guide('chromium-android');
  }

  if (ua.includes('firefox')) {
    return ua.includes('windows')
      ? guide('firefox-windows')
      : guide('firefox-unsupported');
  }

  if (ua.includes('edg/') || ua.includes('chrome') || ua.includes('chromium')) {
    return guide('chromium-desktop');
  }
  if (ua.includes('safari') && ua.includes('macintosh')) {
    return guide('safari-macos');
  }

  return guide('generic');
}

function guide(id: PwaInstallGuideId): PwaInstallGuide {
  return PWA_INSTALL_GUIDES.find((item) => item.id === id)!;
}
