import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, it, expect } from 'vitest';

const localesDir = join(process.cwd(), 'locales');

const loadLocale = (code) => {
  const filePath = join(localesDir, `${code}.json`);
  const raw = readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
};

describe('locale files', () => {
  const pl = loadLocale('pl');
  const nl = loadLocale('nl');

  it('expose the same translation keys for all supported languages', () => {
    const plKeys = Object.keys(pl).sort();
    const nlKeys = Object.keys(nl).sort();
    expect(nlKeys).toEqual(plKeys);
  });

  it('contain countdown and polls accessibility labels', () => {
    const requiredKeys = [
      'sidePanelLabel',
      'drawerMenuLabel',
      'logoLinkLabel',
      'countdownHeading',
      'countdownIntro',
      'countdownDays',
      'countdownHours',
      'countdownMinutes',
      'countdownSeconds',
      'countdownStatusTemplate',
      'countdownStatusComplete',
      'countdownAriaLive',
      'countdownAriaLabel',
      'pollsHeading',
      'pollsDescription',
      'pollsCta',
      'pollsCtaLabel',
      'pollsRegionLabel',
    ];

    requiredKeys.forEach((key) => {
      expect(pl[key], `pl locale missing key ${key}`).toBeTruthy();
      expect(nl[key], `nl locale missing key ${key}`).toBeTruthy();
    });
  });
});
