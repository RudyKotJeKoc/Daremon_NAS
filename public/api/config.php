<?php
/**
 * Daremon B2B — konfiguracja backendu PHP (baza danych, SMTP, zmienne
 * środowiskowe).
 *
 * Konwencja zmiennych bazy danych: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.
 * Konwencja zmiennych SMTP (patrz mailer.php): SMTP_HOST, SMTP_PORT,
 * SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL, SMTP_FROM_NAME.
 * Domyślnie (bez ustawiania SMTP_HOST/PORT/SECURE) klient łączy się z
 * smtp.transip.email:465 przez SSL — trzeba ustawić tylko SMTP_USER i
 * SMTP_PASSWORD. Wysyłka jest WYŁĄCZNIE przez ten socket SMTP — brak
 * jakiegokolwiek fallbacku na PHP mail().
 * CONTACT_TO_EMAIL (patrz contact.php): adres, na który trafiają powiadomienia
 * o nowych zapytaniach z formularza — niezależny od konta SMTP_USER, którym
 * wiadomość jest faktycznie wysyłana (uwierzytelnione jako info@daremon.nl).
 * Domyślnie (bez ustawionej zmiennej) trafiają na dariusz@daremon.nl.
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
 *   putenv('DB_PORT=3307'); // Synology MariaDB 10 domyślnie nasłuchuje na 3307
 *   putenv('DB_USER=daremon');
 *   putenv('DB_PASSWORD=...');
 *   putenv('DB_NAME=daremon_b2b');
 *
 *   putenv('SMTP_HOST=smtp.transip.email'); // to i 2 linie niżej to i tak wartości domyślne
 *   putenv('SMTP_PORT=465');
 *   putenv('SMTP_SECURE=ssl'); // 'ssl' dla portu 465 (domyślne), 'tls' dla STARTTLS na 587
 *   putenv('SMTP_USER=info@daremon.nl');
 *   putenv('SMTP_PASSWORD=...');
 *   putenv('CONTACT_TO_EMAIL=dariusz@daremon.nl');
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

// Synology DSM: wbudowany pakiet MariaDB 10 nasłuchuje domyślnie na porcie
// 3307 (port 3306 bywa zajęty przez inną instancję/pakiet w DSM) — jeśli Twoja
// instalacja jest inna, nadpisz to zmienną środowiskową DB_PORT.
const DB_DEFAULT_PORT = '3307';
const DB_DEFAULT_NAME = 'daremon_b2b';
