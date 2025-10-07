const euroFormatter = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
});

export const STRATEGIC_TARGETS = {
    teamSize: 20,
    coreTeam: 5,
    capital: 40000,
    clientRelationships: 2,
    machines: 15,
    weeklyHours: 50,
};

export const STRATEGIC_POLLS = [
    {
        id: 'core-team-declaration',
        category: 'Zespół',
        priority: 'CRITICAL',
        confidential: true,
    question: 'Czy dołączasz do Zespołu Rdzenia projektu?',
        type: 'single-choice',
        options: [
            { id: 'core-team-commit', label: 'Tak — jestem w Zespole Rdzenia' },
            { id: 'core-team-support', label: 'Wspieram działania, ale nie w rdzeniu' },
            { id: 'core-team-undecided', label: 'Jeszcze się zastanawiam' },
        ],
    },
    {
        id: 'core-team-roles',
        category: 'Zespół',
        priority: 'URGENT',
        confidential: true,
        question: 'Jaką rolę możesz objąć od kwietnia 2026?',
        type: 'multiple-choice',
        options: [
            { id: 'role-operations', label: 'Operacje / produkcja' },
            { id: 'role-sales', label: 'Sprzedaż i relacje z klientami' },
            { id: 'role-finance', label: 'Finanse / kontroling' },
            { id: 'role-hr', label: 'HR / kadry' },
            { id: 'role-quality', label: 'Jakość / audyty' },
            { id: 'role-rnd', label: 'R&D / wdrożenia' },
        ],
    },
    {
        id: 'financial-commitment',
        category: 'Kapitał',
        priority: 'CRITICAL',
        confidential: true,
    question: 'Jaką przykładową kwotę możesz zadeklarować na start projektu?',
        type: 'single-choice',
        options: [
            { id: 'invest-0', label: '0 € — tylko wsparcie operacyjne' },
            { id: 'invest-2k', label: '1 000 – 2 500 €' },
            { id: 'invest-5k', label: '2 500 – 5 000 €' },
            { id: 'invest-10k', label: '5 000 – 10 000 €' },
            { id: 'invest-15k', label: '10 000 € i więcej' },
        ],
    },
    {
        id: 'time-commitment',
        category: 'Zespół',
        priority: 'CRITICAL',
        confidential: true,
    question: 'Ile godzin tygodniowo możesz przeznaczyć na projekt od kwietnia?',
        type: 'single-choice',
        options: [
            { id: 'time-10', label: 'Do 10 h/tydzień' },
            { id: 'time-20', label: '11 – 20 h/tydzień' },
            { id: 'time-35', label: '21 – 35 h/tydzień' },
            { id: 'time-50', label: '36 – 50 h/tydzień' },
            { id: 'time-60', label: 'Ponad 50 h/tydzień' },
        ],
    },
    {
        id: 'client-relationships',
        category: 'Relacje',
        priority: 'URGENT',
        confidential: true,
    question: 'Ilu aktywnych klientów możesz wprowadzić do projektu?',
        type: 'single-choice',
        options: [
            { id: 'clients-0', label: 'Brak — potrzebuję wsparcia' },
            { id: 'clients-1', label: '1 klient / kontakt decyzyjny' },
            { id: 'clients-2', label: '2 kontakty z klientami' },
            { id: 'clients-3', label: '3 lub więcej relacji' },
        ],
    },

    {
        id: 'competency-gaps',
        category: 'Kompetencje',
        priority: 'HIGH',
        confidential: true,
        question: 'W jakich obszarach brakuje nam dziś kompetencji?',
        type: 'multiple-choice',
        options: [
            { id: 'gap-sales', label: 'Sprzedaż i rozwój biznesu' },
            { id: 'gap-finance', label: 'Finanse / księgowość' },
            { id: 'gap-legal', label: 'Prawo i kontrakty' },
            { id: 'gap-production', label: 'Inżynieria / procesy produkcyjne' },
            { id: 'gap-quality', label: 'Systemy jakości i audyty' },
            { id: 'gap-marketing', label: 'Marketing / komunikacja' },
        ],
    },
    {
        id: 'training-priority',
        category: 'Kompetencje',
        priority: 'MEDIUM',
        confidential: true,
        question: 'Które szkolenie powinno być sfinansowane w pierwszej kolejności?',
        type: 'single-choice',
        options: [
            { id: 'training-sales', label: 'Sprzedaż / negocjacje' },
            { id: 'training-finance', label: 'Finanse i zarządzanie kosztami' },
            { id: 'training-quality', label: 'Systemy jakości / audyty' },
            { id: 'training-automation', label: 'Automatyzacja i utrzymanie ruchu' },
            { id: 'training-leadership', label: 'Przywództwo i organizacja' },
        ],
    },
    {
        id: 'risk-readiness',
        category: 'Ryzyko',
        priority: 'MEDIUM',
        confidential: true,
        question: 'Jak oceniasz gotowość do poniesienia ryzyka biznesowego?',
        type: 'rating',
        scale: 5,
        labels: ['0 — nie jestem gotowy', '1 — niska', '2 — umiarkowana', '3 — wysoka', '4 — pełna gotowość'],
    },
    {
        id: 'whatsapp-availability',
        category: 'Koordynacja',
        priority: 'HIGH',
        confidential: false,
    question: 'Czy masz dostęp do wyznaczonego kanału komunikacji Komisji Maszyn?',
        type: 'single-choice',
        options: [
            { id: 'channel-yes', label: 'Tak — mam dostęp' },
            { id: 'channel-later', label: 'Jeszcze nie, dołączę dzisiaj' },
            { id: 'channel-no', label: 'Potrzebuję zaproszenia' },
        ],
    },
    {
        id: 'motivation-statement',
        category: 'Zespół',
        priority: 'MEDIUM',
        confidential: true,
    question: 'Co jest Twoją największą motywacją do udziału w projekcie?',
        type: 'open-text',
        options: [],
    },
    {
        id: 'focus-2026',
        category: 'Strategia',
        priority: 'MEDIUM',
        confidential: false,
        question: 'Na czym powinniśmy skoncentrować pierwsze 90 dni?',
        type: 'multiple-choice',
        options: [
            { id: 'focus-clients', label: 'Pozyskanie klientów' },
            { id: 'focus-machines', label: 'Zabezpieczenie maszyn i produkcji' },
            { id: 'focus-team', label: 'Budowa zespołu i struktury' },
            { id: 'focus-cashflow', label: 'Finansowanie i cashflow' },
            { id: 'focus-brand', label: 'Komunikacja i marka' },
        ],
    },
];

