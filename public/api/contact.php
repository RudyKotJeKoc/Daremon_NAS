<?php
/**
 * Daremon Contact Form Handler
 *
 * Features:
 * - Input validation and sanitization
 * - Rate limiting (session-based)
 * - Honeypot spam protection
 * - Email notification
 * - JSON API response
 *
 * PHP 8.0+
 */

// Enable error reporting for development (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Start session for rate limiting
session_start();

// CORS headers (adjust origin as needed)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle OPTIONS request (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Alleen POST requests zijn toegestaan.'
    ]);
    exit();
}

// ============================================
// CONFIGURATION
// ============================================

// Email configuration
const RECIPIENT_EMAIL = 'info@daremon.nl'; // Change to your email
const FROM_EMAIL = 'noreply@daremon.nl';   // Change to your domain email
const SUBJECT = 'Nieuw contactformulier bericht - Daremon';

// Rate limiting (requests per minute)
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60; // seconds

// ============================================
// RATE LIMITING
// ============================================

function checkRateLimit(): bool {
    if (!isset($_SESSION['form_submissions'])) {
        $_SESSION['form_submissions'] = [];
    }

    // Clean old submissions
    $now = time();
    $_SESSION['form_submissions'] = array_filter(
        $_SESSION['form_submissions'],
        fn($timestamp) => ($now - $timestamp) < RATE_LIMIT_WINDOW
    );

    // Check if limit exceeded
    if (count($_SESSION['form_submissions']) >= RATE_LIMIT) {
        return false;
    }

    // Add current submission
    $_SESSION['form_submissions'][] = $now;
    return true;
}

// ============================================
// SPAM PROTECTION (Honeypot)
// ============================================

function checkHoneypot(array $data): bool {
    // Honeypot field should be empty
    return empty($data['website'] ?? '');
}

// ============================================
// VALIDATION
// ============================================

function validateInput(array $data): array {
    $errors = [];

    // Required fields
    $required = ['naam', 'email', 'onderwerp', 'bericht'];
    foreach ($required as $field) {
        if (empty($data[$field] ?? '')) {
            $errors[] = "Veld '{$field}' is verplicht.";
        }
    }

    // Email validation
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Ongeldig e-mailadres.';
    }

    // Length validation
    if (strlen($data['naam'] ?? '') > 100) {
        $errors[] = 'Naam is te lang (max 100 tekens).';
    }
    if (strlen($data['onderwerp'] ?? '') > 200) {
        $errors[] = 'Onderwerp is te lang (max 200 tekens).';
    }
    if (strlen($data['bedrijf'] ?? '') > 150) {
        $errors[] = 'Bedrijfsnaam is te lang (max 150 tekens).';
    }
    if (strlen($data['bericht'] ?? '') > 5000) {
        $errors[] = 'Bericht is te lang (max 5000 tekens).';
    }

    // Minimum length
    if (strlen($data['bericht'] ?? '') < 10) {
        $errors[] = 'Bericht is te kort (min 10 tekens).';
    }

    return $errors;
}

// ============================================
// SANITIZATION
// ============================================

