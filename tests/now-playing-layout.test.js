import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8');

describe('now playing layout', () => {
  it('keeps the Daremon logo centered inside the player layout container', () => {
    expect(html).toContain('class="now-playing-layout"');

    const sectionMatch = html.match(
      /<section id="now-playing-section"[\s\S]*?<div class="now-playing-layout">([\s\S]*?)<div id="player-controls">/
    );

    expect(sectionMatch).toBeTruthy();
    expect(sectionMatch?.[1]).toContain('<img id="daremon-logo"');
    expect(sectionMatch?.[1]).toContain('<div id="player-ui">');
  });
});
