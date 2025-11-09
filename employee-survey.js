/**
 * Employee Survey System - Ankieta Zespołu
 * Handles employee survey form submission and results display
 */

import { submitSurvey } from './survey-api.js';

const EMPLOYEE_SURVEY_STORAGE_KEY = 'daremon_employee_survey_responses';

// Initialize employee survey system
export function initializeEmployeeSurvey() {
    const form = document.getElementById('employee-survey-form');
    const resultsBtn = document.getElementById('employee-survey-results-btn');
    const closeResultsBtn = document.getElementById('close-employee-results-btn');

    if (!form) {
        console.warn('Employee survey form not found');
        return;
    }

    // Handle form submission
    form.addEventListener('submit', handleEmployeeSurveySubmit);

    // Handle results button
    if (resultsBtn) {
        resultsBtn.addEventListener('click', showEmployeeSurveyResults);
    }

    // Handle close results button
    if (closeResultsBtn) {
        closeResultsBtn.addEventListener('click', hideEmployeeSurveyResults);
    }

    console.log('✅ System ankiety pracowniczej zainicjalizowany');
}

/**
 * Handle employee survey form submission
 */
async function handleEmployeeSurveySubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    // Disable submit button
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '⏳ Verzenden...';
    }

    const formData = new FormData(form);

    // Collect form data
    const response = {
        timestamp: new Date().toISOString(),
        sessionToken: generateSessionToken(),
        name: formData.get('name') || 'Anonim',
        teamContinuation: formData.get('team-continuation'),
        daremonFeatures: formData.getAll('daremon-features'),
        newFeatures: formData.getAll('new-features'),
        newFeaturesOther: formData.get('new-features-other') || '',
        helpAreas: formData.getAll('help-areas'),
        ideas: formData.get('ideas') || ''
    };

    // Validate required field
    if (!response.teamContinuation) {
        showEmployeeValidationError('Selecteer een antwoord op de eerste vraag');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '📤 Enquête verzenden';
        }
        return;
    }

    try {
        // Submit to backend API
        const result = await submitSurvey('employee', response);

        // Save to localStorage regardless of backend status
        saveEmployeeSurveyResponse(response);

        // Show appropriate success message
        if (result.offline) {
            if (result.queued) {
                showEmployeeStatusMessage('✅ Enquête opgeslagen en in wachtrij voor synchronisatie', 'info');
            } else {
                showEmployeeStatusMessage('✅ Enquête lokaal opgeslagen (backend niet beschikbaar)', 'warning');
            }
        } else {
            showEmployeeStatusMessage('✅ Enquête succesvol verzonden naar server!', 'success');
        }

        // Show default success message
        showEmployeeSuccessMessage();

        // Reset form
        form.reset();

        // Scroll to success message
        document.getElementById('employee-survey-success')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

    } catch (error) {
        console.error('Survey submission error:', error);

        // Save locally even if backend fails
        saveEmployeeSurveyResponse(response);

        // Show error but confirm local save
        showEmployeeValidationError('Verzending mislukt, maar lokaal opgeslagen. Probeer later opnieuw.');

    } finally {
        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '📤 Enquête verzenden';
        }
    }
}

/**
 * Generate session token
 */
