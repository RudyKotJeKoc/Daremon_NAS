<?php
/**
 * Daremon Telemetry Endpoint
 *
 * Ciche zapisywanie odwiedzin stron (page_visits) i interakcji z portfolio
 * (portfolio_interactions). Wywoływane fetchem/sendBeacon z frontendu, nigdy
 * nie powinno przerywać działania strony w razie błędu.
 *
 * PHP 8.0+
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Alleen POST requests zijn toegestaan.']);
    exit();
}

require_once __DIR__ . '/db.php';

/**
 * @throws InvalidArgumentException
 */
function trackVisit(array $data): void
{
    $path = mb_substr(trim((string)($data['path'] ?? '')), 0, 255);
    $language = mb_substr(trim((string)($data['language'] ?? '')), 0, 10);
    $referrer = mb_substr(trim((string)($data['referrer'] ?? '')), 0, 500);
    $userAgent = mb_substr(trim((string)($_SERVER['HTTP_USER_AGENT'] ?? '')), 0, 500);

    if ($path === '') {
        throw new InvalidArgumentException('Missing path.');
    }

    $ipHash = hashIp(clientIp());

    $pdo = getDbConnection();
    $stmt = $pdo->prepare(
        'INSERT INTO page_visits (path, language, referrer, user_agent, ip_hash, created_at)
         VALUES (:path, :language, :referrer, :user_agent, :ip_hash, NOW())'
    );
    $stmt->execute([
        ':path' => $path,
        ':language' => $language !== '' ? $language : null,
        ':referrer' => $referrer !== '' ? $referrer : null,
        ':user_agent' => $userAgent !== '' ? $userAgent : null,
        ':ip_hash' => $ipHash,
    ]);
}

/**
 * @throws InvalidArgumentException
 */
function trackInteraction(array $data): void
{
    $itemId = mb_substr(trim((string)($data['item_id'] ?? '')), 0, 100);
    $action = mb_substr(trim((string)($data['action'] ?? '')), 0, 50);

    $allowedActions = ['play', 'expand', 'view'];

    if ($itemId === '' || !in_array($action, $allowedActions, true)) {
        throw new InvalidArgumentException('Missing or unsupported item_id/action.');
    }

    $pdo = getDbConnection();
    $stmt = $pdo->prepare(
        'INSERT INTO portfolio_interactions (item_id, action, created_at) VALUES (:item_id, :action, NOW())'
    );
    $stmt->execute([
        ':item_id' => $itemId,
        ':action' => $action,
    ]);
}

try {
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
        throw new InvalidArgumentException('Invalid JSON payload.');
    }

    switch ($data['type'] ?? '') {
        case 'visit':
            trackVisit($data);
            break;
        case 'interaction':
            trackInteraction($data);
            break;
        default:
            throw new InvalidArgumentException('Unknown tracking type.');
    }

    // 204: brak treści, klient nie musi (i nie powinien) czekać na odpowiedź.
    http_response_code(204);
    exit();
} catch (\Throwable $e) {
    // Telemetria nigdy nie może wywołać widocznego błędu u użytkownika —
    // logujemy po stronie serwera i mimo to zwracamy "cichy" status 204.
    error_log('[track.php] ' . $e->getMessage());
    http_response_code(204);
    exit();
}
