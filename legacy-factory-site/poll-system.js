export class PollSystem {
    constructor(options = {}) {
        const defaultStrings = {
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
            totalVotesLabel: 'Oddane głosy:',
        };

        this.strings = { ...defaultStrings, ...options.strings };
        this.storageKey = options.storageKey || 'daremon_poll_data_v1';
        this.polls = [];
        this.store = { polls: {} };
        this.counter = 0;
        this.restoreFromStorage();
    }

    restoreFromStorage() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }

        try {
            const raw = window.localStorage.getItem(this.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object' && parsed.polls) {
                    this.store = parsed;
                }
            }
        } catch (error) {
            console.error('Nie można odczytać wyników ankiet:', error);
        }
    }

    persist() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }

        try {
            window.localStorage.setItem(this.storageKey, JSON.stringify(this.store));
        } catch (error) {
            console.error('Nie można zapisać wyników ankiet:', error);
        }
    }

    createSlug(source, fallback) {
        if (typeof source === 'string' && source.trim().length > 0) {
            const base = source
                .toLowerCase()
                .normalize('NFKD')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
            if (base.length > 0) {
                return base.slice(0, 60);
            }
        }
        return fallback || '';
    }

    ensureUniqueId(baseId) {
        if (!baseId) {
            this.counter += 1;
            return `poll-${Date.now()}-${this.counter}`;
        }

        if (this.store.polls[baseId]) {
            return baseId;
        }

        let candidate = baseId;
        let suffix = 1;
        const existingIds = new Set([
            ...Object.keys(this.store.polls),
            ...this.polls.map(poll => poll.id),
        ]);

        while (existingIds.has(candidate)) {
            candidate = `${baseId}-${suffix}`;
            suffix += 1;
        }

        return candidate;
    }

    normalizeOptions(pollData, type) {
        if (type === 'rating') {
            const scale = Number.isInteger(pollData.scale) ? pollData.scale : 5;
            const labels = Array.isArray(pollData.labels) ? pollData.labels : [];
            return Array.from({ length: scale }, (_, index) => {
                const value = index + 1;
                const label = labels[index] || `${value}`;
                return {
                    id: this.ensureUniqueOptionId(`rating-${value}`, index),
                    label,
                    value: `${value}`,
                };
            });
        }

        if (type === 'emoji-rating') {
            return (pollData.options || []).map((option, index) => {
                const label = typeof option === 'string' ? option : option.label;
                const value = typeof option === 'string' ? option : (option.value || option.label);
                return {
                    id: this.ensureUniqueOptionId(this.createSlug(label, `emoji-${index}`), index),
                    label: label || `emoji-${index + 1}`,
                    value: value || label || `emoji-${index + 1}`,
                };
            });
        }

        return (pollData.options || []).map((option, index) => {
            if (typeof option === 'string') {
                return {
                    id: this.ensureUniqueOptionId(this.createSlug(option, `option-${index + 1}`), index),
                    label: option,
                    value: option,
                };
            }

            const baseId = option.id || option.value || option.label || `option-${index + 1}`;
            return {
                id: this.ensureUniqueOptionId(this.createSlug(baseId, `option-${index + 1}`), index),
                label: option.label || option.value || baseId,
                value: option.value || option.label || baseId,
            };
        });
    }

    ensureUniqueOptionId(baseId, index) {
        const fallback = `option-${index + 1}`;
        const sanitized = baseId || fallback;
        if (!sanitized) {
            return fallback;
        }
        return sanitized;
    }

    createInitialState(poll) {
        const optionState = {};
        poll.options.forEach(option => {
            optionState[option.id] = {
                label: option.label,
                votes: 0,
            };
        });
        return {
            totalVotes: 0,
            options: optionState,
            responses: [],
        };
    }

    addPoll(pollData) {
        if (!pollData || !pollData.question) {
            throw new Error('Poll data must include a question');
        }

        const type = pollData.type || 'single-choice';
        const baseId = this.createSlug(pollData.id || pollData.question, 'poll');
        const pollId = this.ensureUniqueId(baseId);
        const options = this.normalizeOptions(pollData, type);

        const poll = {
            id: pollId,
            question: pollData.question,
            type,
            options,
            scale: pollData.scale,
            labels: pollData.labels || [],
            duration: pollData.duration || null,
            correctAnswer: pollData.correctAnswer,
            reward: pollData.reward,
        };

        if (!this.store.polls[pollId]) {
            this.store.polls[pollId] = this.createInitialState(poll);
            this.persist();
        } else {
            // Synchronize option labels with stored state if needed
            const stored = this.store.polls[pollId];
            poll.totalVotes = stored.totalVotes;
            poll.options.forEach(option => {
                if (!stored.options[option.id]) {
                    stored.options[option.id] = { label: option.label, votes: 0 };
                } else if (!stored.options[option.id].label) {
                    stored.options[option.id].label = option.label;
                }
            });
        }

        poll.totalVotes = this.store.polls[pollId]?.totalVotes || 0;
        this.polls.push(poll);
        return poll;
    }

    recordVote(poll, submission) {
        const state = this.store.polls[poll.id];
        if (!state) {
            return;
        }

        state.totalVotes += 1;
        poll.totalVotes = state.totalVotes;

        if (poll.type === 'open-text') {
            if (submission.openText) {
                state.responses.unshift(submission.openText);
                state.responses = state.responses.slice(0, 20);
            }
            this.persist();
            return;
        }

        if (submission.selectedIds) {
            submission.selectedIds.forEach(optionId => {
                if (!state.options[optionId]) {
                    state.options[optionId] = { label: optionId, votes: 0 };
                }
                state.options[optionId].votes += 1;
            });
        }

        if (submission.ratingValue) {
            const ratingId = poll.options.find(option => option.value === submission.ratingValue)?.id;
            if (ratingId) {
                if (!state.options[ratingId]) {
                    state.options[ratingId] = { label: submission.ratingValue, votes: 0 };
                }
                state.options[ratingId].votes += 1;
            }
        }

        this.persist();
    }

    getResults(pollId) {
        const poll = this.polls.find(item => item.id === pollId);
        const state = this.store.polls[pollId];
        if (!poll || !state) {
            return null;
        }

        if (poll.type === 'open-text') {
            return {
                question: poll.question,
                totalVotes: state.totalVotes,
                responses: [...state.responses],
            };
        }

        const options = poll.options.map(option => {
            const optionState = state.options[option.id] || { votes: 0 };
            const percentage = state.totalVotes > 0
                ? Math.round((optionState.votes / state.totalVotes) * 100)
                : 0;
            return {
                option: option.label,
                votes: optionState.votes,
                percentage,
            };
        });

        return {
            question: poll.question,
            totalVotes: state.totalVotes,
            results: options,
        };
    }

    renderPoll(poll, containerTarget) {
        const container = typeof containerTarget === 'string'
            ? document.getElementById(containerTarget)
            : containerTarget;

        if (!container) {
            console.warn(`Nie znaleziono kontenera dla ankiety ${poll.id}`);
            return;
        }

        container.innerHTML = '';
        const card = document.createElement('article');
        card.className = 'poll-card';

        const form = document.createElement('form');
        form.className = 'poll-form';
        form.setAttribute('aria-labelledby', `${poll.id}-question`);

        const questionEl = document.createElement('h4');
        questionEl.id = `${poll.id}-question`;
        questionEl.className = 'poll-question';
        questionEl.textContent = poll.question;
        form.appendChild(questionEl);

        const fieldset = document.createElement('fieldset');
        fieldset.className = 'poll-fieldset';
        fieldset.setAttribute('role', 'group');
        fieldset.setAttribute('aria-describedby', `${poll.id}-question`);

        let sliderInput = null;
        let sliderValueOutput = null;
        let sliderTouched = false;
        let textInput = null;

        if (poll.type === 'single-choice' || poll.type === 'emoji-rating') {
            poll.options.forEach(option => {
                const optionWrapper = document.createElement('label');
                optionWrapper.className = 'poll-option';

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = poll.id;
                input.value = option.id;
                input.setAttribute('aria-label', option.label);

                const textSpan = document.createElement('span');
                textSpan.textContent = option.label;

                optionWrapper.appendChild(input);
                optionWrapper.appendChild(textSpan);
                fieldset.appendChild(optionWrapper);
            });
        } else if (poll.type === 'multiple-choice') {
            poll.options.forEach(option => {
                const optionWrapper = document.createElement('label');
                optionWrapper.className = 'poll-option';

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.name = `${poll.id}[]`;
                input.value = option.id;
                input.setAttribute('aria-label', option.label);

                const textSpan = document.createElement('span');
                textSpan.textContent = option.label;

                optionWrapper.appendChild(input);
                optionWrapper.appendChild(textSpan);
                fieldset.appendChild(optionWrapper);
            });
        } else if (poll.type === 'rating') {
            sliderInput = document.createElement('input');
            sliderInput.type = 'range';
            sliderInput.min = '1';
            sliderInput.max = `${poll.options.length}`;
            sliderInput.step = '1';
            sliderInput.value = '1';
            sliderInput.setAttribute('aria-label', this.strings.rangeLabel);
            sliderInput.className = 'poll-slider';

            sliderValueOutput = document.createElement('output');
            sliderValueOutput.className = 'poll-slider-value';
            sliderValueOutput.textContent = '';

            sliderInput.addEventListener('input', () => {
                const index = Number.parseInt(sliderInput.value, 10) - 1;
                const option = poll.options[index];
                sliderValueOutput.textContent = option ? option.label : '';
                sliderTouched = true;
            });

            fieldset.appendChild(sliderInput);
            fieldset.appendChild(sliderValueOutput);
        } else if (poll.type === 'open-text') {
            textInput = document.createElement('textarea');
            textInput.rows = 3;
            textInput.className = 'poll-textarea';
            textInput.placeholder = this.strings.openTextPlaceholder;
            textInput.setAttribute('aria-label', this.strings.openTextPlaceholder);
            fieldset.appendChild(textInput);
        }

        form.appendChild(fieldset);

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'poll-submit';
        submitButton.textContent = this.strings.submit;
        submitButton.setAttribute('aria-label', this.strings.submit);
        form.appendChild(submitButton);

        const feedback = document.createElement('p');
        feedback.className = 'poll-feedback';
        feedback.setAttribute('aria-live', 'polite');
        form.appendChild(feedback);

        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'poll-results';
        form.appendChild(resultsContainer);

        form.addEventListener('submit', event => {
            event.preventDefault();
            feedback.textContent = '';

            if (poll.type === 'single-choice' || poll.type === 'emoji-rating') {
                const selected = form.querySelector(`input[name="${poll.id}"]:checked`);
                if (!selected) {
                    feedback.textContent = this.strings.selectOption;
                    return;
                }

                this.recordVote(poll, { selectedIds: [selected.value] });
                this.showResultFeedback(poll, feedback, [selected.value]);
            } else if (poll.type === 'multiple-choice') {
                const selectedOptions = Array.from(form.querySelectorAll(`input[name="${poll.id}[]"]:checked`));
                if (selectedOptions.length === 0) {
                    feedback.textContent = this.strings.selectMultiple;
                    return;
                }

                const selectedIds = selectedOptions.map(option => option.value);
                this.recordVote(poll, { selectedIds });
                this.showResultFeedback(poll, feedback, selectedIds);
            } else if (poll.type === 'rating') {
                if (!sliderInput || !sliderTouched) {
                    feedback.textContent = this.strings.selectOption;
                    return;
                }

                const index = Number.parseInt(sliderInput.value, 10) - 1;
                const option = poll.options[index];
                if (!option) {
                    feedback.textContent = this.strings.selectOption;
                    return;
                }

                this.recordVote(poll, { ratingValue: option.value });
                this.showResultFeedback(poll, feedback, [option.id]);
                sliderInput.value = '1';
                if (sliderValueOutput) {
                    sliderValueOutput.textContent = '';
                }
                sliderTouched = false;
            } else if (poll.type === 'open-text') {
                if (!textInput) {
                    return;
                }
                const value = textInput.value.trim();
                if (!value) {
                    feedback.textContent = this.strings.textRequired;
                    return;
                }

                this.recordVote(poll, { openText: value });
                feedback.textContent = this.strings.success;
                textInput.value = '';
            }

            this.renderResults(poll, resultsContainer);
        });

        card.appendChild(form);
        container.appendChild(card);
        this.renderResults(poll, resultsContainer);
    }

    showResultFeedback(poll, feedbackElement, selectedIds) {
        if (!feedbackElement) {
            return;
        }

        if (poll.correctAnswer) {
            const selectedLabels = selectedIds
                .map(id => poll.options.find(option => option.id === id)?.label)
                .filter(Boolean);
            const hasCorrect = selectedLabels.some(label => label === poll.correctAnswer);
            feedbackElement.textContent = hasCorrect
                ? `${this.strings.correctAnswer}${poll.reward ? ` ${poll.reward}` : ''}`
                : this.strings.incorrectAnswer;
        } else {
            feedbackElement.textContent = this.strings.success;
        }
    }

    renderResults(poll, container) {
        if (!container) {
            return;
        }

        const state = this.store.polls[poll.id];
        container.innerHTML = '';

        const heading = document.createElement('h5');
        heading.className = 'poll-results-heading';
        heading.textContent = this.strings.resultsHeading;
        container.appendChild(heading);

        if (!state || state.totalVotes === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'poll-results-empty';
            emptyMessage.textContent = this.strings.noVotes;
            container.appendChild(emptyMessage);
            return;
        }

        const total = document.createElement('p');
        total.className = 'poll-results-total';
        total.textContent = `${this.strings.totalVotesLabel} ${state.totalVotes}`;
        total.setAttribute('aria-label', `${this.strings.totalVotesLabel} ${state.totalVotes}`);
        container.appendChild(total);

        if (poll.type === 'open-text') {
            const list = document.createElement('ul');
            list.className = 'poll-responses-list';
            state.responses.slice(0, 5).forEach(response => {
                const item = document.createElement('li');
                item.textContent = response;
                list.appendChild(item);
            });
            container.appendChild(list);
            return;
        }

        const list = document.createElement('ul');
        list.className = 'poll-results-list';
        poll.options.forEach(option => {
            const optionState = state.options[option.id] || { votes: 0 };
            const percentage = state.totalVotes > 0
                ? Math.round((optionState.votes / state.totalVotes) * 100)
                : 0;
            const item = document.createElement('li');
            item.className = 'poll-results-item';

            const labelSpan = document.createElement('span');
            labelSpan.className = 'poll-results-label';
            labelSpan.textContent = option.label;

            const valueSpan = document.createElement('span');
            valueSpan.className = 'poll-results-value';
            valueSpan.textContent = `${optionState.votes} · ${percentage}%`;

            item.appendChild(labelSpan);
            item.appendChild(valueSpan);
            list.appendChild(item);
        });
        container.appendChild(list);
    }
}

export default PollSystem;