const CAPITAL_WEIGHTS = {
    'invest-0': 0,
    'invest-2k': 1750,
    'invest-5k': 3750,
    'invest-10k': 7500,
    'invest-15k': 12500,
};

const TIME_WEIGHTS = {
    'time-10': 10,
    'time-20': 20,
    'time-35': 35,
    'time-50': 50,
    'time-60': 60,
};

const CLIENT_WEIGHTS = {
    'clients-0': 0,
    'clients-1': 1,
    'clients-2': 2,
    'clients-3': 3,
};

const MACHINE_WEIGHTS = {
    'machines-5': 5,
    'machines-10': 10,
    'machines-15': 15,
    'machines-20': 20,
};

const ROLE_IDS = {
    'role-operations': 'Operacje',
    'role-sales': 'Sprzedaż',
    'role-finance': 'Finanse',
    'role-hr': 'HR',
    'role-quality': 'Jakość',
    'role-rnd': 'R&D',
};

const GAP_LABELS = {
    'gap-sales': 'Sprzedaż i rozwój biznesu',
    'gap-finance': 'Finanse / księgowość',
    'gap-legal': 'Prawo i kontrakty',
    'gap-production': 'Inżynieria / procesy produkcyjne',
    'gap-quality': 'Systemy jakości i audyty',
    'gap-marketing': 'Marketing / komunikacja',
};

