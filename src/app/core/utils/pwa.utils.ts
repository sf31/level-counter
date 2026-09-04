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
    title: 'Chrome / Edge — Android',
    steps: [
      'Open the three-dot menu.',
      'Choose Install app or Add to Home screen.',
      'Follow the confirmation shown by the browser.',
    ],
  },
  {
    id: 'chromium-desktop',
    title: 'Chrome / Edge — Linux, macOS, Windows',
    steps: [
      'Select the install icon in the address bar, if shown.',
      'Otherwise, look for Install app in the browser menu.',
      'Follow the confirmation shown by the browser.',
    ],
  },
  {
    id: 'firefox-android',
    title: 'Firefox — Android',
    steps: [
      'Open the three-dot menu.',
      'Tap Install.',
      'Confirm with Add automatically, or place the icon yourself.',
    ],
  },
  {
    id: 'firefox-unsupported',
    title: 'Firefox — Linux/macOS (not supported)',
    steps: [
      'Firefox does not currently install web apps on macOS or Linux.',
      'You can still use LevelCounter in Firefox and bookmark it for quick access.',
    ],
  },
  {
    id: 'firefox-windows',
    title: 'Firefox — Windows',
    steps: [
      'Use Firefox 143 or later.',
      'Click the web app button in the address bar.',
      'Optionally pin LevelCounter to the taskbar when prompted.',
    ],
  },
  {
    id: 'ios',
    title: 'Safari — iPhone/iPad',
    steps: [
      'Open the Share menu.',
      'Choose Add to Home Screen.',
      'Turn on Open as Web App, then tap Add.',
    ],
  },
  {
    id: 'safari-macos',
    title: 'Safari — macOS',
    steps: ['Open the File menu.', 'Choose Add to Dock.', 'Confirm with Add.'],
  },
  {
    id: 'generic',
    title: 'Other browser/device',
    steps: [
      'Open the browser menu and look for Install app or Add to Home screen.',
      'If it is not available, your browser or device may not support installing web apps.',
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
