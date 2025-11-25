import { PollSystem } from './poll-system.js';

const POLL_DEFINITIONS = [
    {
        question: 'Który utwór był hitem tego tygodnia?',
        type: 'single-choice',
        options: [
            'Retro (Live Edit)',
            'City Lights (Synthwave)',
            'Ocean Drive (Remix)',
            'Neon Nights (Club Mix)'
        ]
    },
    {
        question: 'Jaki gatunek muzyczny chcesz słyszeć częściej?',
        type: 'multiple-choice',
        options: ['Electro/Synth', 'Rock', 'Techno/House', 'Pop/Dance', 'Ambient']
    },
    {
        question: 'Jak oceniasz DAREMON Radio ogólnie?',
        type: 'rating',
        scale: 5,
        labels: ['Słabo', 'Średnio', 'Świetnie']
    },
    {
        question: 'O której godzinie najczęściej słuchasz?',
        type: 'single-choice',
        options: [
            '6:00 - 9:00 (Rano)',
            '9:00 - 12:00 (Praca)',
            '12:00 - 14:00 (Lunch)',
            '14:00 - 18:00 (Popołudnie)',
            '18:00 - 22:00 (Wieczór)'
        ]
    },
    {
        question: 'Która funkcja najbardziej Ci się podoba?',
        type: 'multiple-choice',
        options: [
            'System ocen utworów',
            'Wizualizacja audio',
            'Złote Płyty',
            'Najwyżej ocenione',
            'Motywy kolorystyczne'
        ]
    }
];

function createStrings() {
    return {
        submit: 'Wyślij odpowiedź',
        success: 'Dziękujemy za głos!',
        selectOption: 'Wybierz odpowiedź przed wysłaniem.',
        selectMultiple: 'Zaznacz przynajmniej jedną odpowiedź.',
        textRequired: 'Wpisz odpowiedź, zanim wyślesz.',
        resultsHeading: 'Wyniki',
        noVotes: 'Brak głosów w tej ankiecie.',
        correctAnswer: 'Poprawna odpowiedź!',
        incorrectAnswer: 'Dziękujemy za odpowiedź!',
        rangeLabel: 'Wybierz ocenę na skali',
        openTextPlaceholder: 'Twoja odpowiedź...',
        totalVotesLabel: 'Oddane głosy:'
    };
}

export function initPollsPage(rootDocument = document) {
    if (!rootDocument) {
        return null;
    }

    const container = rootDocument.getElementById('polls-container');
    if (!container) {
        console.warn('Brak kontenera ankiet na stronie /polls.');
        return null;
    }

    const pollSystem = new PollSystem({
        strings: createStrings()
    });

    container.innerHTML = '';
    container.setAttribute('role', 'list');
    container.setAttribute('aria-live', 'polite');

    POLL_DEFINITIONS.forEach(definition => {
        const poll = pollSystem.addPoll(definition);
        const pollWrapper = rootDocument.createElement('article');
        pollWrapper.id = `poll-${poll.id}`;
        pollWrapper.className = 'poll-card';
        pollWrapper.setAttribute('role', 'listitem');
        container.appendChild(pollWrapper);
        pollSystem.renderPoll(poll, pollWrapper);
    });

    const successBanner = rootDocument.getElementById('polls-success-banner');
    if (successBanner) {
        successBanner.removeAttribute('hidden');
    }

    return pollSystem;
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initPollsPage());
    } else {
        initPollsPage();
    }
}
