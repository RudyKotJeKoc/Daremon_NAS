<?php
/**
 * Daremon B2B — konfiguracja backendu PHP (baza danych, SMTP, zmienne
 * środowiskowe).
 *
 * Konwencja zmiennych bazy danych: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.
 * Konwencja zmiennych SMTP (patrz mailer.php): SMTP_HOST, SMTP_PORT,
 * SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL, SMTP_FROM_NAME.
 *
 * Na produkcji (Synology Web Station) ustaw je przez panel hostingu (sekcja
 * zmiennych środowiskowych PHP) albo w .htaccess przez `SetEnv DB_HOST ...`
 * — nigdy nie commituj rzeczywistych danych dostępowych do repozytorium.
 *
 * Lokalnie (dev) możesz utworzyć plik public/api/.env.local.php (jest w
 * .gitignore) z zawartością np.:
 *
 *   <?php
 *   putenv('DB_HOST=127.0.0.1');
 *   putenv('DB_PORT=3306');
 *   putenv('DB_USER=daremon');
 *   putenv('DB_PASSWORD=...');
 *   putenv('DB_NAME=daremon_b2b');
 *
 *   putenv('SMTP_HOST=smtp.transip.email');
 *   putenv('SMTP_PORT=587');
 *   putenv('SMTP_SECURE=tls'); // 'ssl' dla portu 465, 'tls' dla STARTTLS na 587
 *   putenv('SMTP_USER=info@daremon.nl');
 *   putenv('SMTP_PASSWORD=...');
 */

$localEnvFile = __DIR__ . '/.env.local.php';
if (file_exists($localEnvFile)) {
    require $localEnvFile;
}

if (!function_exists('daremon_env')) {
    function daremon_env(string $key, ?string $default = null): ?string
    {
        $value = getenv($key);
        if ($value === false || $value === '') {
            $value = $_ENV[$key] ?? $_SERVER[$key] ?? null;
        }
        return ($value !== null && $value !== '') ? (string)$value : $default;
    }
}

const DB_DEFAULT_PORT = '3306';
const DB_DEFAULT_NAME = 'daremon_b2b';
