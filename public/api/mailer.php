<?php
/**
 * Minimalny, bezzależnościowy klient SMTP (bez Composera / PHPMailer) do
 * wysyłki powiadomień e-mail przez prawdziwy serwer SMTP.
 *
 * DLACZEGO TO ISTNIEJE:
 * Na Synology (Web Station + PHP-FPM) wbudowana funkcja PHP `mail()` z
 * reguły nie działa w ogóle — w systemie nie ma skonfigurowanego lokalnego
 * MTA/sendmail, więc próba wysyłki kończy się cichym `false` albo błędem
 * w logu typu "sh: sendmail: not found". Co gorsza, `mail()` bywa też
 * bezużyteczna do diagnozy: nawet gdy "zadziała" (zwróci true), wiadomość
 * może nigdy nie dotrzeć (np. odrzucona po drodze przez SPF/DKIM/greylisting),
 * a PHP nie ma żadnego wglądu w to, co się stało po oddaniu jej do lokalnego
 * sendmaila. Dlatego wysyłka odbywa się WYŁĄCZNIE przez ten klient — czysty
 * socket SMTP do prawdziwej skrzynki pocztowej (TransIP), bez żadnego
 * fallbacku na mail(). Każdy krok dialogu SMTP (komenda + dokładna
 * odpowiedź serwera, z kodem) jest rejestrowany w przekazywanej tablicy
 * $transcript, żeby błąd dostarczenia dało się zdiagnozować z samej
 * odpowiedzi JSON, bez grzebania w logach serwera.
 *
 * KONFIGURACJA (zmienne środowiskowe — patrz config.php):
 *   SMTP_HOST        domyślnie "smtp.transip.email"
 *   SMTP_PORT        domyślnie 465 (SSL)
 *   SMTP_SECURE      'ssl' | 'tls' | 'none'        — domyślnie 'ssl'
 *   SMTP_USER        pełny adres skrzynki, np. info@daremon.nl (WYMAGANE)
 *   SMTP_PASSWORD    hasło do tej skrzynki (WYMAGANE)
 *   SMTP_FROM_EMAIL  domyślnie = SMTP_USER
 *   SMTP_FROM_NAME   domyślnie "DAREMON Engineering"
 *   SMTP_EHLO_HOST   domyślnie "daremon.nl"
 *
 * TransIP (domyślna konfiguracja tego klienta odpowiada tym ustawieniom):
 *   Host: smtp.transip.email
 *   Port: 465, SMTP_SECURE=ssl (połączenie od razu szyfrowane, bez STARTTLS)
 *   Użytkownik: pełny adres e-mail (np. info@daremon.nl)
 *   Hasło: hasło do tej skrzynki pocztowej
 * (Zweryfikuj dokładną nazwę hosta w panelu TransIP — bywa też dostarczana
 * jako mail.<twoja-domena>, zależnie od konfiguracji strefy DNS).
 *
 * SMTP_USER i SMTP_PASSWORD nie mają bezpiecznych wartości domyślnych —
 * muszą być ustawione w środowisku produkcyjnym (patrz config.php).
 */

require_once __DIR__ . '/config.php';

class SmtpException extends \RuntimeException
{
}

function smtpConfigured(): bool
{
    return daremon_env('SMTP_USER', '') !== '' && daremon_env('SMTP_PASSWORD', '') !== '';
}