function generateSessionToken() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}`;
}

/**
 * Show validation error
 */
function showEmployeeValidationError(message) {
    let errorDiv = document.querySelector('.employee-validation-error');

    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'employee-validation-error';
        errorDiv.style.cssText = `
            background-color: rgba(239, 68, 68, 0.1);
            border: 2px solid rgba(239, 68, 68, 0.5);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            color: #ef4444;
            font-weight: 600;
        `;

        const form = document.getElementById('employee-survey-form');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        }
    }

    errorDiv.textContent = `⚠️ ${message}`;
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Show status message
 */
function showEmployeeStatusMessage(message, type = 'success') {
    const colors = {
        success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.5)', color: '#10b981' },
        info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.5)', color: '#3b82f6' },
        warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.5)', color: '#f59e0b' }
    };

    const style = colors[type] || colors.success;

    let messageDiv = document.querySelector('.employee-status-message');

    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'employee-status-message';

        const form = document.getElementById('employee-survey-form');
        if (form) {
            form.insertBefore(messageDiv, form.firstChild);
        }
    }

    messageDiv.style.cssText = `
        background-color: ${style.bg};
        border: 2px solid ${style.border};
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        color: ${style.color};
        font-weight: 600;
    `;

    messageDiv.textContent = message;

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

/**
 * Save employee survey response to localStorage
 */
function saveEmployeeSurveyResponse(response) {
    try {
        const responses = getEmployeeSurveyResponses();
        responses.push(response);
        localStorage.setItem(EMPLOYEE_SURVEY_STORAGE_KEY, JSON.stringify(responses));
        console.log('✅ Odpowiedź ankiety pracowniczej zapisana');
    } catch (error) {
        console.error('❌ Błąd zapisywania odpowiedzi:', error);
        alert('Nie udało się zapisać ankiety. Spróbuj ponownie.');
    }
}

/**
 * Get all employee survey responses from localStorage
 */
function getEmployeeSurveyResponses() {
    try {
        const data = localStorage.getItem(EMPLOYEE_SURVEY_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('❌ Błąd odczytu odpowiedzi:', error);
        return [];
    }
}

/**
 * Show success message
 */
function showEmployeeSuccessMessage() {
    const successMsg = document.getElementById('employee-survey-success');
    const form = document.getElementById('employee-survey-form');

    if (successMsg && form) {
        form.classList.add('hidden');
        successMsg.classList.remove('hidden');

        // Hide success message and show form again after 5 seconds
        setTimeout(() => {
            successMsg.classList.add('hidden');
            form.classList.remove('hidden');
        }, 5000);
    }
}

/**
 * Show employee survey results
 */
function showEmployeeSurveyResults() {
    const responses = getEmployeeSurveyResponses();
    const resultsDiv = document.getElementById('employee-survey-results');
    const contentDiv = document.getElementById('employee-survey-results-content');

    if (!resultsDiv || !contentDiv) return;

    if (responses.length === 0) {
        contentDiv.innerHTML = '<p class="no-results">Brak odpowiedzi. Bądź pierwszy!</p>';
    } else {
        contentDiv.innerHTML = generateEmployeeResultsHTML(responses);
    }

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Hide employee survey results
 */
function hideEmployeeSurveyResults() {
    const resultsDiv = document.getElementById('employee-survey-results');
    if (resultsDiv) {
        resultsDiv.classList.add('hidden');
    }
}

/**
 * Generate HTML for results display
 */
function generateEmployeeResultsHTML(responses) {
    const total = responses.length;

    // Count team continuation responses
    const continuationCounts = {
        yes: responses.filter(r => r.teamContinuation === 'yes').length,
        maybe: responses.filter(r => r.teamContinuation === 'maybe').length,
        no: responses.filter(r => r.teamContinuation === 'no').length
    };

    // Count Daremon features
    const featureCounts = {};
    responses.forEach(r => {
        r.daremonFeatures.forEach(feature => {
            featureCounts[feature] = (featureCounts[feature] || 0) + 1;
        });
    });

    const featureLabels = {
        radio: '🎵 Radio / Odtwarzacz muzyki',
        visualizer: '🌀 Wizualizator audio (2D/3D)',
        surveys: '📊 Ankiety i głosowania',
        messaging: '💬 Wiadomości do DJ / Live Talk',
        themes: '🎨 Motywy wizualne',
        ratings: '⭐ System ocen utworów'
    };

    // Count new features requests
    const newFeatureCounts = {};
    responses.forEach(r => {
        r.newFeatures.forEach(feature => {
            newFeatureCounts[feature] = (newFeatureCounts[feature] || 0) + 1;
        });
    });

    const newFeatureLabels = {
        'playlist-editor': '🎧 Edytor playlist / kolejki utworów',
        'podcast': '🎙️ Podcasty / nagrania audio',
        'chat': '💭 Czat na żywo',
        'calendar': '📅 Kalendarz wydarzeń / zmian',
        'news': '📰 Tablica ogłoszeń',
        'games': '🎮 Mini gry / zabawy',
        'other': 'Inne'
    };

    // Count help areas
    const helpAreaCounts = {};
    responses.forEach(r => {
        r.helpAreas.forEach(area => {
            helpAreaCounts[area] = (helpAreaCounts[area] || 0) + 1;
        });
    });

    const helpAreaLabels = {
        programming: '💻 Programowanie / kod',
        design: '🎨 Projektowanie / grafika',
        music: '🎵 Muzyka / audio',
        testing: '🔍 Testowanie / feedback',
        content: '✍️ Tworzenie treści',
        ideas: '💡 Pomysły / koncepcje'
    };

    let html = `
        <div class="results-summary">
            <p class="total-responses">Łącznie odpowiedzi: <strong>${total}</strong></p>

            <div class="stat-section">
                <h4>🤝 Chęć kontynuacji pracy w okrojonym zespole:</h4>
                <div class="stat-bar">
                    <div class="stat-item">
                        <span class="stat-label">Tak, jestem zainteresowany/a</span>
                        <div class="stat-progress">
                            <div class="stat-fill yes-fill" style="width: ${(continuationCounts.yes / total * 100).toFixed(1)}%"></div>
                        </div>
                        <span class="stat-value">${continuationCounts.yes} (${(continuationCounts.yes / total * 100).toFixed(1)}%)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Może, w zależności od warunków</span>
                        <div class="stat-progress">
                            <div class="stat-fill maybe-fill" style="width: ${(continuationCounts.maybe / total * 100).toFixed(1)}%"></div>
                        </div>
                        <span class="stat-value">${continuationCounts.maybe} (${(continuationCounts.maybe / total * 100).toFixed(1)}%)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Nie, dziękuję</span>
                        <div class="stat-progress">
                            <div class="stat-fill no-fill" style="width: ${(continuationCounts.no / total * 100).toFixed(1)}%"></div>
                        </div>
                        <span class="stat-value">${continuationCounts.no} (${(continuationCounts.no / total * 100).toFixed(1)}%)</span>
                    </div>
                </div>
            </div>

            <div class="stat-section">
                <h4>⭐ Najbardziej przydatne funkcje Daremon:</h4>
                <div class="stat-bar">
                    ${Object.entries(featureCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([feature, count]) => `
                            <div class="stat-item">
                                <span class="stat-label">${featureLabels[feature] || feature}</span>
                                <div class="stat-progress">
                                    <div class="stat-fill area-fill" style="width: ${(count / total * 100).toFixed(1)}%"></div>
                                </div>
                                <span class="stat-value">${count} (${(count / total * 100).toFixed(1)}%)</span>
                            </div>
                        `).join('')}
                </div>
            </div>

            <div class="stat-section">
                <h4>🚀 Żądane nowe funkcje:</h4>
                <div class="stat-bar">
                    ${Object.entries(newFeatureCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([feature, count]) => `
                            <div class="stat-item">
                                <span class="stat-label">${newFeatureLabels[feature] || feature}</span>
                                <div class="stat-progress">
                                    <div class="stat-fill area-fill" style="width: ${(count / total * 100).toFixed(1)}%"></div>
                                </div>
                                <span class="stat-value">${count} (${(count / total * 100).toFixed(1)}%)</span>
                            </div>
                        `).join('')}
                </div>
            </div>

            <div class="stat-section">
                <h4>🛠️ Obszary w których mogą pomóc pracownicy:</h4>
                <div class="stat-bar">
                    ${Object.entries(helpAreaCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([area, count]) => `
                            <div class="stat-item">
                                <span class="stat-label">${helpAreaLabels[area] || area}</span>
                                <div class="stat-progress">
                                    <div class="stat-fill area-fill" style="width: ${(count / total * 100).toFixed(1)}%"></div>
                                </div>
                                <span class="stat-value">${count} (${(count / total * 100).toFixed(1)}%)</span>
                            </div>
                        `).join('')}
                </div>
            </div>

            <div class="stat-section">
                <h4>💡 Pomysły i sugestie:</h4>
                <div class="ideas-list">
                    ${responses
                        .filter(r => r.ideas && r.ideas.trim())
                        .map((r, idx) => `
                            <div class="idea-item">
                                <strong>${escapeHtml(r.name)}</strong>
                                <p>${escapeHtml(r.ideas)}</p>
                            </div>
                        `).join('') || '<p class="no-ideas">Brak pomysłów (jeszcze!)</p>'}
                </div>
                ${responses.filter(r => r.newFeaturesOther && r.newFeaturesOther.trim()).length > 0 ? `
                    <h5 style="margin-top: 1rem; color: #18A0C7;">Inne propozycje funkcji:</h5>
                    <div class="ideas-list">
                        ${responses
                            .filter(r => r.newFeaturesOther && r.newFeaturesOther.trim())
                            .map(r => `
                                <div class="idea-item">
                                    <strong>${escapeHtml(r.name)}</strong>
                                    <p>${escapeHtml(r.newFeaturesOther)}</p>
                                </div>
                            `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    return html;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export for use in app.js
if (typeof window !== 'undefined') {
    window.initializeEmployeeSurvey = initializeEmployeeSurvey;
}

export default { initializeEmployeeSurvey };
