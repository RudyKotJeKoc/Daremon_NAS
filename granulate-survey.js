/**
 * Granulate Transport System Survey - Ankieta o systemie transportu granulatu
 * Dedicated survey for granulate transport system operators and maintenance staff
 */

import { submitSurvey } from './survey-api.js';
import { escapeHtml, generateSessionToken } from './sanitize.js';

const GRANULATE_SURVEY_STORAGE_KEY = 'daremon_granulate_survey_responses';

// Initialize granulate survey system
export function initializeGranulateSurvey() {
    const form = document.getElementById('granulate-survey-form');
    const resultsBtn = document.getElementById('granulate-survey-results-btn');
    const closeResultsBtn = document.getElementById('close-granulate-results-btn');

    if (!form) {
        console.warn('Granulate survey form not found');
        return;
    }

    // Handle form submission
    form.addEventListener('submit', handleGranulateSurveySubmit);

    // Handle results button
    if (resultsBtn) {
        resultsBtn.addEventListener('click', showGranulateSurveyResults);
    }

    // Handle close results button
    if (closeResultsBtn) {
        closeResultsBtn.addEventListener('click', hideGranulateSurveyResults);
    }

    console.log('✅ Granulaattransportsysteem enquête geïnitialiseerd');
}

/**
 * Handle granulate survey form submission
 */
function handleGranulateSurveySubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    // Disable submit button to prevent double submission
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '⏳ Verzenden...';
    }

    const formData = new FormData(form);

    // Collect form data
    const response = {
        timestamp: new Date().toISOString(),
        sessionToken: generateSessionToken(), // Basic CSRF-like protection

        // Sectie 1: Algemene ervaring
        experience: formData.get('experience'),
        factory: formData.get('factory'),
        factoryOther: formData.get('factory-other') || '',
        role: formData.get('role'),
        roleOther: formData.get('role-other') || '',

        // Sectie 2: Systeemproblemen
        interruptionFrequency: formData.get('interruption-frequency'),
        systemProblems: formData.getAll('system-problems'),
        systemProblemsOther: formData.get('system-problems-other') || '',
        interruptionDuration: formData.get('interruption-duration'),

        // Sectie 3: Sensoren en automatisering
        sensorsFunction: formData.get('sensors-function'),
        systemDiagnosis: formData.get('system-diagnosis'),
        alarmResolution: formData.get('alarm-resolution'),

        // Sectie 4: Logistiek en materiaaltoevoer
        supplyContinuity: formData.get('supply-continuity'),
        bufferNeed: formData.get('buffer-need'),
        deliveryErgonomics: formData.get('delivery-ergonomics'),

        // Sectie 5: Training en ondersteuning
        trainingReceived: formData.get('training-received'),
        operationConfidence: formData.get('operation-confidence'),
        helpNeeded: formData.getAll('help-needed'),
        helpNeededOther: formData.get('help-needed-other') || '',

        // Sectie 6: Verbeteringsvoorstellen
        improvements: formData.get('improvements') || '',
        harmfulBehavior: formData.get('harmful-behavior'),
        harmfulBehaviorDetail: formData.get('harmful-behavior-detail') || '',
        stressLevel: formData.get('stress-level'),
        additionalComments: formData.get('additional-comments') || ''
    };

    // Validate required fields with better feedback
    const validationErrors = [];
    if (!response.experience) validationErrors.push('Werkervaring');
    if (!response.factory) validationErrors.push('Fabriek');
    if (!response.role) validationErrors.push('Rol');

    if (validationErrors.length > 0) {
        showValidationError(`Vul de volgende verplichte velden in: ${validationErrors.join(', ')}`);

        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '📤 Enquête Verzenden';
        }
        return;
    }

    // Submit to backend API (with offline fallback)
    submitSurveyToBackend(response, form, submitButton);
}

/**
 * Submit survey to backend with offline fallback
 */
