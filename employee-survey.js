/**
 * Employee Survey System - Ankieta Zespołu
 * Handles employee survey form submission and results display
 */

const EMPLOYEE_SURVEY_STORAGE_KEY = 'daremon_employee_survey_responses';

// Initialize employee survey system
export function initializeEmployeeSurvey() {
    const form = document.getElementById('employee-survey-form');
    const resultsBtn = document.getElementById('employee-survey-results-btn');
    const closeResultsBtn = document.getElementById('close-employee-results-btn');
    const toggleBtn = document.getElementById('survey-toggle');
    const content = document.getElementById('survey-content');
    
    // Also handle polls toggle
    const pollsToggleBtn = document.getElementById('polls-toggle');
    const pollsContent = document.getElementById('polls-collapsible-content');

    if (!form) {
        console.warn('Employee survey form not found');
        return;
    }

    // Handle toggle button for employee survey
    if (toggleBtn && content) {
        toggleBtn.addEventListener('click', () => {
            const isExpanded = content.classList.contains('expanded');
            if (isExpanded) {
                content.classList.remove('expanded');
                toggleBtn.classList.remove('active');
            } else {
                content.classList.add('expanded');
                toggleBtn.classList.add('active');
            }
        });
    }
    
    // Handle toggle button for listener polls
    if (pollsToggleBtn && pollsContent) {
        pollsToggleBtn.addEventListener('click', () => {
            const isExpanded = pollsContent.classList.contains('expanded');
            if (isExpanded) {
                pollsContent.classList.remove('expanded');
                pollsToggleBtn.classList.remove('active');
            } else {
                pollsContent.classList.add('expanded');
                pollsToggleBtn.classList.add('active');
            }
        });
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
function handleEmployeeSurveySubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Collect form data
    const response = {
        timestamp: new Date().toISOString(),
        name: formData.get('name') || 'Anonim',
        teamContinuation: formData.get('team-continuation'),
        daremonFeatures: formData.getAll('daremon-features'),
        newFeatures: formData.getAll('new-features'),
        newFeaturesOther: formData.get('new-features-other') || '',
        helpAreas: formData.getAll('help-areas'),
        ideas: formData.get('ideas') || ''
    };

    // Save response to localStorage
    saveEmployeeSurveyResponse(response);

    // Show success message
    showEmployeeSuccessMessage();

    // Reset form
    event.target.reset();

    // Scroll to success message
    document.getElementById('employee-survey-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
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
