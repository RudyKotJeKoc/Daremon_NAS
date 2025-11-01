import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

import {
  calculateProgress,
  formatTimeParts,
  initCountdownTimers,
  __TIMER_DEFINITIONS__,
} from '../countdown-timers.js';

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

describe('deadlines countdown timers', () => {
  it('renders accessible deadline timers with progress bars', () => {
    expect(html).toContain('id="deadlines-section"');
    expect(html).toContain('role="timer"');
    expect(html).toContain('class="timer-bar"');
    expect(html).toContain('class="timer-fill"');
  });

  it('formats countdown values as DD:HH:MM:SS', () => {
    const formatted = formatTimeParts({ days: 12, hours: 3, minutes: 5, seconds: 9 });
    expect(formatted).toBe('12:03:05:09');
  });

  it('updates timer text, aria-label and progress fill', () => {
    const dom = new JSDOM(`
      <section>
        <article data-deadline-id="year-end-2025">
          <div class="timer-display" role="timer" aria-live="polite">
            <span class="timer-value" data-time-remaining>00:00:00:00</span>
          </div>
          <div class="timer-bar">
            <div class="timer-fill"></div>
          </div>
        </article>
      </section>
    `);

    const [config] = __TIMER_DEFINITIONS__;
    const midpoint = new Date((config.start.getTime() + config.deadline.getTime()) / 2);

    initCountdownTimers(dom.window.document, {
      nowProvider: () => midpoint,
      scheduler: () => undefined,
    });

    const valueNode = dom.window.document.querySelector('[data-deadline-id="year-end-2025"] .timer-value');
    expect(valueNode?.textContent).toMatch(/^\d{2,}:\d{2}:\d{2}:\d{2}$/);

    const ariaLabel = dom.window.document
      .querySelector('[data-deadline-id="year-end-2025"] [role="timer"]')
      ?.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain(config.label);

    const fill = dom.window.document.querySelector('[data-deadline-id="year-end-2025"] .timer-fill');
    const progressValue = fill?.dataset.progress ? Number(fill.dataset.progress) : NaN;
    const expectedProgress = calculateProgress(midpoint, config.start, config.deadline);
    expect(progressValue).not.toBeNaN();
    expect(progressValue).toBeCloseTo(expectedProgress, 2);
  });
});