async function submitSurveyToBackend(response, form, submitButton) {
    try {
        // Submit to backend API
        const result = await submitSurvey('granulate', response);

        // Save to localStorage regardless of backend status
        saveGranulateSurveyResponse(response);

        // Show appropriate success message
        if (result.offline) {
            if (result.queued) {
                showSuccessMessage('✅ Enquête opgeslagen en in wachtrij voor synchronisatie', 'info');
            } else {
                showSuccessMessage('✅ Enquête lokaal opgeslagen (backend niet beschikbaar)', 'warning');
            }
        } else {
            showSuccessMessage('✅ Enquête succesvol verzonden naar server!', 'success');
        }

        // Show default success message
        showGranulateSuccessMessage();

        // Reset form
        form.reset();

        // Scroll to success message
        document.getElementById('granulate-survey-success')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

    } catch (error) {
        console.error('Survey submission error:', error);

        // Save locally even if backend fails
        saveGranulateSurveyResponse(response);

        // Show error but confirm local save
        showValidationError('Verzending mislukt, maar lokaal opgeslagen. Probeer later opnieuw.');
    } finally {
        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '📤 Enquête Verzenden';
        }
    }
}

/**
 * Show validation error message
 */
function showValidationError(message) {
    // Check if error message already exists
    let errorDiv = document.querySelector('.survey-validation-error');

    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'survey-validation-error';
        errorDiv.style.cssText = `
            background-color: rgba(239, 68, 68, 0.1);
            border: 2px solid rgba(239, 68, 68, 0.5);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            color: #ef4444;
            font-weight: 600;
        `;

        const form = document.getElementById('granulate-survey-form');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        }
    }

    errorDiv.textContent = `⚠️ ${message}`;
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Show success message with different types
 */
function showSuccessMessage(message, type = 'success') {
    const colors = {
        success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.5)', color: '#10b981' },
        info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.5)', color: '#3b82f6' },
        warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.5)', color: '#f59e0b' }
    };

    const style = colors[type] || colors.success;

    let messageDiv = document.querySelector('.survey-status-message');

    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'survey-status-message';

        const form = document.getElementById('granulate-survey-form');
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

    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

/**
 * Save granulate survey response to localStorage
 */
function saveGranulateSurveyResponse(response) {
    try {
        const responses = getGranulateSurveyResponses();
        responses.push(response);
        localStorage.setItem(GRANULATE_SURVEY_STORAGE_KEY, JSON.stringify(responses));
        console.log('✅ Granulaattransport enquêteantwoord opgeslagen');
    } catch (error) {
        console.error('❌ Fout bij opslaan antwoord:', error);
        alert('Kon enquête niet opslaan. Probeer opnieuw.');
    }
}

/**
 * Get all granulate survey responses from localStorage
 */
