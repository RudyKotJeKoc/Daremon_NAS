const euroFormatter = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
});

export const STRATEGIC_TARGETS = {
    teamSize: 20,
    coreTeam: 5,
    capital: 75000,
    clientRelationships: 2,
    machines: 15,
    weeklyHours: 10, // Godziny tygodniowo na organizację (poza normalnymi obowiązkami)
};

export const STRATEGIC_POLLS = [
    // A. GOTOWOŚĆ DO DZIAŁANIA I RYZYKO (Test zaangażowania)
    {
        id: 'continuation-intent',
        category: 'Gotowość',
        priority: 'CRITICAL',
        confidential: true,
        question: 'Czy rozważasz kontynuację w nowej firmie?',
        type: 'single-choice',
        options: [
            { id: 'intent-yes', label: 'TAK — jestem gotowy/a do kontynuacji' },
            { id: 'intent-maybe', label: 'MOŻE — zależy od warunków' },
            { id: 'intent-no', label: 'NIE — nie rozważam kontynuacji' },
        ],
    },
    {
        id: 'financial-risk-tolerance',
        category: 'Gotowość',
        priority: 'CRITICAL',
        confidential: true,
        question: 'Czy jesteś gotów przez 6–12 miesięcy żyć z minimalnych dochodów/zasiłku (WW)?',
        type: 'single-choice',
        options: [
            { id: 'risk-yes', label: 'TAK — jestem gotowy/a' },
            { id: 'risk-no', label: 'NIE — to jest dla mnie bariera' },
        ],
    },
    {
        id: 'time-commitment-weekly',
        category: 'Gotowość',
        priority: 'CRITICAL',
        confidential: true,
        question: 'Ile godzin tygodniowo możesz poświęcić na organizację nowej firmy (poza normalnymi obowiązkami)?',
        type: 'single-choice',
        options: [
            { id: 'time-0-2', label: '0–2 godziny/tydzień' },
            { id: 'time-3-5', label: '3–5 godzin/tydzień' },
            { id: 'time-6-10', label: '6–10 godzin/tydzień' },
            { id: 'time-10plus', label: '10+ godzin/tydzień' },
        ],
    },
    {
        id: 'perceived-obstacles',
        category: 'Gotowość',
        priority: 'HIGH',
        confidential: true,
        question: 'Jakie widzisz największe przeszkody (prawne, finansowe, rynkowe)?',
        type: 'open-text',
        options: [],
    },

    // B. KAPITAŁ (Weryfikacja finansowa)
    {
        id: 'severance-investment',
        category: 'Kapitał',
        priority: 'CRITICAL',
        confidential: true,
        question: 'Czy jesteś gotów zainwestować część swojej odprawy w nową firmę?',
        type: 'single-choice',
        options: [
            { id: 'invest-no', label: 'NIE — nie mogę zainwestować' },
            { id: 'invest-5k', label: 'TAK — do 5 000 €' },
            { id: 'invest-10k', label: 'TAK — 5 000 – 10 000 €' },
            { id: 'invest-15k', label: 'TAK — 10 000 – 15 000 €' },
            { id: 'invest-20k', label: 'TAK — 15 000 – 20 000 €' },
            { id: 'invest-25kplus', label: 'TAK — ponad 20 000 €' },
        ],
    },
    {
        id: 'legal-consultation-budget',
        category: 'Kapitał',
        priority: 'URGENT',
        confidential: true,
        question: 'Czy planujesz wykorzystać budżet €650 na konsultację prawną VSO/Art. 11?',
        type: 'single-choice',
        options: [
            { id: 'legal-yes', label: 'TAK — planuję konsultację' },
            { id: 'legal-no', label: 'NIE — nie planuję' },
            { id: 'legal-unsure', label: 'Nie jestem pewny/a' },
        ],
    },
    {
        id: 'training-budget-allocation',
        category: 'Kapitał',
        priority: 'MEDIUM',
        confidential: true,
        question: 'Na jakie szkolenia planujesz przeznaczyć budżet €1500 (np. Sprzedaż B2B, Finanse, CAD/CAM)?',
        type: 'multiple-choice',
        options: [
            { id: 'training-sales-b2b', label: 'Sprzedaż B2B / negocjacje' },
            { id: 'training-finance', label: 'Finanse / zarządzanie kosztami' },
            { id: 'training-cad-cam', label: 'CAD/CAM / projektowanie' },
            { id: 'training-plc', label: 'Automatyka / PLC' },
            { id: 'training-quality', label: 'Systemy jakości / audyty' },
            { id: 'training-leadership', label: 'Przywództwo / zarządzanie zespołem' },
            { id: 'training-none', label: 'Nie planuję szkoleń' },
        ],
    },

    // C. KOMPETENCJE I RYNKI (Weryfikacja strategiczna)
    {
        id: 'key-competencies',
        category: 'Kompetencje',
        priority: 'URGENT',
        confidential: true,
        question: 'Jakie masz kompetencje kluczowe dla nowej firmy?',
        type: 'multiple-choice',
        options: [
            { id: 'comp-production', label: 'Produkcja' },
            { id: 'comp-design', label: 'Projektowanie' },
            { id: 'comp-sales', label: 'Sprzedaż' },
            { id: 'comp-admin', label: 'Administracja' },
            { id: 'comp-plc', label: 'Automatyka (PLC)' },
            { id: 'comp-quality', label: 'Jakość / audyty' },
            { id: 'comp-finance', label: 'Finanse / controlling' },
        ],
    },
    {
        id: 'satisfied-clients',
        category: 'Kompetencje',
        priority: 'URGENT',
        confidential: true,
        question: 'Którzy klienci z dotychczasowego portfolio ITB byli zadowoleni z Twojej pracy? (Podaj nazwy firm lub osoby kontaktowe)',
        type: 'open-text',
        options: [],
    },
];

