import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage
const createStorageMock = () => {
    const store = new Map();
    return {
        getItem: vi.fn(key => (store.has(key) ? store.get(key) : null)),
        setItem: vi.fn((key, value) => {
            store.set(key, value);
        }),
        clear: vi.fn(() => store.clear())
    };
};

describe('localStorage Error Handling', () => {
    let originalWindow;
    let mockStorage;

    beforeEach(() => {
        originalWindow = global.window;
        mockStorage = createStorageMock();
        global.window = { 
            localStorage: mockStorage,
            CONFIG: { STORAGE_PREFIX: 'daremon' }
        };
    });

    afterEach(() => {
        global.window = originalWindow;
        vi.resetAllMocks();
    });

    // Simulate the safeLocalStorage function from app.js
    function safeLocalStorage(key, value) {
        // Guard clause for environment without localStorage
        if (typeof window === 'undefined' || !window.localStorage) {
            console.warn('localStorage niedostępny');
            return value === undefined ? null : undefined;
        }
        
        // Use STORAGE_PREFIX from CONFIG with fallback
        const STORAGE_PREFIX = (window.CONFIG && window.CONFIG.STORAGE_PREFIX) || 'daremon';
        
        try {
            if (value === undefined) {
                const item = window.localStorage.getItem(`${STORAGE_PREFIX}_${key}`);
                return item ? JSON.parse(item) : null;
            }
            window.localStorage.setItem(`${STORAGE_PREFIX}_${key}`, JSON.stringify(value));
        } catch (e) {
            console.error(`localStorage błąd dla klucza "${key}":`, e);
            return value === undefined ? null : undefined;
        }
    }

    it('should use STORAGE_PREFIX from CONFIG when available', () => {
        safeLocalStorage('test', { data: 'value' });
        expect(mockStorage.setItem).toHaveBeenCalledWith(
            'daremon_test',
            JSON.stringify({ data: 'value' })
        );
    });

    it('should use fallback prefix when CONFIG is undefined', () => {
        global.window = { localStorage: mockStorage };
        safeLocalStorage('test', { data: 'value' });
        expect(mockStorage.setItem).toHaveBeenCalledWith(
            'daremon_test',
            JSON.stringify({ data: 'value' })
        );
    });

    it('should use fallback prefix when CONFIG.STORAGE_PREFIX is undefined', () => {
        global.window = { 
            localStorage: mockStorage,
            CONFIG: {} 
        };
        safeLocalStorage('test', { data: 'value' });
        expect(mockStorage.setItem).toHaveBeenCalledWith(
            'daremon_test',
            JSON.stringify({ data: 'value' })
        );
    });

    it('should return null when localStorage is unavailable', () => {
        global.window = {};
        const result = safeLocalStorage('test');
        expect(result).toBeNull();
    });

    it('should return undefined when trying to set value without localStorage', () => {
        global.window = {};
        const result = safeLocalStorage('test', { data: 'value' });
        expect(result).toBeUndefined();
    });

    it('should retrieve stored values correctly', () => {
        mockStorage.setItem('daremon_test', JSON.stringify({ data: 'value' }));
        const result = safeLocalStorage('test');
        expect(result).toEqual({ data: 'value' });
    });

    it('should return null for non-existent keys', () => {
        const result = safeLocalStorage('nonexistent');
        expect(result).toBeNull();
    });

    it('should handle JSON parse errors gracefully', () => {
        mockStorage.setItem('daremon_test', 'invalid json');
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        const result = safeLocalStorage('test');
        
        expect(result).toBeNull();
        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });

    it('should handle localStorage quota exceeded errors', () => {
        mockStorage.setItem = vi.fn(() => {
            throw new Error('QuotaExceededError');
        });
        
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        const result = safeLocalStorage('test', { data: 'value' });
        
        expect(result).toBeUndefined();
        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });
});

describe('loadStateFromLocalStorage Error Handling', () => {
    let mockStorage;

    beforeEach(() => {
        mockStorage = createStorageMock();
        global.window = { 
            localStorage: mockStorage,
            CONFIG: { STORAGE_PREFIX: 'daremon' }
        };
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    function safeLocalStorage(key, value) {
        if (typeof window === 'undefined' || !window.localStorage) {
            return value === undefined ? null : undefined;
        }
        
        const STORAGE_PREFIX = (window.CONFIG && window.CONFIG.STORAGE_PREFIX) || 'daremon';
        
        try {
            if (value === undefined) {
                const item = window.localStorage.getItem(`${STORAGE_PREFIX}_${key}`);
                return item ? JSON.parse(item) : null;
            }
            window.localStorage.setItem(`${STORAGE_PREFIX}_${key}`, JSON.stringify(value));
        } catch (e) {
            console.error(`localStorage błąd dla klucza "${key}":`, e);
            return value === undefined ? null : undefined;
        }
    }

    function loadStateFromLocalStorage() {
        const state = {};
        try {
            state.likes = safeLocalStorage('likes') || {};
            state.messages = safeLocalStorage('messages') || [];
            state.songDedications = safeLocalStorage('songDedications') || [];
            state.history = safeLocalStorage('history') || [];
            state.reviews = safeLocalStorage('reviews') || {};
            
            console.log('✅ Stan aplikacji załadowany z localStorage');
            return state;
        } catch (error) {
            console.error('❌ Błąd ładowania stanu:', error);
            // Initialize with default values
            state.likes = {};
            state.messages = [];
            state.songDedications = [];
            state.history = [];
            state.reviews = {};
            return state;
        }
    }

    it('should load state with default values when localStorage is empty', () => {
        const state = loadStateFromLocalStorage();
        
        expect(state.likes).toEqual({});
        expect(state.messages).toEqual([]);
        expect(state.songDedications).toEqual([]);
        expect(state.history).toEqual([]);
        expect(state.reviews).toEqual({});
    });

    it('should load existing state from localStorage', () => {
        mockStorage.setItem('daremon_likes', JSON.stringify({ track1: true }));
        mockStorage.setItem('daremon_messages', JSON.stringify(['msg1']));
        mockStorage.setItem('daremon_reviews', JSON.stringify({ track1: 5 }));
        
        const state = loadStateFromLocalStorage();
        
        expect(state.likes).toEqual({ track1: true });
        expect(state.messages).toEqual(['msg1']);
        expect(state.reviews).toEqual({ track1: 5 });
    });

    it('should return default values when localStorage throws error', () => {
        mockStorage.getItem = vi.fn(() => {
            throw new Error('localStorage error');
        });
        
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const state = loadStateFromLocalStorage();
        
        expect(state.likes).toEqual({});
        expect(state.messages).toEqual([]);
        consoleError.mockRestore();
    });
});