function getGranulateSurveyResponses() {
    try {
        const data = localStorage.getItem(GRANULATE_SURVEY_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('❌ Fout bij lezen antwoorden:', error);
        return [];
    }
}

/**
 * Show success message
 */
function showGranulateSuccessMessage() {
    const successMsg = document.getElementById('granulate-survey-success');
    const form = document.getElementById('granulate-survey-form');

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
 * Show granulate survey results
 */
function showGranulateSurveyResults() {
    const responses = getGranulateSurveyResponses();
    const resultsDiv = document.getElementById('granulate-survey-results');
    const contentDiv = document.getElementById('granulate-survey-results-content');

    if (!resultsDiv || !contentDiv) return;

    if (responses.length === 0) {
        contentDiv.innerHTML = '<p class="no-results">Nog geen antwoorden. Wees de eerste!</p>';
    } else {
        contentDiv.innerHTML = generateGranulateResultsHTML(responses);
    }

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Hide granulate survey results
 */
function hideGranulateSurveyResults() {
    const resultsDiv = document.getElementById('granulate-survey-results');
    if (resultsDiv) {
        resultsDiv.classList.add('hidden');
    }
}

/**
 * Generate HTML for results display
 */
function generateGranulateResultsHTML(responses) {
    const total = responses.length;

    // Helper function to count responses
    const countResponses = (key) => {
        const counts = {};
        responses.forEach(r => {
            const value = r[key];
            if (value) {
                counts[value] = (counts[value] || 0) + 1;
            }
        });
        return counts;
    };

    // Helper function for multi-select responses
    const countMultiResponses = (key) => {
        const counts = {};
        responses.forEach(r => {
            const values = r[key] || [];
            values.forEach(value => {
                counts[value] = (counts[value] || 0) + 1;
            });
        });
        return counts;
    };

    // Count all statistics
    const experienceCounts = countResponses('experience');
    const factoryCounts = countResponses('factory');
    const roleCounts = countResponses('role');
    const interruptionFreqCounts = countResponses('interruptionFrequency');
    const systemProblemsCounts = countMultiResponses('systemProblems');
    const durationCounts = countResponses('interruptionDuration');
    const sensorsCounts = countResponses('sensorsFunction');
    const diagnosisCounts = countResponses('systemDiagnosis');
    const alarmCounts = countResponses('alarmResolution');
    const continuityCounts = countResponses('supplyContinuity');
    const bufferCounts = countResponses('bufferNeed');
    const ergonomicsCounts = countResponses('deliveryErgonomics');
    const trainingCounts = countResponses('trainingReceived');
    const confidenceCounts = countResponses('operationConfidence');
    const helpNeededCounts = countMultiResponses('helpNeeded');
    const behaviorCounts = countResponses('harmfulBehavior');
    const stressCounts = countResponses('stressLevel');

    // Labels for display
    const experienceLabels = {
        'less-3m': 'Minder dan 3 maanden',
        '3-6m': '3-6 maanden',
        '6-12m': '6-12 maanden',
        'more-1y': 'Meer dan 1 jaar'
    };

    const factoryLabels = {
        'boxtel': 'Boxtel (Nederland)',
        'czech': 'Tsjechië',
        'other': 'Andere locatie'
    };

    const roleLabels = {
        'operator': 'Machineoperator',
        'logistics': 'Logistiek medewerker',
        'maintenance': 'Onderhoudstechnicus',
        'management': 'Management / Toezicht',
        'other': 'Overig'
    };

    const interruptionFreqLabels = {
        'daily': 'Dagelijks',
        'several-week': 'Enkele keren per week',
        'once-week': 'Eenmaal per week',
        'rarely': 'Zelden (enkele keren per maand)',
        'never': 'Nooit'
    };

    const systemProblemsLabels = {
        'blockage': 'Verstopping in leidingen',
        'shortage': 'Granulaattekort in hoppers',
        'false-alarms': 'Valse alarmen',
        'valve-issues': 'Slecht functionerende kleppen',
        'sensor-problems': 'Problemen met niveausensoren',
        'communication': 'Communicatieproblemen tussen apparaten',
        'other': 'Overig'
    };

    const durationLabels = {
        'less-5m': 'Minder dan 5 minuten',
        '5-15m': '5-15 minuten',
        '15-30m': '15-30 minuten',
        '30-60m': '30-60 minuten',
        'more-1h': 'Meer dan 1 uur'
    };

    const sensorsLabels = {
        'definitely': 'Zeker ja',
        'mostly-yes': 'Meestal wel',
        'sometimes': 'Soms zijn er problemen',
        'mostly-not': 'Meestal niet',
        'frequent-problems': 'Nee, zeer frequent problemen'
    };

    const diagnosisLabels = {
        'always': 'Altijd',
        'mostly': 'Meestal',
        'sometimes': 'Soms',
        'rarely': 'Zelden',
        'never': 'Nooit – moeilijk te begrijpen wat er mis is'
    };

    const alarmLabels = {
        'definitely': 'Zeker ja',
        'mostly-yes': 'Meestal wel',
        'sometimes': 'Soms',
        'mostly-not': 'Meestal niet',
        'never': 'Nooit'
    };

    const continuityLabels = {
        'very-good': 'Zeer goed',
        'good': 'Goed',
        'average': 'Gemiddeld',
        'poor': 'Slecht',
        'very-poor': 'Zeer slecht'
    };

    const bufferLabels = {
        'definitely-miss': 'Zeker – ik mis deze beveiliging',
        'mostly-yes': 'Meestal wel',
        'sometimes': 'Soms zou dit nuttig zijn',
        'mostly-not': 'Meestal niet',
        'no-sufficient': 'Nee – we hebben voldoende buffers'
    };

    const ergonomicsLabels = {
        'definitely': 'Zeker ja',
        'mostly-yes': 'Meestal wel',
        'moderate': 'Matig',
        'mostly-not': 'Meestal niet',
        'no-problems': 'Nee – veel problemen'
    };

    const trainingLabels = {
        'extensive': 'Ja, uitgebreide training',
        'yes-short': 'Ja, maar kort',
        'brief': 'Alleen korte instructie',
        'no': 'Nee'
    };

    const confidenceLabels = {
        'fully': 'Volledig zelfverzekerd',
        'mostly-yes': 'Meestal wel',
        'sometimes': 'Soms twijfels',
        'mostly-not': 'Meestal niet zelfverzekerd',
        'no-knowledge': 'Nee – ik mis kennis'
    };

    const helpNeededLabels = {
        'diagnosis-training': 'Training in probleemdiagnose',
        'procedures': 'Duidelijke stap-voor-stap procedures',
        'tech-support': 'Beter bereikbare technische ondersteuning',
        'error-messages': 'Betere foutmeldingen in het systeem',
        'other': 'Overig'
    };

    const behaviorLabels = {
        'yes-regular': 'Ja, regelmatig',
        'sometimes': 'Soms',
        'rarely': 'Zelden',
        'no': 'Nee'
    };

    const stressLabels = {
        'definitely': 'Zeker – dit is veel stress',
        'mostly-yes': 'Meestal wel',
        'sometimes': 'Soms',
        'mostly-not': 'Meestal niet',
        'no': 'Nee'
    };

    // Generate HTML
    let html = `
        <div class="results-summary">
            <p class="total-responses">Totaal aantal antwoorden: <strong>${total}</strong></p>

            <!-- SECTIE 1: ALGEMENE ERVARING -->
            <div class="stat-section">
                <h4>📊 SECTIE 1: ALGEMENE ERVARING</h4>

                <h5>Werkervaring met granulaattransportsysteem:</h5>
                <div class="stat-bar">
                    ${Object.entries(experienceCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(experienceLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Fabriek:</h5>
                <div class="stat-bar">
                    ${Object.entries(factoryCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(factoryLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Rol:</h5>
                <div class="stat-bar">
                    ${Object.entries(roleCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(roleLabels[key] || key, count, total))
                        .join('')}
                </div>
            </div>

            <!-- SECTIE 2: SYSTEEMPROBLEMEN -->
            <div class="stat-section">
                <h4>⚠️ SECTIE 2: SYSTEEMPROBLEMEN</h4>

                <h5>Frequentie van onderbrekingen:</h5>
                <div class="stat-bar">
                    ${Object.entries(interruptionFreqCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(interruptionFreqLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Meest voorkomende problemen (meerdere mogelijk):</h5>
                <div class="stat-bar">
                    ${Object.entries(systemProblemsCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(systemProblemsLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Duur van onderbrekingen:</h5>
                <div class="stat-bar">
                    ${Object.entries(durationCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(durationLabels[key] || key, count, total))
                        .join('')}
                </div>
            </div>

            <!-- SECTIE 3: SENSOREN EN AUTOMATISERING -->
            <div class="stat-section">
                <h4>🔧 SECTIE 3: SENSOREN EN AUTOMATISERING</h4>

                <h5>Functioneren niveausensoren correct:</h5>
                <div class="stat-bar">
                    ${Object.entries(sensorsCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(sensorsLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Systeem diagnoseert zelf problemen:</h5>
                <div class="stat-bar">
                    ${Object.entries(diagnosisCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(diagnosisLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Kunnen alarmen zelf oplossen:</h5>
                <div class="stat-bar">
                    ${Object.entries(alarmCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(alarmLabels[key] || key, count, total))
                        .join('')}
                </div>
            </div>

            <!-- SECTIE 4: LOGISTIEK EN MATERIAALTOEVOER -->
            <div class="stat-section">
                <h4>📦 SECTIE 4: LOGISTIEK EN MATERIAALTOEVOER</h4>

                <h5>Continuïteit van granulaattoevoer:</h5>
                <div class="stat-bar">
                    ${Object.entries(continuityCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(continuityLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Behoefte aan granulaatbuffer:</h5>
                <div class="stat-bar">
                    ${Object.entries(bufferCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(bufferLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Ergonomie en veiligheid van levering:</h5>
                <div class="stat-bar">
                    ${Object.entries(ergonomicsCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(ergonomicsLabels[key] || key, count, total))
                        .join('')}
                </div>
            </div>

            <!-- SECTIE 5: TRAINING EN ONDERSTEUNING -->
            <div class="stat-section">
                <h4>📚 SECTIE 5: TRAINING EN ONDERSTEUNING</h4>

                <h5>Ontvangen training:</h5>
                <div class="stat-bar">
                    ${Object.entries(trainingCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(trainingLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Zelfvertrouwen bij bediening:</h5>
                <div class="stat-bar">
                    ${Object.entries(confidenceCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(confidenceLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Gewenste hulp (meerdere mogelijk):</h5>
                <div class="stat-bar">
                    ${Object.entries(helpNeededCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(helpNeededLabels[key] || key, count, total))
                        .join('')}
                </div>
            </div>

            <!-- SECTIE 6: VERBETERINGSVOORSTELLEN -->
            <div class="stat-section">
                <h4>💡 SECTIE 6: VERBETERINGSVOORSTELLEN</h4>

                <h5>Schadelijk gedrag geobserveerd:</h5>
                <div class="stat-bar">
                    ${Object.entries(behaviorCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(behaviorLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Stressniveau door systeemproblemen:</h5>
                <div class="stat-bar">
                    ${Object.entries(stressCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, count]) => generateStatItem(stressLabels[key] || key, count, total))
                        .join('')}
                </div>

                <h5>Verbeteringsvoorstellen:</h5>
                <div class="ideas-list">
                    ${responses
                        .filter(r => r.improvements && r.improvements.trim())
                        .map((r, idx) => `
                            <div class="idea-item">
                                <strong>Antwoord ${idx + 1}</strong>
                                <p>${escapeHtml(r.improvements)}</p>
                            </div>
                        `).join('') || '<p class="no-ideas">Nog geen voorstellen</p>'}
                </div>

                ${responses.filter(r => r.harmfulBehaviorDetail && r.harmfulBehaviorDetail.trim()).length > 0 ? `
                    <h5 style="margin-top: 1rem; color: #18A0C7;">Details over schadelijk gedrag:</h5>
                    <div class="ideas-list">
                        ${responses
                            .filter(r => r.harmfulBehaviorDetail && r.harmfulBehaviorDetail.trim())
                            .map((r, idx) => `
                                <div class="idea-item">
                                    <strong>Antwoord ${idx + 1}</strong>
                                    <p>${escapeHtml(r.harmfulBehaviorDetail)}</p>
                                </div>
                            `).join('')}
                    </div>
                ` : ''}

                ${responses.filter(r => r.additionalComments && r.additionalComments.trim()).length > 0 ? `
                    <h5 style="margin-top: 1rem; color: #18A0C7;">Aanvullende opmerkingen:</h5>
                    <div class="ideas-list">
                        ${responses
                            .filter(r => r.additionalComments && r.additionalComments.trim())
                            .map((r, idx) => `
                                <div class="idea-item">
                                    <strong>Antwoord ${idx + 1}</strong>
                                    <p>${escapeHtml(r.additionalComments)}</p>
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
 * Helper function to generate stat item HTML
 */
function generateStatItem(label, count, total) {
    const percentage = ((count / total) * 100).toFixed(1);
    return `
        <div class="stat-item">
            <span class="stat-label">${label}</span>
            <div class="stat-progress">
                <div class="stat-fill area-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="stat-value">${count} (${percentage}%)</span>
        </div>
    `;
}

// Export for use in app.js
if (typeof window !== 'undefined') {
    window.initializeGranulateSurvey = initializeGranulateSurvey;
}

export default { initializeGranulateSurvey };