function getPollState(pollId, store = {}) {
    return store[pollId] || { totalVotes: 0, options: {}, responses: [] };
}

function getOptionVotes(state, optionId) {
    return state.options?.[optionId]?.votes || 0;
}

export function formatEuro(value) {
    return euroFormatter.format(Math.max(0, Math.round(value)));
}

export function calculateStrategicMetrics(store = {}) {
    const metrics = {
        respondents: 0,
        responseRate: 0,
        coreTeam: 0,
        support: 0,
        undecided: 0,
        capital: 0,
        machines: 0,
        hoursTotal: 0,
        hoursAverage: 0,
        clients: 0,
        leadershipCoverage: {},
        missingRoles: [],
        gapSignals: [],
    };

    const coreTeamState = getPollState('core-team-declaration', store);
    metrics.coreTeam = getOptionVotes(coreTeamState, 'core-team-commit');
    metrics.support = getOptionVotes(coreTeamState, 'core-team-support');
    metrics.undecided = getOptionVotes(coreTeamState, 'core-team-undecided');

    const investState = getPollState('financial-commitment', store);
    Object.entries(CAPITAL_WEIGHTS).forEach(([optionId, euro]) => {
        metrics.capital += euro * getOptionVotes(investState, optionId);
    });

    const timeState = getPollState('time-commitment', store);
    let totalVotesForTime = 0;
    Object.entries(TIME_WEIGHTS).forEach(([optionId, hours]) => {
        const votes = getOptionVotes(timeState, optionId);
        metrics.hoursTotal += votes * hours;
        totalVotesForTime += votes;
    });
    if (metrics.coreTeam > 0) {
        metrics.hoursAverage = Math.round(metrics.hoursTotal / metrics.coreTeam);
    } else if (totalVotesForTime > 0) {
        metrics.hoursAverage = Math.round(metrics.hoursTotal / totalVotesForTime);
    }

    const clientState = getPollState('client-relationships', store);
    Object.entries(CLIENT_WEIGHTS).forEach(([optionId, count]) => {
        metrics.clients += count * getOptionVotes(clientState, optionId);
    });

    const machineState = getPollState('machine-documentation-status', store);
    let machinesTotal = 0;
    Object.entries(MACHINE_WEIGHTS).forEach(([optionId, count]) => {
        machinesTotal += count * getOptionVotes(machineState, optionId);
    });
    if (metrics.coreTeam > 0 && machineState.totalVotes > 0) {
        const avgMachinesPerVoter = machinesTotal / machineState.totalVotes;
        metrics.machines = Math.round(avgMachinesPerVoter * metrics.coreTeam);
    } else {
        metrics.machines = 0;
    }

    const leadershipState = getPollState('core-team-roles', store);
    metrics.leadershipCoverage = Object.keys(ROLE_IDS).reduce((acc, optionId) => {
        acc[ROLE_IDS[optionId]] = getOptionVotes(leadershipState, optionId);
        return acc;
    }, {});
    metrics.missingRoles = Object.entries(metrics.leadershipCoverage)
        .filter(([, votes]) => votes === 0)
        .map(([role]) => `Brak deklaracji dla roli: ${role}`);

    const gapState = getPollState('competency-gaps', store);
    const gapEntries = Object.entries(GAP_LABELS).map(([optionId, label]) => ({
        label,
        votes: getOptionVotes(gapState, optionId),
    })).filter(item => item.votes > 0);
    gapEntries.sort((a, b) => b.votes - a.votes);
    const topGaps = gapEntries.slice(0, 3);
    metrics.gapSignals = topGaps.map(item => `${item.label} (${item.votes})`);

    const pollTotals = Object.values(store).map(poll => poll.totalVotes || 0);
    metrics.respondents = pollTotals.length > 0 ? Math.max(...pollTotals) : 0;
    if (STRATEGIC_TARGETS.teamSize > 0) {
        metrics.responseRate = Math.round(
            Math.min(100, (metrics.respondents / STRATEGIC_TARGETS.teamSize) * 100)
        );
    }

    return {
        ...metrics,
        gapSignalsDetailed: topGaps,
        formattedCapital: formatEuro(metrics.capital),
    };
}

