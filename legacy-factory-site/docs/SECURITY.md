# Security Best Practices

## Overview

This document outlines security best practices for the Radio ETS application. Following these guidelines will help protect the application and its users from common security vulnerabilities.

## Form Security

### 1. CSRF Protection

**Current Status:** Forms use client-side validation and local storage (demonstration mode)

**For Production:** When implementing server-side form handling, add CSRF protection:

```javascript
// Example: Add CSRF token to forms
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
fetch('/api/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(formData)
});
```

**In HTML:**
```html
<meta name="csrf-token" content="{{ csrf_token }}">
```

### 2. Input Validation

**Always validate on both client AND server side:**

- Client-side: User experience (immediate feedback)
- Server-side: Security (never trust client input)

**Current Implementation:**
- DJ Message form: 200 character limit
- Comment form: 200 character maxlength
- Survey forms: Specific input types and validation

**Recommendations:**
```javascript
// Sanitize user input before display
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

### 3. XSS Prevention

**Current Protection:**
- Using textContent instead of innerHTML for user input
- Data attributes for i18n translation

**Best Practices:**
```javascript
// GOOD - Safe from XSS
element.textContent = userInput;

// BAD - Vulnerable to XSS
element.innerHTML = userInput;

// If HTML is needed, use DOMPurify
element.innerHTML = DOMPurify.sanitize(userInput);
```

## HTTPS & Transport Security

### Requirements

1. **Always use HTTPS in production**
   - Redirect all HTTP to HTTPS
   - Use HSTS (HTTP Strict Transport Security)

2. **Add Security Headers** (see .htaccess configuration)

```apache
# Force HTTPS
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Prevent XSS
Header set X-XSS-Protection "1; mode=block"

# Prevent clickjacking
Header set X-Frame-Options "SAMEORIGIN"

# Content Security Policy
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'"
```

## Data Protection

### Local Storage & IndexedDB

**Current Usage:**
- User preferences (theme, language)
- Track ratings and reviews
- Survey responses (anonymous)
- Listener count simulation data

**Best Practices:**

1. **Never store sensitive data in localStorage/IndexedDB:**
   - No passwords
   - No authentication tokens
   - No personal identification data

2. **Data Encryption (if needed):**
```javascript
// For sensitive data, use Web Crypto API
async function encryptData(data, key) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: crypto.getRandomValues(new Uint8Array(12)) },
    key,
    dataBuffer
  );
  return encrypted;
}
```

## Service Worker Security

**Current Implementation:**
- Cache-first strategy for app shell
- Stale-while-revalidate for dynamic content

**Security Considerations:**

1. **Validate Service Worker scope:**
```javascript
// Only register SW from same origin
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('/sw.js');
}
```

2. **Cache poisoning prevention:**
   - Use versioned cache names
   - Validate responses before caching
   - Implement cache size limits

## Audio Stream Security

**Current Implementation:**
- Local music files served from `/music/` directory

**Recommendations:**

1. **Prevent hotlinking:**
```apache
# .htaccess
RewriteEngine On
RewriteCond %{HTTP_REFERER} !^https://daremon\.nl [NC]
RewriteCond %{REQUEST_URI} ^/music/.*$ [NC]
RewriteRule .* - [F,L]
```

2. **Rate limiting:**
   - Implement server-side rate limiting for audio requests
   - Prevent abuse and bandwidth theft

## API Security (Future Implementation)

When implementing backend APIs:

### 1. Authentication

```javascript
// Use secure token-based authentication
const token = await generateSecureToken();
localStorage.setItem('auth_token', token); // Only for demo
// In production: use httpOnly cookies
```

### 2. Authorization

```javascript
// Validate user permissions server-side
app.post('/api/poll/vote', authenticate, (req, res) => {
  if (!req.user.canVote(req.body.pollId)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Process vote
});
```

### 3. Rate Limiting

```javascript
// Implement rate limiting for all endpoints
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Dependencies Security

### Regular Updates

**Current Dependencies:**
- GSAP 3.12.2
- Three.js 0.170.0
- Vite 6.3.5

**Maintenance:**

1. **Regular security audits:**
```bash
npm audit
npm audit fix
```

2. **Automated dependency updates:**
   - Use Dependabot or Renovate
   - Review changelogs before updating
   - Test thoroughly after updates

3. **Subresource Integrity (SRI):**
```html
<!-- Use SRI for CDN resources -->
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
  integrity="sha384-..."
  crossorigin="anonymous">
</script>
```

## Content Security Policy (CSP)

**Recommended CSP Header:**

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  media-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

**Note:** The 'unsafe-inline' directives should be removed in production by:
1. Moving inline scripts to external files
2. Using nonce or hash-based CSP for necessary inline scripts

## Security Checklist

- [ ] All forms use CSRF protection (when backend is added)
- [ ] Input validation on client AND server side
- [ ] XSS prevention (textContent vs innerHTML)
- [ ] HTTPS enforced with HSTS
- [ ] Security headers configured (.htaccess)
- [ ] Content Security Policy implemented
- [ ] No sensitive data in localStorage
- [ ] Service Worker properly scoped
- [ ] Dependencies regularly updated
- [ ] Rate limiting on APIs (when implemented)
- [ ] Audio files protected from hotlinking
- [ ] SRI hashes for CDN resources

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** create a public GitHub issue
2. Email security concerns to: [security contact]
3. Include detailed description and reproduction steps
4. Allow reasonable time for fix before disclosure

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Security Headers](https://securityheaders.com/)

---

**Last Updated:** 2025-11-09
**Review Frequency:** Quarterly
