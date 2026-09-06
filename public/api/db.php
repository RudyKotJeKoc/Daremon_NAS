<?php
/**
 * Daremon B2B — połączenie z bazą danych i pomocnicze funkcje prywatności.
 *
 * PHP 8.0+, wymaga rozszerzenia pdo_mysql (standardowo dostępne na hostingach
 * współdzielonych obsługujących MySQL/MariaDB).
 */

require_once __DIR__ . '/config.php';

/**
 * Zwraca połączenie PDO do bazy `daremon_b2b` (buforowane w ramach requestu).
 */
function getDbConnection(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = daremon_env('DB_HOST', 'localhost');
    $port = daremon_env('DB_PORT', DB_DEFAULT_PORT);
    $user = daremon_env('DB_USER', '');
    $password = daremon_env('DB_PASSWORD', '');
    $dbName = daremon_env('DB_NAME', DB_DEFAULT_NAME);

    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $dbName);

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

/**
 * Adres IP klienta z bieżącego żądania. Celowo NIE czytamy tu nagłówków typu
 * X-Forwarded-For — bez jawnie skonfigurowanej listy zaufanych proxy taki
 * nagłówek można łatwo sfałszować z poziomu klienta.
 */
function clientIp(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/**
 * Jednokierunkowy hash SHA-256 adresu IP — w bazie nigdy nie ląduje adres
 * jawny, tylko ten skrót (wystarczający np. do odróżnienia unikalnych wizyt
 * bez przechowywania danych osobowych w formie jawnej).
 */
function hashIp(string $ip): string
{
    return hash('sha256', 'daremon-ip-salt:' . $ip);
}