function sanitizeInput(array $data): array {
    $language = trim($data['language'] ?? '');
    return [
        'naam' => htmlspecialchars(trim($data['naam'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'email' => filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL),
        'bedrijf' => htmlspecialchars(trim($data['bedrijf'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'onderwerp' => htmlspecialchars(trim($data['onderwerp'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'bericht' => htmlspecialchars(trim($data['bericht'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'language' => in_array($language, ['pl', 'nl'], true) ? $language : 'nl',
    ];
}

// ============================================
// OPSLAG IN DATABASE (contact_leads)
// ============================================

/**
 * Zapisuje zapytanie ofertowe w tabeli contact_leads. To jest źródło prawdy
 * dla leadów — działa niezależnie od tego, czy powiadomienie e-mail się uda.
 *
 * @throws \Throwable gdy zapis się nie powiedzie (np. brak połączenia z bazą)
 */
function saveLead(array $data): void {
    require_once __DIR__ . '/db.php';

    $pdo = getDbConnection();
    $stmt = $pdo->prepare(
        'INSERT INTO contact_leads (name, email, company, message, language, status, created_at)
         VALUES (:name, :email, :company, :message, :language, :status, NOW())'
    );
    $stmt->execute([
        ':name' => $data['naam'],
        ':email' => $data['email'],
        ':company' => $data['bedrijf'] !== '' ? $data['bedrijf'] : null,
        // Onderwerp is geen apart kolom in het schema — bewaard als onderdeel van het bericht.
        ':message' => $data['onderwerp'] !== '' ? "[{$data['onderwerp']}] {$data['bericht']}" : $data['bericht'],
        ':language' => $data['language'],
        ':status' => 'new',
    ]);
}

// ============================================
// EMAIL SENDING
// ============================================

function sendEmail(array $data): bool {
    $naam = $data['naam'];
    $email = $data['email'];
    $onderwerp = $data['onderwerp'];
    $bericht = $data['bericht'];

    // Email headers
    $headers = [
        'From: ' . FROM_EMAIL,
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8'
    ];

    // Email body (HTML)
    $emailBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0e7490; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #0e7490; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #0e7490; }
        .footer { margin-top: 20px; padding: 10px; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">Nieuw contactformulier bericht</h2>
            <p style="margin: 5px 0 0 0;">Daremon.nl</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Naam:</div>
                <div class="value">{$naam}</div>
            </div>
            <div class="field">
                <div class="label">E-mail:</div>
                <div class="value"><a href="mailto:{$email}">{$email}</a></div>
            </div>
            <div class="field">
                <div class="label">Onderwerp:</div>
                <div class="value">{$onderwerp}</div>
            </div>
            <div class="field">
                <div class="label">Bericht:</div>
                <div class="value">{$bericht}</div>
            </div>
        </div>
        <div class="footer">
            <p>Dit bericht is verzonden via het contactformulier op daremon.nl</p>
            <p>Verzonden op: {date('d-m-Y H:i:s')}</p>
        </div>
    </div>
</body>
</html>
HTML;

    // Send email
    return mail(
        RECIPIENT_EMAIL,
        SUBJECT,
        $emailBody,
        implode("\r\n", $headers)
    );
}

// ============================================
// MAIN LOGIC
// ============================================

try {
    // Get POST data
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Ongeldige JSON data.');
    }

    // Rate limiting check
    if (!checkRateLimit()) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Te veel verzoeken. Probeer het over een minuut opnieuw.'
        ]);
        exit();
    }

    // Honeypot check
    if (!checkHoneypot($data)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Spam gedetecteerd.'
        ]);
        exit();
    }

    // Validate input
    $errors = validateInput($data);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Validatie mislukt.',
            'errors' => $errors
        ]);
        exit();
    }

    // Sanitize input
    $cleanData = sanitizeInput($data);

    // Zapis leada w bazie danych — to jest podstawowy, trwały zapis.
    // E-mail jest jedynie powiadomieniem "best effort": jego ewentualna
    // awaria (częsta na hostingu współdzielonym) nie może spowodować
    // utraty zapytania klienta.
    $leadSaved = false;
    try {
        saveLead($cleanData);
        $leadSaved = true;
    } catch (\Throwable $dbError) {
        error_log('[contact.php] Opslaan van lead in database mislukt: ' . $dbError->getMessage());
    }

    $emailSent = sendEmail($cleanData);
    if (!$emailSent) {
        error_log('[contact.php] Verzenden van notificatie-e-mail mislukt.');
    }

    if (!$leadSaved && !$emailSent) {
        // Beide kanalen zijn mislukt — de aanvraag is nergens beland, dus
        // moeten we de gebruiker eerlijk vertellen dat het niet is gelukt.
        throw new Exception('Het verzenden is mislukt. Probeer het later opnieuw of mail rechtstreeks naar info@daremon.nl.');
    }

    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Bedankt voor uw bericht! Ik neem zo snel mogelijk contact met u op.'
    ]);

} catch (Exception $e) {
    // Error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

exit();
