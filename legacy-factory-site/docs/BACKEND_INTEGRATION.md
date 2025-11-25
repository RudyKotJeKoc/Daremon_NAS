# Backend Integration Guide

## Quick Start

### Currently: Offline-First Mode (No Backend Required)

The application works **out of the box** without any backend. All survey data is stored in `localStorage`.

### Enable Backend Integration

When you're ready to add a backend:

1. **Set Configuration:**
```javascript
// In survey-api.js, update:
const API_CONFIG = {
    baseUrl: 'https://your-api-domain.com',
    enableBackend: true,  // Set to true
    enableOfflineQueue: true,
    enableCsrfProtection: true,
};
```

2. **Or use environment variables:**
```bash
API_URL=https://api.daremon.nl
ENABLE_BACKEND=true
```

---

## Features

### ✅ Offline-First Architecture
- Works without backend
- Data saved to localStorage
- Automatic sync when backend becomes available

### ✅ Automatic Retry Logic
- 3 retry attempts with exponential backoff
- Timeout: 10 seconds per request
- Graceful degradation

### ✅ Offline Queue
- Submissions queued when offline
- Auto-sync when network returns
- Maximum 100 items in queue
- Retry failed items up to 3 times

### ✅ CSRF Protection
- Tokens from backend or client-generated
- Sent in `X-CSRF-Token` header
- Validation on backend (when available)

### ✅ User Feedback
- Clear status messages (success/warning/error)
- Different colors for different states
- Auto-dismiss after 5 seconds

---

## Architecture

```
┌─────────────┐
│   Frontend  │
│  (Browser)  │
└──────┬──────┘
       │
       ├─── localStorage (always)
       │
       └─── API Request (if enabled)
              │
              ├─ Success → Backend Database
              │
              └─ Failure → Offline Queue
                           │
                           └─ Auto-retry when online
```

---

## File Structure

```
/
├── survey-api.js          # Main API module
├── offline-queue.js       # Queue management
├── granulate-survey.js    # Granulate survey (updated)
├── employee-survey.js     # Employee survey (updated)
└── docs/
    ├── API_DOCUMENTATION.md      # Full API spec
    └── BACKEND_INTEGRATION.md    # This file
```

---

## Testing

### Test Offline Mode (Default)
```javascript
// No changes needed - works out of the box
```

### Test with Mock Backend

1. **Start mock server:**
```bash
cd /path/to/project
node mock-api-server.js  # See API_DOCUMENTATION.md
```

2. **Enable backend:**
```javascript
import { updateAPIConfig } from './survey-api.js';

updateAPIConfig({
    baseUrl: 'http://localhost:3000',
    enableBackend: true
});
```

3. **Submit a survey and check console:**
```
✅ Survey submitted to backend successfully
```

### Test Offline Queue

1. **Enable backend but make it unreachable:**
```javascript
updateAPIConfig({
    baseUrl: 'http://invalid-domain.com',
    enableBackend: true
});
```

2. **Submit survey:**
```
⚠️ Backend submission failed, adding to offline queue
✅ Survey queued for sync when online
```

3. **Fix backend and trigger sync:**
```javascript
import { processOfflineQueue } from './survey-api.js';

updateAPIConfig({ baseUrl: 'http://localhost:3000' });
await processOfflineQueue();
```

---

## Console Commands (Debug)

### Check API Configuration
```javascript
import { getAPIConfig } from './survey-api.js';
console.log(getAPIConfig());
```

### Check Backend Health
```javascript
import { checkBackendHealth } from './survey-api.js';
const health = await checkBackendHealth();
console.log(health);
// { available: true/false, reason: "..." }
```

### Process Offline Queue
```javascript
import { processOfflineQueue } from './survey-api.js';
const result = await processOfflineQueue();
console.log(result);
// { processed: 5, failed: 0, total: 5 }
```

### View Queue Stats
```javascript
import { OfflineQueue } from './offline-queue.js';
const queue = new OfflineQueue('daremon_survey_queue');
console.log(queue.getStats());
// { total: 10, pending: 8, retry: 1, failed: 1, ... }
```

### Clear Failed Items
```javascript
const queue = new OfflineQueue('daremon_survey_queue');
queue.removeFailedItems();
```

---

## Production Deployment

### Checklist

- [ ] Set correct `baseUrl` in `survey-api.js`
- [ ] Enable backend: `enableBackend: true`
- [ ] Implement backend API (see API_DOCUMENTATION.md)
- [ ] Set up database (see schema in docs)
- [ ] Configure CORS headers
- [ ] Implement rate limiting
- [ ] Set up SSL/TLS (HTTPS)
- [ ] Test CSRF protection
- [ ] Monitor error logs
- [ ] Set up analytics/monitoring

### Recommended Stack

**Backend:**
- Node.js + Express
- PostgreSQL database
- Redis for session management
- Nginx reverse proxy

**Or Serverless:**
- Vercel/Netlify Functions
- Supabase/Firebase
- Cloudflare Workers

---

## Troubleshooting

### "Failed to fetch" errors
```javascript
// Check CORS headers on backend:
Access-Control-Allow-Origin: https://daremon.nl
Access-Control-Allow-Headers: Content-Type, X-CSRF-Token
Access-Control-Allow-Credentials: true
```

### Queue not processing
```javascript
// Check network status
console.log(navigator.onLine); // true/false

// Manually trigger
import { processOfflineQueue } from './survey-api.js';
await processOfflineQueue();
```

### CSRF token errors
```javascript
// Disable CSRF for testing
updateAPIConfig({ enableCsrfProtection: false });

// Or check token generation
import { getCsrfToken } from './survey-api.js';
const token = await getCsrfToken();
console.log(token);
```

---

## Migration Path

### Phase 1: Current (Offline-Only)
- ✅ Frontend works standalone
- ✅ Data in localStorage
- ✅ No backend needed

### Phase 2: Backend Integration
- [ ] Deploy backend API
- [ ] Update `API_CONFIG`
- [ ] Test with real API
- [ ] Monitor errors

### Phase 3: Full Sync
- [ ] Enable `enableBackend: true` in production
- [ ] Process existing localStorage data
- [ ] Migrate to backend database
- [ ] Keep localStorage as backup

---

## Support

**Documentation:**
- API Specification: `docs/API_DOCUMENTATION.md`
- Performance Guide: `docs/PERFORMANCE.md`
- Security Guide: `docs/SECURITY.md`

**Code:**
- Survey API: `survey-api.js`
- Offline Queue: `offline-queue.js`
- Type Definitions: Check JSDoc comments

**Help:**
- GitHub Issues: https://github.com/RudyKotJeKoc/Daremon_NAS/issues
- Pull Requests: Contributions welcome!

---

**Last Updated:** 2025-01-09
**Version:** 1.0.0
