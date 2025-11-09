# Daremon Survey API Documentation

## Overview

This document describes the API contract for the Daremon Survey Backend. The frontend is designed with an **offline-first** approach and can operate without a backend, but integrates seamlessly when an API endpoint is available.

---

## Configuration

### Environment Variables

```javascript
// Set these in your environment or modify API_CONFIG in survey-api.js
API_URL=https://api.daremon.nl  // Base URL for API
ENABLE_BACKEND=true             // Enable/disable backend integration
ENABLE_CSRF=true                // Enable/disable CSRF protection
```

### Feature Flags

```javascript
const API_CONFIG = {
    enableBackend: false,        // Set to true when backend is available
    enableOfflineQueue: true,    // Queue submissions when offline
    enableCsrfProtection: true,  // Require CSRF tokens
};
```

---

## API Endpoints

### Base URL
```
https://api.daremon.nl/api/v1
```

### 1. Health Check

**Endpoint:** `GET /health`

**Description:** Check if the API is available

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-01-09T12:00:00Z"
}
```

---

### 2. Get CSRF Token

**Endpoint:** `GET /csrf-token`

**Description:** Obtain a CSRF token for form submissions

**Headers:**
```
Cookie: sessionId=<session-cookie>
```

**Response:**
```json
{
  "token": "abc123xyz789",
  "expiresAt": "2025-01-09T13:00:00Z"
}
```

---

### 3. Submit Granulate Survey

**Endpoint:** `POST /surveys/granulate`

**Description:** Submit a granulate transport system survey

**Headers:**
```
Content-Type: application/json
X-CSRF-Token: <csrf-token>
X-Client-Version: 1.0.0
```

**Request Body:**
```json
{
  "timestamp": "2025-01-09T12:00:00Z",
  "csrfToken": "abc123xyz789",
  "clientTimestamp": "2025-01-09T12:00:00Z",
  "userAgent": "Mozilla/5.0...",
  "language": "nl",

  // Section 1: General Experience
  "experience": "6-12m",
  "factory": "boxtel",
  "factoryOther": "",
  "role": "operator",
  "roleOther": "",

  // Section 2: System Problems
  "interruptionFrequency": "several-week",
  "systemProblems": ["blockage", "sensor-problems"],
  "systemProblemsOther": "",
  "interruptionDuration": "15-30m",

  // Section 3: Sensors and Automation
  "sensorsFunction": "mostly-yes",
  "systemDiagnosis": "sometimes",
  "alarmResolution": "mostly-yes",

  // Section 4: Logistics and Material Supply
  "supplyContinuity": "good",
  "bufferNeed": "sometimes",
  "deliveryErgonomics": "definitely",

  // Section 5: Training and Support
  "trainingReceived": "yes-short",
  "operationConfidence": "mostly-yes",
  "helpNeeded": ["procedures", "tech-support"],
  "helpNeededOther": "",

  // Section 6: Improvement Suggestions
  "improvements": "Better sensor calibration needed",
  "harmfulBehavior": "sometimes",
  "harmfulBehaviorDetail": "Manual overrides",
  "stressLevel": "sometimes",
  "additionalComments": "Overall good system"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Survey submitted successfully",
  "data": {
    "id": "survey-12345",
    "submittedAt": "2025-01-09T12:00:05Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "experience",
      "message": "Experience is required"
    }
  ]
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Invalid CSRF token"
}
```

---

### 4. Submit Employee Survey

**Endpoint:** `POST /surveys/employee`

**Description:** Submit an employee feedback survey

**Headers:**
```
Content-Type: application/json
X-CSRF-Token: <csrf-token>
X-Client-Version: 1.0.0
```

**Request Body:**
```json
{
  "timestamp": "2025-01-09T12:00:00Z",
  "sessionToken": "1736424000000-abc123",
  "csrfToken": "abc123xyz789",
  "clientTimestamp": "2025-01-09T12:00:00Z",
  "userAgent": "Mozilla/5.0...",
  "language": "nl",

  "name": "Jan Kowalski",  // Optional, defaults to "Anonim"
  "teamContinuation": "yes",
  "daremonFeatures": ["radio", "visualizer", "surveys"],
  "newFeatures": ["playlist-editor", "podcast"],
  "newFeaturesOther": "Spotify integration",
  "helpAreas": ["programming", "testing"],
  "ideas": "Great project, would love to contribute!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Survey submitted successfully",
  "data": {
    "id": "survey-67890",
    "submittedAt": "2025-01-09T12:00:05Z"
  }
}
```

---

## Security

### CSRF Protection

1. **Token Generation:**
   - Client requests CSRF token from `GET /csrf-token`
   - Backend generates token tied to user session
   - Token expires after 1 hour

2. **Token Validation:**
   - All POST requests must include `X-CSRF-Token` header
   - Backend validates token against session
   - Invalid/expired tokens return `403 Forbidden`

3. **Fallback (No Backend):**
   - Client generates session token: `timestamp-random`
   - Token stored in request for logging/debugging

### Rate Limiting

**Recommended limits:**
- 10 requests per minute per IP
- 100 requests per hour per IP
- Return `429 Too Many Requests` when exceeded

### Data Validation

**Backend must validate:**
- Required fields are present
- Enum values match allowed options
- String lengths within limits
- Arrays contain valid items
- CSRF token is valid

---

## Offline Queue

### How it Works

1. **Submission Attempt:**
   - Frontend tries to submit to backend
   - If backend unavailable, adds to offline queue

2. **Queue Storage:**
   - Stored in `localStorage` as `daremon_survey_queue`
   - Maximum 100 items
   - Each item has retry count and status

3. **Auto-Sync:**
   - Triggers when `online` event fires
   - Processes queue with exponential backoff
   - Removes successful submissions
   - Retries failed ones (max 3 attempts)

4. **Queue Item Structure:**
```json
{
  "id": "1736424000000-abc123",
  "data": {
    "endpoint": "/api/v1/surveys/granulate",
    "payload": { /* survey data */ },
    "surveyType": "granulate",
    "timestamp": 1736424000000
  },
  "addedAt": 1736424000000,
  "retries": 0,
  "lastAttempt": null,
  "status": "pending"
}
```

---

## Error Handling

### Network Errors

```javascript
try {
  const result = await submitSurvey('granulate', data);
} catch (error) {
  // Error handled gracefully:
  // 1. Data saved to localStorage
  // 2. Added to offline queue
  // 3. User notified
  console.error('Submission failed:', error);
}
```

### Retry Logic

- **Timeout:** 10 seconds per request
- **Retries:** 3 attempts with exponential backoff
  - Attempt 1: Immediate
  - Attempt 2: +2 seconds
  - Attempt 3: +4 seconds
  - Attempt 4: +8 seconds
- **Total max time:** ~14 seconds

---

## Testing

### Enable Backend Mode

```javascript
import { updateAPIConfig } from './survey-api.js';

