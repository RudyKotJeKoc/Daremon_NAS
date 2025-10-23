/**
 * Survey System - Ankieta "Zostańmy w kontakcie"
 * Handles survey form submission and results display
 */

const SURVEY_STORAGE_KEY = 'daremon_survey_responses';

// Initialize survey system
export function initializeSurvey() {
    const form = document.getElementById('survey-form');
    const resultsBtn = document.getElementById('survey-results-btn');
    const closeResultsBtn = document.getElementById('close-results-btn');

    if (!form) {
        console.warn('Survey form not found');
        return;
    }

    // Handle form submission
    form.addEventListener('submit', handleSurveySubmit);

    // Handle results button
    if (resultsBtn) {
        resultsBtn.addEventListener('click', showSurveyResults);
    }

    // Handle close results button
    if (closeResultsBtn) {
        closeResultsBtn.addEventListener('click', hideSurveyResults);
    }

    console.log('✅ System ankiety zainicjalizowany');
}

/**
 * Handle survey form submission
 */
function handleSurveySubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Collect form data
    const response = {
        timestamp: new Date().toISOString(),
        name: formData.get('name'),
        workInterest: formData.get('work-interest'),
        areas: formData.getAll('area'),
        areaOther: formData.get('area-other') || '',
        ideas: formData.get('ideas') || ''
    };

    // Save response to localStorage
    saveSurveyResponse(response);

    // Show success message
    showSuccessMessage();

    // Reset form
    event.target.reset();

    // Scroll to success message
    document.getElementById('survey-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Save survey response to localStorage
 */
function saveSurveyResponse(response) {
    try {
        const responses = getSurveyResponses();
        responses.push(response);
        localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(responses));
        console.log('✅ Odpowiedź ankiety zapisana');
    } catch (error) {
        console.error('❌ Błąd zapisywania odpowiedzi:', error);
        alert('Nie udało się zapisać ankiety. Spróbuj ponownie.');
    }
}

/**
 * Get all survey responses from localStorage
 */
function getSurveyResponses() {
    try {
        const data = localStorage.getItem(SURVEY_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('❌ Błąd odczytu odpowiedzi:', error);
        return [];
    }
}

/**
 * Show success message
 */
function showSuccessMessage() {
    const successMsg = document.getElementById('survey-success');
    const form = document.getElementById('survey-form');

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
 * Show survey results
 */
function showSurveyResults() {
    const responses = getSurveyResponses();
    const resultsDiv = document.getElementById('survey-results');
    const contentDiv = document.getElementById('survey-results-content');

    if (!resultsDiv || !contentDiv) return;

    if (responses.length === 0) {
        contentDiv.innerHTML = '<p class="no-results">Brak odpowiedzi. Bądź pierwszy!</p>';
    } else {
        contentDiv.innerHTML = generateResultsHTML(responses);
    }

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Hide survey results
 */
function hideSurveyResults() {
    const resultsDiv = document.getElementById('survey-results');
    if (resultsDiv) {
        resultsDiv.classList.add('hidden');
    }
}

/**
 * Generate HTML for results display
 */
function generateResultsHTML(responses) {
    const total = responses.length;

    // Count work interest responses
    const workInterestCounts = {
        yes: responses.filter(r => r.workInterest === 'yes').length,
        maybe: responses.filter(r => r.workInterest === 'maybe').length,
        no: responses.filter(r => r.workInterest === 'no').length
    };

    // Count areas
    const areaCounts = {};
    responses.forEach(r => {
        r.areas.forEach(area => {
            areaCounts[area] = (areaCounts[area] || 0) + 1;
        });
    });

    const areaLabels = {
        production: 'Produkcja / montaż',
        maintenance: 'Utrzymanie ruchu / techniczne wsparcie',
        tooling: 'Narzędziownia / naprawy form',
        electronics: 'Elektronika / automatyka / programowanie',
        logistics: 'Logistyka / organizacja',
        other: 'Inne'
    };

    let html = `
        <div class="results-summary">
            <p class="total-responses">Łącznie odpowiedzi: <strong>${total}</strong></p>

            <div class="stat-section">
                <h4>Chęć dalszej pracy w Boxtel:</h4>
                <div class="stat-bar">
                    <div class="stat-item">
                        <span class="stat-label">Tak</span>
                        <div class="stat-progress">
                            <div class="stat-fill yes-fill" style="width: ${(workInterestCounts.yes / total * 100).toFixed(1)}%"></div>
                        </div>
                        <span class="stat-value">${workInterestCounts.yes} (${(workInterestCounts.yes / total * 100).toFixed(1)}%)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Może</span>
                        <div class="stat-progress">
                            <div class="stat-fill maybe-fill" style="width: ${(workInterestCounts.maybe / total * 100).toFixed(1)}%"></div>
                        </div>
                        <span class="stat-value">${workInterestCounts.maybe} (${(workInterestCounts.maybe / total * 100).toFixed(1)}%)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Nie</span>
                        <div class="stat-progress">
                            <div class="stat-fill no-fill" style="width: ${(workInterestCounts.no / total * 100).toFixed(1)}%"></div>
                        </div>
                        <span class="stat-value">${workInterestCounts.no} (${(workInterestCounts.no / total * 100).toFixed(1)}%)</span>
                    </div>
                </div>
            </div>

            <div class="stat-section">
                <h4>Obszary kompetencji:</h4>
                <div class="stat-bar">
                    ${Object.entries(areaCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([area, count]) => `
                            <div class="stat-item">
                                <span class="stat-label">${areaLabels[area] || area}</span>
                                <div class="stat-progress">
                                    <div class="stat-fill area-fill" style="width: ${(count / total * 100).toFixed(1)}%"></div>
                                </div>
                                <span class="stat-value">${count} (${(count / total * 100).toFixed(1)}%)</span>
                            </div>
                        `).join('')}
                </div>
            </div>

            <div class="stat-section">
                <h4>Pomysły i projekty:</h4>
                <div class="ideas-list">
                    ${responses
                        .filter(r => r.ideas && r.ideas.trim())
                        .map((r, idx) => `
                            <div class="idea-item">
                                <strong>${r.name || 'Anonim'}</strong>
                                <p>${escapeHtml(r.ideas)}</p>
                            </div>
                        `).join('') || '<p class="no-ideas">Brak pomysłów (jeszcze!)</p>'}
                </div>
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
    window.initializeSurvey = initializeSurvey;
}

export default { initializeSurvey };