const CAPITAL_WEIGHTS = {
    'invest-no': 0,
    'invest-5k': 2500,
    'invest-10k': 7500,
    'invest-15k': 12500,
    'invest-20k': 17500,
    'invest-25kplus': 25000,
};

const TIME_WEIGHTS = {
    'time-0-2': 1,
    'time-3-5': 4,
    'time-6-10': 8,
    'time-10plus': 15,
};

const COMPETENCY_LABELS = {
    'comp-production': 'Produkcja',
    'comp-design': 'Projektowanie',
    'comp-sales': 'Sprzedaż',
    'comp-admin': 'Administracja',
    'comp-plc': 'Automatyka (PLC)',
    'comp-quality': 'Jakość / audyty',
    'comp-finance': 'Finanse / controlling',
};

const TRAINING_LABELS = {
    'training-sales-b2b': 'Sprzedaż B2B / negocjacje',
    'training-finance': 'Finanse / zarządzanie kosztami',
    'training-cad-cam': 'CAD/CAM / projektowanie',
    'training-plc': 'Automatyka / PLC',
    'training-quality': 'Systemy jakości / audyty',
    'training-leadership': 'Przywództwo / zarządzanie zespołem',
    'training-none': 'Nie planuję szkoleń',
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
        maybeTeam: 0,
        notInterested: 0,
        riskTolerant: 0,
        riskIntolerant: 0,
        capital: 0,
        hoursTotal: 0,
        hoursAverage: 0,
        legalConsultation: 0,
        competencyCoverage: {},
        missingCompetencies: [],
        trainingPriorities: [],
    };

    // A. GOTOWOŚĆ DO DZIAŁANIA I RYZYKO
    const intentState = getPollState('continuation-intent', store);
    metrics.coreTeam = getOptionVotes(intentState, 'intent-yes');
    metrics.maybeTeam = getOptionVotes(intentState, 'intent-maybe');
    metrics.notInterested = getOptionVotes(intentState, 'intent-no');

    const riskState = getPollState('financial-risk-tolerance', store);
    metrics.riskTolerant = getOptionVotes(riskState, 'risk-yes');
    metrics.riskIntolerant = getOptionVotes(riskState, 'risk-no');

    const timeState = getPollState('time-commitment-weekly', store);
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

    // B. KAPITAŁ
    const investState = getPollState('severance-investment', store);
    Object.entries(CAPITAL_WEIGHTS).forEach(([optionId, euro]) => {
        metrics.capital += euro * getOptionVotes(investState, optionId);
    });

    const legalState = getPollState('legal-consultation-budget', store);
    metrics.legalConsultation = getOptionVotes(legalState, 'legal-yes');

    const trainingState = getPollState('training-budget-allocation', store);
    const trainingEntries = Object.entries(TRAINING_LABELS).map(([optionId, label]) => ({
        label,
        votes: getOptionVotes(trainingState, optionId),
    })).filter(item => item.votes > 0);
    trainingEntries.sort((a, b) => b.votes - a.votes);
    metrics.trainingPriorities = trainingEntries.slice(0, 3).map(item => `${item.label} (${item.votes})`);

    // C. KOMPETENCJE I RYNKI
    const compState = getPollState('key-competencies', store);
    metrics.competencyCoverage = Object.keys(COMPETENCY_LABELS).reduce((acc, optionId) => {
        acc[COMPETENCY_LABELS[optionId]] = getOptionVotes(compState, optionId);
        return acc;
    }, {});
    metrics.missingCompetencies = Object.entries(metrics.competencyCoverage)
        .filter(([, votes]) => votes === 0)
        .map(([comp]) => `Brak deklaracji dla: ${comp}`);

    // Calculate respondents and response rate
    const pollTotals = Object.values(store).map(poll => poll.totalVotes || 0);
    metrics.respondents = pollTotals.length > 0 ? Math.max(...pollTotals) : 0;
    if (STRATEGIC_TARGETS.teamSize > 0) {
        metrics.responseRate = Math.round(
            Math.min(100, (metrics.respondents / STRATEGIC_TARGETS.teamSize) * 100)
        );
    }

    return {
        ...metrics,
        trainingPrioritiesDetailed: trainingEntries,
        formattedCapital: formatEuro(metrics.capital),
    };
}