export function analyzeCoreTeam(store = {}) {
    const metrics = calculateStrategicMetrics(store);
    const total = metrics.coreTeam + metrics.support + metrics.undecided;
    const commitmentRate = total > 0 ? Math.round((metrics.coreTeam / total) * 100) : 0;

    return {
        committed: metrics.coreTeam,
        support: metrics.support,
        undecided: metrics.undecided,
        commitmentRate,
    };
}

export function generateGoNoGoReport(store = {}) {
    const metrics = calculateStrategicMetrics(store);
    const criticalGaps = [];

    if (metrics.coreTeam < STRATEGIC_TARGETS.coreTeam) {
        criticalGaps.push(`Potrzebujemy minimum ${STRATEGIC_TARGETS.coreTeam} osób w Zespole Rdzenia (mamy ${metrics.coreTeam}).`);
    }
    if (metrics.capital < STRATEGIC_TARGETS.capital) {
        criticalGaps.push(`Zadeklarowany kapitał ${formatEuro(metrics.capital)} nie osiąga celu ${formatEuro(STRATEGIC_TARGETS.capital)}.`);
    }
    if (metrics.clients < STRATEGIC_TARGETS.clientRelationships) {
        criticalGaps.push('Za mało relacji z klientami (cel: 2 aktywne osoby).');
    }
    if (metrics.machines < STRATEGIC_TARGETS.machines) {
        criticalGaps.push(`Udokumentowane maszyny (${metrics.machines}) nie osiągają celu ${STRATEGIC_TARGETS.machines}.`);
    }
    if (metrics.hoursAverage < STRATEGIC_TARGETS.weeklyHours) {
        criticalGaps.push(`Średnia deklaracja czasu (${metrics.hoursAverage} h/tydz.) jest poniżej celu ${STRATEGIC_TARGETS.weeklyHours} h.`);
    }
    if (metrics.missingRoles.length > 0) {
        criticalGaps.push(...metrics.missingRoles);
    }
    if (metrics.gapSignalsDetailed?.some(item => item.votes >= 2)) {
        criticalGaps.push(`Najczęściej wskazywane luki: ${metrics.gapSignals.join(', ')}.`);
    }

    let decision = 'GO';
    const majorFail = metrics.coreTeam < 3 || metrics.capital < 20000;
    if (criticalGaps.length > 0) {
        decision = majorFail ? 'NO-GO' : 'PARTIAL GO';
    }

    const nextSteps = decision === 'GO'
        ? [
            'Zwołaj spotkanie Zespołu Rdzenia w ciągu 48 godzin.',
            'Przydziel Koordynatora i osobę odpowiedzialną za finanse.',
            'Przygotuj ofertę odkupu maszyn do rozmów z Rompą.',
            'Umów konsultację prawną w sprawie VSO i formy prawnej.',
        ]
        : decision === 'PARTIAL GO'
            ? [
                'Zidentyfikuj brakujące role i zaproponuj osoby odpowiedzialne.',
                'Poszukaj dodatkowego kapitału (pożyczki, inwestorzy, crowdfunding).',
                'Ustal rozmowy z klientami i potwierdź zainteresowanie.',
                'Przedłuż okno zbierania deklaracji o dodatkowy tydzień.',
            ]
            : [
                'Przygotuj plan awaryjny dla osób wybierających VSO.',
                'Kontynuuj dokumentację maszyn na przyszłe działania.',
                'Utrzymaj kontakt w zespole i przygotuj restart w ciągu 6-12 miesięcy.',
                'Zabezpiecz najcenniejsze dane i know-how zespołu.',
            ];

    return {
        decision,
        coreTeam: metrics.coreTeam,
        capital: metrics.formattedCapital,
        responseRate: metrics.responseRate,
        machines: metrics.machines,
        clients: metrics.clients,
        hoursAverage: metrics.hoursAverage,
        criticalGaps,
        nextSteps,
    };
}
