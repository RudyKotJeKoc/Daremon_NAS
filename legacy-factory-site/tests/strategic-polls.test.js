import { describe, it, expect } from 'vitest';
import { analyzeCoreTeam, calculateStrategicMetrics, generateGoNoGoReport } from '../strategic-polls.js';

describe('strategic-polls', () => {
    it('oblicza metryki zespołu, kapitału i gotowości', () => {
        const store = {
            'continuation-intent': {
                totalVotes: 5,
                options: {
                    'intent-yes': { votes: 3 },
                    'intent-maybe': { votes: 1 },
                    'intent-no': { votes: 1 },
                },
            },
            'financial-risk-tolerance': {
                totalVotes: 5,
                options: {
                    'risk-yes': { votes: 3 },
                    'risk-no': { votes: 2 },
                },
            },
            'time-commitment-weekly': {
                totalVotes: 5,
                options: {
                    'time-6-10': { votes: 2 },
                    'time-10plus': { votes: 3 },
                },
            },
            'severance-investment': {
                totalVotes: 5,
                options: {
                    'invest-10k': { votes: 2 },
                    'invest-15k': { votes: 1 },
                    'invest-no': { votes: 2 },
                },
            },
            'legal-consultation-budget': {
                totalVotes: 5,
                options: {
                    'legal-yes': { votes: 4 },
                    'legal-no': { votes: 1 },
                },
            },
            'key-competencies': {
                totalVotes: 5,
                options: {
                    'comp-production': { votes: 3 },
                    'comp-sales': { votes: 1 },
                    'comp-design': { votes: 2 },
                    'comp-admin': { votes: 0 },
                    'comp-plc': { votes: 2 },
                    'comp-quality': { votes: 1 },
                    'comp-finance': { votes: 1 },
                },
            },
        };

        const metrics = calculateStrategicMetrics(store);
        expect(metrics.coreTeam).toBe(3);
        expect(metrics.maybeTeam).toBe(1);
        expect(metrics.notInterested).toBe(1);
        expect(metrics.riskTolerant).toBe(3);
        expect(metrics.riskIntolerant).toBe(2);
        expect(metrics.capital).toBe(27500);
        expect(metrics.hoursAverage).toBe(20);
        expect(metrics.legalConsultation).toBe(4);
        expect(metrics.missingCompetencies).toContain('Brak deklaracji dla: Administracja');

        const analysis = analyzeCoreTeam(store);
        expect(analysis.committed).toBe(3);
        expect(analysis.maybe).toBe(1);
        expect(analysis.commitmentRate).toBe(60);
        expect(analysis.riskTolerant).toBe(3);

        const report = generateGoNoGoReport(store);
        expect(report.decision).toBe('NO-GO');
        expect(report.criticalGaps.length).toBeGreaterThan(0);
    });

    it('generuje raport GO przy kompletnych danych', () => {
        const store = {
            'continuation-intent': {
                totalVotes: 7,
                options: {
                    'intent-yes': { votes: 6 },
                    'intent-maybe': { votes: 1 },
                    'intent-no': { votes: 0 },
                },
            },
            'financial-risk-tolerance': {
                totalVotes: 7,
                options: {
                    'risk-yes': { votes: 6 },
                    'risk-no': { votes: 1 },
                },
            },
            'time-commitment-weekly': {
                totalVotes: 6,
                options: {
                    'time-10plus': { votes: 6 },
                },
            },
            'severance-investment': {
                totalVotes: 7,
                options: {
                    'invest-15k': { votes: 3 },
                    'invest-20k': { votes: 2 },
                    'invest-25kplus': { votes: 2 },
                },
            },
            'legal-consultation-budget': {
                totalVotes: 7,
                options: {
                    'legal-yes': { votes: 6 },
                    'legal-no': { votes: 1 },
                },
            },
            'key-competencies': {
                totalVotes: 7,
                options: {
                    'comp-production': { votes: 4 },
                    'comp-sales': { votes: 3 },
                    'comp-design': { votes: 3 },
                    'comp-admin': { votes: 2 },
                    'comp-plc': { votes: 3 },
                    'comp-quality': { votes: 2 },
                    'comp-finance': { votes: 2 },
                },
            },
        };

        const report = generateGoNoGoReport(store);
        expect(report.decision).toBe('GO');
        expect(report.criticalGaps.length).toBe(0);
        expect(report.nextSteps).toContain('Zwołaj spotkanie Zespołu Rdzenia w ciągu 48 godzin.');
    });

    it('generuje raport PARTIAL GO przy częściowych danych', () => {
        const store = {
            'continuation-intent': {
                totalVotes: 6,
                options: {
                    'intent-yes': { votes: 4 },
                    'intent-maybe': { votes: 2 },
                },
            },
            'financial-risk-tolerance': {
                totalVotes: 6,
                options: {
                    'risk-yes': { votes: 4 },
                    'risk-no': { votes: 2 },
                },
            },
            'time-commitment-weekly': {
                totalVotes: 6,
                options: {
                    'time-6-10': { votes: 3 },
                    'time-10plus': { votes: 3 },
                },
            },
            'severance-investment': {
                totalVotes: 6,
                options: {
                    'invest-10k': { votes: 3 },
                    'invest-15k': { votes: 3 },
                },
            },
            'legal-consultation-budget': {
                totalVotes: 6,
                options: {
                    'legal-yes': { votes: 5 },
                    'legal-no': { votes: 1 },
                },
            },
            'key-competencies': {
                totalVotes: 6,
                options: {
                    'comp-production': { votes: 4 },
                    'comp-sales': { votes: 2 },
                    'comp-design': { votes: 2 },
                    'comp-admin': { votes: 1 },
                    'comp-plc': { votes: 2 },
                    'comp-quality': { votes: 0 },
                    'comp-finance': { votes: 1 },
                },
            },
        };

        const report = generateGoNoGoReport(store);
        expect(report.decision).toBe('PARTIAL GO');
        expect(report.criticalGaps.length).toBeGreaterThan(0);
        expect(report.nextSteps).toContain('Zidentyfikuj brakujące kompetencje i zaproponuj osoby odpowiedzialne.');
    });
});