export function analyzeCoreTeam(store = {}) {
    const metrics = calculateStrategicMetrics(store);
    const total = metrics.coreTeam + metrics.maybeTeam + metrics.notInterested;
    const commitmentRate = total > 0 ? Math.round((metrics.coreTeam / total) * 100) : 0;

    return {
        committed: metrics.coreTeam,
        maybe: metrics.maybeTeam,
        notInterested: metrics.notInterested,
        commitmentRate,
        riskTolerant: metrics.riskTolerant,
        riskIntolerant: metrics.riskIntolerant,
    };
}

export function generateGoNoGoReport(store = {}) {
    const metrics = calculateStrategicMetrics(store);
    const criticalGaps = [];

    // Weryfikacja zespołu rdzenia
    if (metrics.coreTeam < STRATEGIC_TARGETS.coreTeam) {
        criticalGaps.push(`Potrzebujemy minimum ${STRATEGIC_TARGETS.coreTeam} osób gotowych do kontynuacji (mamy ${metrics.coreTeam}).`);
    }

    // Weryfikacja kapitału
    if (metrics.capital < STRATEGIC_TARGETS.capital) {
        criticalGaps.push(`Zadeklarowany kapitał ${formatEuro(metrics.capital)} nie osiąga celu ${formatEuro(STRATEGIC_TARGETS.capital)}.`);
    }

    // Weryfikacja tolerancji ryzyka
    if (metrics.riskTolerant < STRATEGIC_TARGETS.coreTeam) {
        criticalGaps.push(`Za mało osób gotowych na ryzyko finansowe przez 6-12 miesięcy (mamy ${metrics.riskTolerant}, cel: ${STRATEGIC_TARGETS.coreTeam}).`);
    }

    // Weryfikacja czasu
    if (metrics.hoursAverage < STRATEGIC_TARGETS.weeklyHours) {
        criticalGaps.push(`Średnia deklaracja czasu (${metrics.hoursAverage} h/tydz.) jest poniżej celu ${STRATEGIC_TARGETS.weeklyHours} h.`);
    }

    // Weryfikacja kompetencji
    if (metrics.missingCompetencies.length > 2) {
        criticalGaps.push(`Brakujące kompetencje: ${metrics.missingCompetencies.slice(0, 3).join(', ')}.`);
    }

    let decision = 'GO';
    const majorFail = metrics.coreTeam < 3 || metrics.capital < 30000 || metrics.riskTolerant < 3;
    if (criticalGaps.length > 0) {
        decision = majorFail ? 'NO-GO' : 'PARTIAL GO';
    }

    const nextSteps = decision === 'GO'
        ? [
            'Zwołaj spotkanie Zespołu Rdzenia w ciągu 48 godzin.',
            'Przydziel Koordynatora i osobę odpowiedzialną za finanse.',
            'Umów konsultację prawną w sprawie VSO/Art. 11 dla wszystkich zainteresowanych.',
            'Przygotuj mapę klientów na podstawie zebranych danych kontaktowych.',
            'Zaplanuj szkolenia priorytetowe z budżetu €1500 na osobę.',
        ]
        : decision === 'PARTIAL GO'
            ? [
                'Zidentyfikuj brakujące kompetencje i zaproponuj osoby odpowiedzialne.',
                'Poszukaj dodatkowego kapitału (pożyczki, dotacje, inwestorzy).',
                'Zwiększ świadomość ryzyka i przygotuj plan finansowy na 12 miesięcy.',
                'Przedłuż okno zbierania deklaracji o dodatkowy tydzień.',
                'Zorganizuj warsztaty z kluczowych brakujących obszarów (np. sprzedaż B2B).',
            ]
            : [
                'Przygotuj plan awaryjny dla osób wybierających VSO.',
                'Utrzymaj kontakt w zespole i przygotuj restart w ciągu 6-12 miesięcy.',
                'Zabezpiecz najcenniejsze dane i know-how zespołu.',
                'Wykorzystaj budżety na szkolenia indywidualne (€650 prawne, €1500 rozwój).',
                'Dokumentuj relacje z klientami na przyszłość.',
            ];

    return {
        decision,
        coreTeam: metrics.coreTeam,
        maybeTeam: metrics.maybeTeam,
        riskTolerant: metrics.riskTolerant,
        capital: metrics.formattedCapital,
        responseRate: metrics.responseRate,
        hoursAverage: metrics.hoursAverage,
        legalConsultation: metrics.legalConsultation,
        criticalGaps,
        nextSteps,
    };
}
