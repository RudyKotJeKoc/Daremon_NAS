<?php
/**
 * Minimalny, bezzależnościowy klient SMTP (bez Composera / PHPMailer) do
 * wysyłki powiadomień e-mail przez prawdziwy serwer SMTP.
 *
 * DLACZEGO TO ISTNIEJE:
 * Na Synology (Web Station + PHP-FPM) wbudowana funkcja PHP `mail()` z
 * reguły nie działa w ogóle — w systemie nie ma skonfigurowanego lokalnego
 * MTA/sendmail, więc próba wysyłki kończy się cichym `false` albo błędem
 * w logu typu "sh: sendmail: not found". Prawdziwy serwer SMTP (np. skrzynka
 * pocztowa TransIP) omija ten problem całkowicie, bo łączy się bezpośrednio
 * po sieci, a nie przez lokalny binarny sendmail.
 *
 * KONFIGURACJA (zmienne środowiskowe — patrz config.php):
 *   SMTP_HOST        np. smtp.transip.email
 *   SMTP_PORT        465 (SSL) lub 587 (STARTTLS) — domyślnie 587
 *   SMTP_SECURE      'ssl' | 'tls' | 'none'        — domyślnie 'tls'
 *   SMTP_USER        pełny adres skrzynki, np. info@daremon.nl
 *   SMTP_PASSWORD    hasło do tej skrzynki
 *   SMTP_FROM_EMAIL  domyślnie = SMTP_USER
 *   SMTP_FROM_NAME   domyślnie "DAREMON Engineering"
 *   SMTP_EHLO_HOST   domyślnie "daremon.nl"
 *
 * TransIP (typowe ustawienia dla skrzynek pocztowych TransIP Mail):
 *   Host: smtp.transip.email
 *   Port: 465 z SMTP_SECURE=ssl, ALBO port 587 z SMTP_SECURE=tls (STARTTLS)
 *   Użytkownik: pełny adres e-mail (np. info@daremon.nl)
 *   Hasło: hasło do tej skrzynki pocztowej
 * (Zweryfikuj dokładną nazwę hosta w panelu TransIP — bywa też
 * dostarczana jako mail.<twoja-domena>, zależnie od konfiguracji strefy DNS).
 *
 * Jeśli SMTP_HOST nie jest ustawiony, smtpConfigured() zwraca false —
 * wywołujący (contact.php) spada wtedy z powrotem na mail().
 */

require_once __DIR__ . '/config.php';

class SmtpException extends \RuntimeException
{
}

function smtpConfigured(): bool
{
    return daremon_env('SMTP_HOST', '') !== '';
}

function smtpEncodeHeaderWord(string $value): string
{
    if ($value === '' || preg_match('/^[\x20-\x7E]*$/', $value)) {
        return $value;
    }
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/**
 * Wysyła jeden e-mail HTML przez SMTP (AUTH LOGIN, opcjonalny STARTTLS/SSL).
 *
 * @throws SmtpException gdy którykolwiek krok dialogu SMTP się nie powiedzie
 */
function sendViaSmtp(string $toEmail, string $toName, string $subject, string $htmlBody, string $replyTo = ''): void
{
    $host = daremon_env('SMTP_HOST', '');
    $port = (int)daremon_env('SMTP_PORT', '587');
    $secure = strtolower(daremon_env('SMTP_SECURE', 'tls')); // ssl | tls | none
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

    $socket = @stream_socket_client(
        "{$transport}{$host}:{$port}",
        $errno,
        $errstr,
        $timeout,
        STREAM_CLIENT_CONNECT,
        stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]])
    );

    if (!$socket) {
        throw new SmtpException("Kan geen verbinding maken met SMTP-server {$host}:{$port} — {$errstr} ({$errno})");
    }

    stream_set_timeout($socket, $timeout);

    $readResponse = static function () use ($socket): string {
        $data = '';
        while (($line = fgets($socket, 515)) !== false) {
            $data .= $line;
            // Wieloliniowa odpowiedź SMTP: "250-..." to nie koniec, "250 ..." (spacja) jest ostatnią linią.
            if (strlen($line) < 4 || $line[3] === ' ') {
                break;
            }
        }
        if ($data === '') {
            throw new SmtpException('Brak odpowiedzi z serwera SMTP (timeout lub zerwane połączenie).');
        }
        return $data;
    };

    $sendCommand = static function (string $command) use ($socket): void {
        fwrite($socket, $command . "\r\n");
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
                throw new SmtpException('STARTTLS-onderhandeling is mislukt.');
            }
            // Po STARTTLS trzeba powtórzyć EHLO w ramach już zaszyfrowanej sesji.
            $sendCommand("EHLO {$ehloHost}");
            $expectCode($readResponse(), 250);
        }

        $sendCommand('AUTH LOGIN');
        $expectCode($readResponse(), 334);
        $sendCommand(base64_encode($user));
        $expectCode($readResponse(), 334);
        $sendCommand(base64_encode($password));
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
        $sendCommand($message);
        $expectCode($readResponse(), 250);

        $sendCommand('QUIT');
    } finally {
        fclose($socket);
    }
}
