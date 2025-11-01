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

  it('places the active artwork container directly after the now playing section', () => {
    expect(html).not.toContain('id="visualizer-showcase"');

    const nowPlayingIndex = html.indexOf('<section id="now-playing-section"');
    const slideshowIndex = html.indexOf('<div id="slideshow-container"');
    const trackCoverIndex = html.indexOf('<div id="track-cover"');

    expect(nowPlayingIndex).toBeGreaterThan(-1);
    expect(trackCoverIndex).toBeGreaterThan(nowPlayingIndex);

    if (slideshowIndex !== -1) {
      expect(slideshowIndex).toBeGreaterThan(nowPlayingIndex);
    }
  });

  it('includes the Radio ETS logo in the header and sticky player', () => {
    const headerMatch = html.match(
      /<header id="app-header"[\s\S]*?<img(?=[^>]+src="\/images\/logo\.png")(?=[^>]+class="app-logo")[^>]*>/
    );

    expect(headerMatch).toBeTruthy();
    expect(headerMatch?.[0]).toContain('aria-hidden="true"');

    const stickyMatch = html.match(
      /<div id="sticky-player"[\s\S]*?<img(?=[^>]+src="\/images\/logo\.png")(?=[^>]+class="sticky-player-logo")[^>]*>/
    );

    expect(stickyMatch).toBeTruthy();
    expect(stickyMatch?.[0]).toContain('aria-hidden="true"');
  });

});
