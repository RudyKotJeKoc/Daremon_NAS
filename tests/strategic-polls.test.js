import { describe, it, expect } from 'vitest';
import { analyzeCoreTeam, calculateStrategicMetrics, generateGoNoGoReport } from '../strategic-polls.js';

describe('strategic-polls', () => {
    it('oblicza metryki zespołu i kapitału', () => {
        const store = {
            'core-team-declaration': {
                totalVotes: 5,
                options: {
                    'core-team-commit': { votes: 4 },
                    'core-team-support': { votes: 1 },
                    'core-team-undecided': { votes: 0 },
                },
            },
            'financial-commitment': {
                totalVotes: 5,
                options: {
                    'invest-5k': { votes: 2 },
                    'invest-10k': { votes: 1 },
                    'invest-0': { votes: 2 },
                },
            },
            'time-commitment': {
                totalVotes: 5,
                options: {
                    'time-50': { votes: 3 },
                    'time-35': { votes: 2 },
                },
            },
            'client-relationships': {
                totalVotes: 5,
                options: {
                    'clients-2': { votes: 2 },
                    'clients-3': { votes: 1 },
                    'clients-1': { votes: 2 },
                },
            },
            'machine-documentation-status': {
                totalVotes: 5,
                options: {
                    'machines-10': { votes: 2 },
                    'machines-15': { votes: 1 },
                    'machines-5': { votes: 2 },
                },
            },
            'core-team-roles': {
                totalVotes: 5,
                options: {
                    'role-operations': { votes: 3 },
                    'role-sales': { votes: 2 },
                    'role-finance': { votes: 1 },
                    'role-hr': { votes: 0 },
                    'role-quality': { votes: 1 },
                    'role-rnd': { votes: 2 },
                },
            },
            'competency-gaps': {
                totalVotes: 5,
                options: {
                    'gap-finance': { votes: 2 },
                    'gap-sales': { votes: 1 },
                    'gap-quality': { votes: 1 },
                },
            },
        };

        const metrics = calculateStrategicMetrics(store);
        expect(metrics.coreTeam).toBe(4);
        expect(metrics.support).toBe(1);
        expect(metrics.capital).toBe(15000);
        expect(metrics.machines).toBe(36);
        expect(metrics.clients).toBe(9);
        expect(metrics.hoursAverage).toBe(55);
        expect(metrics.missingRoles).toContain('Brak deklaracji dla roli: HR');

        const analysis = analyzeCoreTeam(store);
        expect(analysis.committed).toBe(4);
        expect(analysis.commitmentRate).toBe(80);

        const report = generateGoNoGoReport(store);
        expect(report.decision).toBe('NO-GO');
        expect(report.criticalGaps.length).toBeGreaterThan(0);
    });

    it('generuje raport GO przy kompletnych danych', () => {
        const store = {
            'core-team-declaration': {
                totalVotes: 7,
                options: {
                    'core-team-commit': { votes: 6 },
                    'core-team-support': { votes: 1 },
                },
            },
            'financial-commitment': {
                totalVotes: 7,
                options: {
                    'invest-10k': { votes: 3 },
                    'invest-15k': { votes: 2 },
                    'invest-5k': { votes: 2 },
                },
            },
            'time-commitment': {
                totalVotes: 7,
                options: {
                    'time-60': { votes: 4 },
                    'time-50': { votes: 2 },
                    'time-35': { votes: 1 },
                },
            },
            'client-relationships': {
                totalVotes: 7,
                options: {
                    'clients-3': { votes: 3 },
                    'clients-2': { votes: 2 },
                    'clients-1': { votes: 2 },
                },
            },
            'machine-documentation-status': {
                totalVotes: 7,
                options: {
                    'machines-15': { votes: 3 },
                    'machines-10': { votes: 3 },
                    'machines-5': { votes: 1 },
                },
            },
            'core-team-roles': {
                totalVotes: 7,
                options: {
                    'role-operations': { votes: 4 },
                    'role-sales': { votes: 3 },
                    'role-finance': { votes: 2 },
                    'role-hr': { votes: 1 },
                    'role-quality': { votes: 2 },
                    'role-rnd': { votes: 2 },
                },
            },
            'competency-gaps': {
                totalVotes: 7,
                options: {
                    'gap-finance': { votes: 1 },
                    'gap-sales': { votes: 1 },
                },
            },
        };

        const report = generateGoNoGoReport(store);
        expect(report.decision).toBe('GO');
        expect(report.criticalGaps.length).toBe(0);
        expect(report.nextSteps).toContain('Zwołaj spotkanie Zespołu Rdzenia w ciągu 48 godzin.');
    });
});
