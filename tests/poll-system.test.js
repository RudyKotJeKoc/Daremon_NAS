import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { PollSystem } from '../poll-system.js';

const createStorageMock = () => {
    const store = new Map();
    return {
        getItem: vi.fn(key => (store.has(key) ? store.get(key) : null)),
        setItem: vi.fn((key, value) => {
            store.set(key, value);
        })
    };
};

describe('PollSystem', () => {
    beforeEach(() => {
        const storage = createStorageMock();
        global.window = { localStorage: storage };
    });

    afterEach(() => {
        vi.resetAllMocks();
        delete global.window;
    });

    it('records single-choice votes', () => {
        const pollSystem = new PollSystem();
        const poll = pollSystem.addPoll({
            question: 'Ulubiony utwór?',
            type: 'single-choice',
            options: ['Kaput', 'Rompa']
        });

        pollSystem.recordVote(poll, { selectedIds: [poll.options[0].id] });

        const results = pollSystem.getResults(poll.id);
        expect(results.totalVotes).toBe(1);
        expect(results.results[0].votes).toBe(1);
        expect(results.results[0].percentage).toBe(100);
    });

    it('stores open-text responses', () => {
        const pollSystem = new PollSystem();
        const poll = pollSystem.addPoll({
            question: 'Pomysł na nową funkcję?',
            type: 'open-text'
        });

        pollSystem.recordVote(poll, { openText: 'Więcej ankiet!' });
        const results = pollSystem.getResults(poll.id);

        expect(results.totalVotes).toBe(1);
        expect(results.responses[0]).toBe('Więcej ankiet!');
    });

    it('persists votes in localStorage', () => {
        const pollSystem = new PollSystem();
        const poll = pollSystem.addPoll({
            question: 'Preferowany gatunek?',
            type: 'multiple-choice',
            options: ['Electro', 'Rock']
        });

        pollSystem.recordVote(poll, { selectedIds: poll.options.map(option => option.id) });
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'daremon_poll_data_v1',
            expect.any(String)
        );
    });
});
