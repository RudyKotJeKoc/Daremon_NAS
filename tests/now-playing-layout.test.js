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

  it('places the slideshow container directly after the now playing section', () => {
    expect(html).not.toContain('id="visualizer-showcase"');

    const nowPlayingIndex = html.indexOf('<section id="now-playing-section"');
    const slideshowIndex = html.indexOf('<div id="slideshow-container"');

    expect(nowPlayingIndex).toBeGreaterThan(-1);
    expect(slideshowIndex).toBeGreaterThan(-1);
    expect(slideshowIndex).toBeGreaterThan(nowPlayingIndex);
  });

});
