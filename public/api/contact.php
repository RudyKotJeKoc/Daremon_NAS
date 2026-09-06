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

require_once __DIR__ . '/config.php';

// E-mailadres waar nieuwe aanvragen naartoe worden gestuurd — instelbaar via
// CONTACT_TO_EMAIL (zelfde env-conventie als DB_*/SMTP_*), met een vaste
// fallback. Dit is een ander adres dan het SMTP-account waarmee de mail
// wordt verzonden (zie SMTP_USER in mailer.php, geauthenticeerd als
// info@daremon.nl) — RECIPIENT_EMAIL is puur "aan wie", niet "van welk account".
function recipientEmail(): string {
    return daremon_env('CONTACT_TO_EMAIL', 'dariusz@daremon.nl');
}

const FROM_EMAIL = 'noreply@daremon.nl'; // Change to your domain email (fallback voor mail())
const SUBJECT = 'Nieuw contactformulier bericht - Daremon';

// Rate limiting (requests per minute)
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60; // seconds

// ============================================
// LOKALIZACJA KOMUNIKATÓW (PL/NL — zgodnie z globalnym przełącznikiem języka)
// ============================================

function resolveLanguage(array $data): string {
    $lang = trim((string)($data['language'] ?? ''));
    return in_array($lang, ['pl', 'nl'], true) ? $lang : 'nl';
}

function messagesFor(string $lang): array {
    if ($lang === 'pl') {
        return [
            'invalid_json' => 'Nieprawidłowe dane JSON.',
            'method_not_allowed' => 'Dozwolone są wyłącznie żądania POST.',
            'rate_limited' => 'Zbyt wiele żądań. Spróbuj ponownie za minutę.',
            'spam_detected' => 'Wykryto spam.',
            'validation_failed' => 'Walidacja nie powiodła się.',
            'field_required' => 'Pole „%s” jest wymagane.',
            'invalid_email' => 'Nieprawidłowy adres e-mail.',
            'field_too_long' => 'Pole „%s” jest za długie (maks. %d znaków).',
            'message_too_short' => 'Wiadomość jest za krótka (min. 10 znaków).',
            'send_failed' => 'Wysyłka nie powiodła się. Spróbuj ponownie później lub napisz bezpośrednio na info@daremon.nl.',
            'success' => 'Dziękuję za wiadomość! Odezwę się najszybciej, jak to możliwe.',
            'field_names' => ['naam' => 'Imię i nazwisko', 'email' => 'E-mail', 'onderwerp' => 'Temat', 'bericht' => 'Wiadomość', 'bedrijf' => 'Firma'],
        ];
    }
    return [
        'invalid_json' => 'Ongeldige JSON data.',
        'method_not_allowed' => 'Alleen POST requests zijn toegestaan.',
        'rate_limited' => 'Te veel verzoeken. Probeer het over een minuut opnieuw.',
        'spam_detected' => 'Spam gedetecteerd.',
        'validation_failed' => 'Validatie mislukt.',
        'field_required' => 'Veld "%s" is verplicht.',
        'invalid_email' => 'Ongeldig e-mailadres.',
        'field_too_long' => 'Veld "%s" is te lang (max %d tekens).',
        'message_too_short' => 'Bericht is te kort (min 10 tekens).',
        'send_failed' => 'Het verzenden is mislukt. Probeer het later opnieuw of mail rechtstreeks naar info@daremon.nl.',
        'success' => 'Bedankt voor uw bericht! Ik neem zo snel mogelijk contact met u op.',
        'field_names' => ['naam' => 'Naam', 'email' => 'E-mail', 'onderwerp' => 'Onderwerp', 'bericht' => 'Bericht', 'bedrijf' => 'Bedrijf'],
    ];
}

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

