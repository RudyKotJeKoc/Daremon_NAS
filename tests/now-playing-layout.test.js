import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8');

describe('now playing layout', () => {
  it('renders the player UI without the Daremon logo inside the layout grid', () => {
    expect(html).toContain('class="now-playing-layout"');

    const sectionMatch = html.match(
      /<section id="now-playing-section"[\s\S]*?<div class="now-playing-layout">([\s\S]*?)<div id="player-controls">/
    );

    expect(sectionMatch).toBeTruthy();
    expect(sectionMatch?.[1]).not.toContain('<img id="daremon-logo"');
    expect(sectionMatch?.[1]).toContain('<div id="player-ui">');
  });

  it('positions the Daremon logo and countdown inside the visualizer showcase', () => {
    const visualizerMatch = html.match(
      /<section id="visualizer-showcase"[\s\S]*?<\/section>/
    );

    expect(visualizerMatch).toBeTruthy();
    expect(visualizerMatch?.[0]).toContain('<img id="daremon-logo"');
    expect(visualizerMatch?.[0]).toContain('id="countdown-display"');
  });

  it('moves the Daremon invitation content into tabs placed under the player', () => {
    const mainMatch = html.match(
      /<main id="main-content">([\s\S]*?)<\/main>/
    );

    expect(mainMatch).toBeTruthy();

    const mainContent = mainMatch?.[1] ?? '';
    const nowPlayingIndex = mainContent.indexOf('id="now-playing-section"');
    const hubIndex = mainContent.indexOf('id="daremon-hub"');

    expect(nowPlayingIndex).toBeGreaterThanOrEqual(0);
    expect(hubIndex).toBeGreaterThan(nowPlayingIndex);
    expect(mainContent).toContain('role="tablist"');
    expect(mainContent).toContain('role="tabpanel"');

    const hiddenPanelMatch = mainContent.match(/role="tabpanel"[\s\S]*?hidden/);
    expect(hiddenPanelMatch).toBeTruthy();
  });
});
