/* @vitest-environment jsdom */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../survey-api.js', () => ({
    submitSurvey: vi.fn().mockResolvedValue({ success: true, offline: true })
}));

const { initializeGranulateSurvey } = await import('../granulate-survey.js');

const createMockStorage = () => {
    const store = new Map();
    return {
        getItem: (key) => (store.has(key) ? store.get(key) : null),
        setItem: (key, value) => {
            store.set(key, value);
        },
        removeItem: (key) => {
            store.delete(key);
        },
        clear: () => store.clear()
    };
};

beforeAll(() => {
    vi.stubGlobal('localStorage', createMockStorage());
});

describe('Granulate survey accessibility', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `
            <div id="granulate-survey-success" class="success-message hidden" role="status"></div>
            <form id="granulate-survey-form">
                <div>
                    <input type="radio" name="experience" value="less-3m">
                    <input type="radio" name="factory" value="boxtel">
                    <input type="radio" name="role" value="operator">
                </div>
                <button type="submit">Submit</button>
                <button type="button" id="granulate-survey-results-btn">Show results</button>
            </form>
            <div id="granulate-survey-results" class="survey-results hidden" aria-hidden="true">
                <div id="granulate-survey-results-content"></div>
                <button id="close-granulate-results-btn">Close</button>
            </div>
        `;
    });

    it('initializes accessible results toggling', () => {
        initializeGranulateSurvey();

        const resultsButton = document.getElementById('granulate-survey-results-btn');
        const resultsRegion = document.getElementById('granulate-survey-results');

        expect(resultsButton?.getAttribute('aria-controls')).toBe('granulate-survey-results');
        expect(resultsButton?.getAttribute('aria-expanded')).toBe('false');

        resultsButton?.click();

        expect(resultsRegion?.classList.contains('hidden')).toBe(false);
        expect(resultsButton?.getAttribute('aria-expanded')).toBe('true');

        document.getElementById('close-granulate-results-btn')?.click();

        expect(resultsRegion?.classList.contains('hidden')).toBe(true);
        expect(resultsButton?.getAttribute('aria-expanded')).toBe('false');
    });

    it('surfaces validation feedback to assistive tech', () => {
        initializeGranulateSurvey();

        const form = document.getElementById('granulate-survey-form');
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

        const feedback = document.querySelector('.survey-validation-error');

        expect(feedback?.getAttribute('role')).toBe('alert');
        expect(feedback?.getAttribute('aria-live')).toBe('assertive');
        expect(form?.getAttribute('aria-describedby')).toContain('granulate-survey-feedback');
    });
});
