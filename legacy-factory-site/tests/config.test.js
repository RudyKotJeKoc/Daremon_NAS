import { describe, expect, it } from 'vitest';
import { CONFIG } from '../config.js';

describe('CONFIG', () => {
    it('exports WHATSAPP_LINK configuration', () => {
        expect(CONFIG).toHaveProperty('WHATSAPP_LINK');
        expect(typeof CONFIG.WHATSAPP_LINK).toBe('string');
    });

    it('has a valid default WHATSAPP_LINK value', () => {
        expect(CONFIG.WHATSAPP_LINK).toBeTruthy();
        expect(CONFIG.WHATSAPP_LINK.startsWith('http')).toBe(true);
    });

    it('exports all expected configuration keys', () => {
        expect(CONFIG).toHaveProperty('PROJECT_NAME');
        expect(CONFIG).toHaveProperty('COMPANY_NAME');
        expect(CONFIG).toHaveProperty('PREVIOUS_EMPLOYER_NAME');
        expect(CONFIG).toHaveProperty('WHATSAPP_LINK');
        expect(CONFIG).toHaveProperty('STORAGE_PREFIX');
        expect(CONFIG).toHaveProperty('MACHINE_DOCS_KEY');
        expect(CONFIG).toHaveProperty('ANALYSIS_SCHEDULE_KEY');
    });
});