function smtpEncodeHeaderWord(string $value): string
{
    if ($value === '' || preg_match('/^[\x20-\x7E]*$/', $value)) {
        return $value;
    }
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/**
 * Zwraca migawkę konfiguracji SMTP do celów diagnostycznych (pole
 * "smtp_debug" w odpowiedzi contact.php) — NIGDY nie zawiera samego hasła,
 * tylko informację, czy jest ustawione i ile ma znaków.
 *
 * @return array{host: string, port: int, secure: string, user: string, password_set: bool, password_length: int, from_email: string, ehlo_host: string}
 */
function smtpDebugConfig(): array
{
    $user = daremon_env('SMTP_USER', '');
    $password = daremon_env('SMTP_PASSWORD', '');

    return [
        'host' => daremon_env('SMTP_HOST', 'smtp.transip.email'),
        'port' => (int)daremon_env('SMTP_PORT', '465'),
        'secure' => strtolower(daremon_env('SMTP_SECURE', 'ssl')),
        'user' => $user !== '' ? $user : '(NIET INGESTELD — SMTP_USER ontbreekt)',
        'password_set' => $password !== '',
        'password_length' => strlen($password),
        'from_email' => daremon_env('SMTP_FROM_EMAIL', $user),
        'ehlo_host' => daremon_env('SMTP_EHLO_HOST', 'daremon.nl'),
    ];
}

/**
 * Wysyła jeden e-mail HTML przez SMTP (AUTH LOGIN, SSL bezpośredni lub
 * opcjonalny STARTTLS). Cały dialog (komendy + odpowiedzi serwera) jest
 * dopisywany do $transcript w kolejności, w jakiej faktycznie wystąpił —
 * łącznie z ostatnią (błędną) odpowiedzią, gdy wysyłka się nie powiedzie,
 * bo $transcript jest modyfikowany przez referencję i przetrwa wyjątek.
 * Hasło NIGDY nie trafia do $transcript — nawet w postaci base64.
 *
 * @throws SmtpException gdy którykolwiek krok dialogu SMTP się nie powiedzie
 */
function sendViaSmtp(string $toEmail, string $toName, string $subject, string $htmlBody, string $replyTo, array &$transcript): void
{
    $host = daremon_env('SMTP_HOST', 'smtp.transip.email');
    $port = (int)daremon_env('SMTP_PORT', '465');
    $secure = strtolower(daremon_env('SMTP_SECURE', 'ssl')); // ssl | tls | none
    $user = daremon_env('SMTP_USER', '');
    $password = daremon_env('SMTP_PASSWORD', '');
    $fromEmail = daremon_env('SMTP_FROM_EMAIL', $user);
    $fromName = daremon_env('SMTP_FROM_NAME', 'DAREMON Engineering');
    $ehloHost = daremon_env('SMTP_EHLO_HOST', 'daremon.nl');

    if ($host === '' || $user === '' || $password === '') {
        throw new SmtpException('SMTP is niet volledig geconfigureerd (SMTP_HOST/SMTP_USER/SMTP_PASSWORD).');
    }

    $transport = $secure === 'ssl' ? 'ssl://' : 'tcp://';
    $errno = 0;
    $errstr = '';
    $timeout = 15;

    $transcript[] = "# Verbinden met {$transport}{$host}:{$port} (secure={$secure})";

    $socket = @stream_socket_client(
        "{$transport}{$host}:{$port}",
        $errno,
        $errstr,
        $timeout,
        STREAM_CLIENT_CONNECT,
        stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]])
    );

    if (!$socket) {
        $transcript[] = "! Verbinding mislukt: {$errstr} (errno {$errno})";
        throw new SmtpException("Kan geen verbinding maken met SMTP-server {$host}:{$port} — {$errstr} ({$errno})");
    }

    stream_set_timeout($socket, $timeout);

    $readResponse = static function () use ($socket, &$transcript): string {
        $data = '';
        while (($line = fgets($socket, 515)) !== false) {
            $data .= $line;
            // Wieloliniowa odpowiedź SMTP: "250-..." to nie koniec, "250 ..." (spacja) jest ostatnią linią.
            if (strlen($line) < 4 || $line[3] === ' ') {
                break;
            }
        }
        if ($data === '') {
            $transcript[] = 'S: (geen antwoord — timeout of verbroken verbinding)';
            throw new SmtpException('Brak odpowiedzi z serwera SMTP (timeout lub zerwane połączenie).');
        }
        $transcript[] = 'S: ' . trim($data);
        return $data;
    };

    $sendCommand = static function (string $command, ?string $logAs = null) use ($socket, &$transcript): void {
        fwrite($socket, $command . "\r\n");
        $transcript[] = 'C: ' . ($logAs ?? $command);
    };

    $expectCode = static function (string $response, int $expectedCode) {
        $code = (int)substr($response, 0, 3);
        if ($code !== $expectedCode) {
            throw new SmtpException("Onverwacht SMTP-antwoord (verwacht {$expectedCode}): " . trim($response));
        }
    };

    try {
        $expectCode($readResponse(), 220);

        $sendCommand("EHLO {$ehloHost}");
        $expectCode($readResponse(), 250);

        if ($secure === 'tls') {
            $sendCommand('STARTTLS');
            $expectCode($readResponse(), 220);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                $transcript[] = '! STARTTLS-onderhandeling is mislukt.';
                throw new SmtpException('STARTTLS-onderhandeling is mislukt.');
            }
            $transcript[] = '# STARTTLS OK — versleutelde verbinding, EHLO wordt herhaald';
            // Po STARTTLS trzeba powtórzyć EHLO w ramach już zaszyfrowanej sesji.
            $sendCommand("EHLO {$ehloHost}");
            $expectCode($readResponse(), 250);
        }

        $sendCommand('AUTH LOGIN');
        $expectCode($readResponse(), 334);
        // Login (adres e-mail) nie jest tajny — logowany jawnie dla czytelności diagnostyki.
        $sendCommand(base64_encode($user), "{$user} [base64]");
        $expectCode($readResponse(), 334);
        // Hasło NIGDY nie trafia do transcriptu — ani jawnie, ani jako base64.
        $sendCommand(base64_encode($password), '[WACHTWOORD VERBORGEN — ' . strlen($password) . ' tekens]');
        $expectCode($readResponse(), 235);

        $sendCommand("MAIL FROM:<{$fromEmail}>");
        $expectCode($readResponse(), 250);
        $sendCommand("RCPT TO:<{$toEmail}>");
        $expectCode($readResponse(), 250);

        $sendCommand('DATA');
        $expectCode($readResponse(), 354);

        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $headerLines = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            sprintf('From: %s <%s>', smtpEncodeHeaderWord($fromName), $fromEmail),
            sprintf('To: %s <%s>', smtpEncodeHeaderWord($toName), $toEmail),
            "Subject: {$encodedSubject}",
            'Date: ' . date('r'),
            'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . $ehloHost . '>',
        ];
        if ($replyTo !== '') {
            $headerLines[] = "Reply-To: {$replyTo}";
        }

        // Dot-stuffing: samodzielna "." na początku linii kończy DATA w SMTP,
        // więc każdą linię treści zaczynającą się od kropki trzeba podwoić.
        $stuffedBody = preg_replace('/^\./m', '..', $htmlBody);

        $message = implode("\r\n", $headerLines) . "\r\n\r\n" . $stuffedBody . "\r\n.";
        $sendCommand($message, 'DATA: ' . implode(' | ', $headerLines) . ' (+ body, ' . strlen($stuffedBody) . ' tekens)');
        $expectCode($readResponse(), 250);

        $sendCommand('QUIT');
    } finally {
        fclose($socket);
    }
}
