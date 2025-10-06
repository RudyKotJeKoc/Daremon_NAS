import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appJs = readFileSync(resolve(__dirname, '../app.js'), 'utf-8');

describe('visualizer regression safeguards', () => {
  it('cancels pending animation frames when the loop stops', () => {
    const cancelRegex = /function stopVisualizerLoop\(\)\s*{[\s\S]*?cancelAnimationFrame\(visualizerAnimationId\);/;
    expect(cancelRegex.test(appJs)).toBe(true);
  });

  it('guards the visualizer before scheduling new frames', () => {
    const guardRegex = /function drawVisualizer\(\)\s*{[\s\S]*?if \(!analyser \|\| !state\.isPlaying \|\| !dom\.visualizerCanvas\) {\s*stopVisualizerLoop\(\);[\s\S]*?return;\s*}/;
    expect(guardRegex.test(appJs)).toBe(true);
  });
});