function validateInput(array $data, array $messages): array {
    $errors = [];
    $names = $messages['field_names'];

    // Required fields
    $required = ['naam', 'email', 'onderwerp', 'bericht'];
    foreach ($required as $field) {
        if (empty($data[$field] ?? '')) {
            $errors[] = sprintf($messages['field_required'], $names[$field]);
        }
    }

    // Email validation
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = $messages['invalid_email'];
    }

    // Length validation
    if (strlen($data['naam'] ?? '') > 100) {
        $errors[] = sprintf($messages['field_too_long'], $names['naam'], 100);
    }
    if (strlen($data['onderwerp'] ?? '') > 200) {
        $errors[] = sprintf($messages['field_too_long'], $names['onderwerp'], 200);
    }
    if (strlen($data['bedrijf'] ?? '') > 150) {
        $errors[] = sprintf($messages['field_too_long'], $names['bedrijf'], 150);
    }
    if (strlen($data['bericht'] ?? '') > 5000) {
        $errors[] = sprintf($messages['field_too_long'], $names['bericht'], 5000);
    }

    // Minimum length
    if (strlen($data['bericht'] ?? '') < 10) {
        $errors[] = $messages['message_too_short'];
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

/**
 * Wysyła powiadomienie e-mail. Zwraca tablicę diagnostyczną zamiast samego
 * boola, żeby wywołujący (główna logika niżej) mógł w razie awarii zwrócić
 * do klienta dokładny powód (błąd połączenia/SSL/uwierzytelnienia SMTP), a
 * nie po cichu udawać sukces.
 *
 * @return array{sent: bool, via: string|null, smtp_error: string|null}
 */
function sendEmail(array $data): array {
    $naam = $data['naam'];
    $email = $data['email'];
    $bedrijf = $data['bedrijf'] ?? '';
    $onderwerp = $data['onderwerp'];
    $bericht = $data['bericht'];

    $bedrijfRow = $bedrijf !== ''
        ? '<div class="field"><div class="label">Bedrijf:</div><div class="value">' . $bedrijf . '</div></div>'
        : '';

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
            {$bedrijfRow}
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

    // Voorkeur: echte SMTP-verzending (werkt ook op hosts zoals Synology
    // Web Station, waar mail() meestal geen lokale MTA tot zijn beschikking
    // heeft). Alleen als SMTP niet geconfigureerd is, of de verzending faalt,
    // vallen we terug op de ingebouwde PHP mail().
    require_once __DIR__ . '/mailer.php';

    $recipient = recipientEmail();
    $smtpErrorMessage = null;

    if (smtpConfigured()) {
        try {
            sendViaSmtp($recipient, 'DAREMON Engineering', SUBJECT, $emailBody, $email);
            return ['sent' => true, 'via' => 'smtp', 'smtp_error' => null];
        } catch (\Throwable $smtpError) {
            // Dokładny powód (błąd socketu/SSL/AUTH/dialogu SMTP) trafia zarówno
            // do logu serwera, jak i do odpowiedzi JSON — bez tego formularz
            // "po cichu" udawał sukces, mimo że wiadomość nigdy nie dotarła.
            $smtpErrorMessage = sprintf(
                '[%s] %s',
                (new \ReflectionClass($smtpError))->getShortName(),
                $smtpError->getMessage()
            );
            error_log('[contact.php] SMTP-verzending mislukt, val terug op mail(): ' . $smtpErrorMessage);
        }
    } else {
        $smtpErrorMessage = 'SMTP is niet geconfigureerd (SMTP_HOST ontbreekt) — alleen mail() fallback geprobeerd.';
    }

    $headers = [
        'From: ' . FROM_EMAIL,
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8'
    ];

    $mailSent = mail(
        $recipient,
        SUBJECT,
        $emailBody,
        implode("\r\n", $headers)
    );

    return ['sent' => $mailSent, 'via' => $mailSent ? 'mail' : null, 'smtp_error' => $smtpErrorMessage];
}

// ============================================
// MAIN LOGIC
// ============================================

// Domyślny język komunikatów, dopóki nie znamy treści żądania (np. błąd
// parsowania JSON) — reszta obsługi przełącza się na język z payloadu.
$messages = messagesFor('nl');

try {
    // Get POST data
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
        throw new Exception($messages['invalid_json']);
    }

    // Od tego miejsca znamy język wybrany w interfejsie (PL/NL) — wszystkie
    // komunikaty zwracane do klienta mają się z nim zgadzać.
    $lang = resolveLanguage($data);
    $messages = messagesFor($lang);

    // Rate limiting check
    if (!checkRateLimit()) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => $messages['rate_limited']
        ]);
        exit();
    }

    // Honeypot check
    if (!checkHoneypot($data)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $messages['spam_detected']
        ]);
        exit();
    }

    // Validate input
    $errors = validateInput($data, $messages);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $messages['validation_failed'],
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
    $dbErrorMessage = null;
    try {
        saveLead($cleanData);
        $leadSaved = true;
    } catch (\Throwable $dbError) {
        // Faktyczna treść błędu PDO (np. "SQLSTATE[HY000] [2002] Connection
        // refused" przy złym porcie, albo błąd uwierzytelnienia/brakującej
        // tabeli) — logowana i zwracana w odpowiedzi, żeby diagnoza awarii
        // zapisu nie wymagała ręcznego grzebania w logach serwera.
        $dbErrorMessage = sprintf(
            '[%s] %s',
            (new \ReflectionClass($dbError))->getShortName(),
            $dbError->getMessage()
        );
        error_log('[contact.php] Opslaan van lead in database mislukt: ' . $dbErrorMessage);
    }

    $emailResult = sendEmail($cleanData);
    $emailSent = $emailResult['sent'];
    $smtpErrorMessage = $emailResult['smtp_error'];
    if (!$emailSent) {
        error_log('[contact.php] Verzenden van notificatie-e-mail mislukt.');
    }

    // Diagnostyka dołączana do odpowiedzi zawsze, gdy dany kanał zawiódł —
    // niezależnie od ogólnego wyniku — żeby częściowa awaria (np. e-mail
    // wysłany, ale zapis w bazie nieudany) też była widoczna, a nie ukryta
    // za ogólnym "success: true".
    $diagnostics = [];
    if ($dbErrorMessage !== null) {
        $diagnostics['db_error'] = $dbErrorMessage;
    }
    if ($smtpErrorMessage !== null) {
        $diagnostics['smtp_error'] = $smtpErrorMessage;
    }

    if (!$leadSaved && !$emailSent) {
        // Beide kanalen zijn mislukt — de aanvraag is nergens beland. Geen
        // stille "success", maar een eerlijke 500 met de exacte technische
        // reden van beide kanalen erbij.
        http_response_code(500);
        echo json_encode(array_merge([
            'success' => false,
            'message' => $messages['send_failed'],
        ], $diagnostics));
        exit();
    }

    // Success response — ook bij gedeeltelijk succes (bv. e-mail wel, DB niet)
    // blijft dit "success: true" voor de gebruiker, met de falende kant erbij
    // voor wie de JSON-respons/logs inspecteert.
    http_response_code(200);
    echo json_encode(array_merge([
        'success' => true,
        'message' => $messages['success'],
    ], $diagnostics));

} catch (Exception $e) {
    // Error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

exit();