updateAPIConfig({
    baseUrl: 'http://localhost:3000',
    enableBackend: true
});
```

### Mock Backend (Node.js)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

// CSRF token
app.get('/api/v1/csrf-token', (req, res) => {
    res.json({ token: 'mock-token-' + Date.now(), expiresAt: new Date(Date.now() + 3600000).toISOString() });
});

// Submit survey
app.post('/api/v1/surveys/:type', (req, res) => {
    console.log('Received survey:', req.params.type, req.body);
    res.json({ success: true, message: 'Survey submitted', data: { id: 'mock-' + Date.now(), submittedAt: new Date().toISOString() } });
});

app.listen(3000, () => console.log('Mock API running on http://localhost:3000'));
```

---

## Database Schema (Recommended)

### Granulate Survey Table

```sql
CREATE TABLE granulate_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    user_agent TEXT,
    language VARCHAR(5),

    -- Section 1
    experience VARCHAR(20),
    factory VARCHAR(50),
    factory_other TEXT,
    role VARCHAR(50),
    role_other TEXT,

    -- Section 2
    interruption_frequency VARCHAR(20),
    system_problems JSONB,
    system_problems_other TEXT,
    interruption_duration VARCHAR(20),

    -- Section 3
    sensors_function VARCHAR(20),
    system_diagnosis VARCHAR(20),
    alarm_resolution VARCHAR(20),

    -- Section 4
    supply_continuity VARCHAR(20),
    buffer_need VARCHAR(20),
    delivery_ergonomics VARCHAR(20),

    -- Section 5
    training_received VARCHAR(20),
    operation_confidence VARCHAR(20),
    help_needed JSONB,
    help_needed_other TEXT,

    -- Section 6
    improvements TEXT,
    harmful_behavior VARCHAR(20),
    harmful_behavior_detail TEXT,
    stress_level VARCHAR(20),
    additional_comments TEXT,

    -- Metadata
    session_token TEXT,
    csrf_token TEXT,
    ip_address INET
);
```

### Employee Survey Table

```sql
CREATE TABLE employee_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    user_agent TEXT,
    language VARCHAR(5),

    name VARCHAR(255),
    team_continuation VARCHAR(20),
    daremon_features JSONB,
    new_features JSONB,
    new_features_other TEXT,
    help_areas JSONB,
    ideas TEXT,

    -- Metadata
    session_token TEXT,
    csrf_token TEXT,
    ip_address INET
);
```

---

## Changelog

### v1.0.0 (2025-01-09)
- Initial API specification
- Granulate survey endpoint
- Employee survey endpoint
- CSRF protection
- Offline queue support

---

## Support

For questions or issues:
- GitHub Issues: [https://github.com/RudyKotJeKoc/Daremon_NAS/issues](https://github.com/RudyKotJeKoc/Daremon_NAS/issues)
- Email: support@daremon.nl
