import { describe, expect, it } from 'vitest';
import { createInitialState } from '../state.js';

describe('createInitialState', () => {
    it('initializes failure tracking helpers to safe defaults', () => {
        const state = createInitialState();
        expect(Array.isArray(state.failedTracks)).toBe(true);
        expect(state.failedTracks).toHaveLength(0);
        expect(() => state.failedTracks.includes('any')).not.toThrow();
    });

    it('creates recent rotation helpers ready for use', () => {
        const state = createInitialState();
        expect(Array.isArray(state.recentRotation)).toBe(true);
        expect(state.recentRotation).toHaveLength(0);
        expect(state.recentTrackSet instanceof Set).toBe(true);
        expect(state.nextGroupPreference).toBe('recent');
    });
});
