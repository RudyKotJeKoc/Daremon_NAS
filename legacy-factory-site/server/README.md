# Daremon NAS Backend

Secure backend API for Daremon NAS with JWT authentication, httpOnly cookies, and comprehensive security features.

## 🔐 Security Features

- **JWT Authentication** - Cryptographically secure tokens
- **httpOnly Cookies** - Tokens stored in httpOnly cookies (not accessible to JavaScript)
- **Bcrypt Password Hashing** - 12 rounds of hashing
- **Input Validation** - express-validator for all inputs
- **Rate Limiting** - 100 requests per 15 minutes by default
- **CORS Protection** - Whitelist-based origin control
- **Helmet.js** - Security headers
- **Audit Logging** - All authentication and critical actions logged
- **SQL Injection Protection** - Prepared statements only

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (or npm)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:
- `JWT_SECRET` - Random string (min 32 characters)
- `COOKIE_SECRET` - Random string (min 32 characters)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Initialize Database

```bash
pnpm run init-db
```

This will:
- Create database schema
- Prompt you to create an admin user

### 4. Start Server

**Development:**
```bash
pnpm run dev
```

**Production:**
```bash
pnpm start
```

Server runs on `http://localhost:3001` (configurable via `PORT` env var)

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/logout` | Logout user | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | Refresh token required |
| GET | `/api/v1/auth/me` | Get current user | Yes |

### Surveys

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/surveys/employee` | Submit employee survey | Optional |
| GET | `/api/v1/surveys/employee/results` | Get employee survey results | Yes (admin/manager) |
| POST | `/api/v1/surveys/granulate` | Submit granulate survey | Optional |
| GET | `/api/v1/surveys/granulate/results` | Get granulate survey results | Yes (admin/manager) |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/health` | Health check | No |

## 🍪 Authentication Flow

### Registration

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123"
  }'
```

**Response sets two httpOnly cookies:**
- `access_token` - Valid for 1 hour
- `refresh_token` - Valid for 7 days

### Authenticated Requests

```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -b cookies.txt
```

### Token Refresh

```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### Logout

```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -b cookies.txt
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1
)
```

### Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

### Employee Surveys Table

```sql
CREATE TABLE employee_surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    session_token TEXT,
    name TEXT NOT NULL,
    team_continuation TEXT NOT NULL,
    daremon_features TEXT,
    new_features TEXT,
    new_features_other TEXT,
    help_areas TEXT,
    ideas TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
)
```

### Audit Log Table

```sql
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    resource TEXT,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
)
```

## 🔒 Security Best Practices

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Token Expiration

- **Access Token**: 1 hour (short-lived)
- **Refresh Token**: 7 days (long-lived)

### Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable via environment variables

### CORS

Only specified origins in `ALLOWED_ORIGINS` can access the API.

## 📊 Monitoring & Logs

### Audit Logging

All critical actions are logged to the `audit_log` table:
- User registration
- Login attempts (success & failure)
- Logout
- Unauthorized access attempts
- Survey submissions

### Error Logging

Errors are logged to console with:
- Timestamp
- Path
- Method
- Error message
- Stack trace (development only)

## 🧪 Development

### Database Location

Development: `./database/daremon.db`

### Viewing Database

```bash
# Install sqlite3 cli
sudo apt install sqlite3

# Open database
sqlite3 ./database/daremon.db

# List tables
.tables

# View users
SELECT * FROM users;

# View audit log
SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 10;
```

### Resetting Database

```bash
rm -rf ./database
pnpm run init-db
```

## 🚀 Production Deployment

### 1. Set Environment Variables

```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=<STRONG_RANDOM_SECRET>
COOKIE_SECRET=<STRONG_RANDOM_SECRET>
ALLOWED_ORIGINS=https://daremon.nl
```

### 2. Use Process Manager

```bash
# Using PM2
npm install -g pm2
pm2 start src/index.js --name daremon-api
pm2 save
pm2 startup
```

### 3. Reverse Proxy (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name api.daremon.nl;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Database Backup

```bash
# Backup
sqlite3 ./database/daremon.db ".backup ./backups/daremon-$(date +%Y%m%d).db"

# Restore
cp ./backups/daremon-20250114.db ./database/daremon.db
```

## 🔧 Troubleshooting

### "Invalid token" error

- Token expired - use `/api/v1/auth/refresh` to get new token
- Token malformed - re-login

### CORS errors

- Check `ALLOWED_ORIGINS` in `.env`
- Ensure frontend origin is whitelisted

### Database locked

- Close other connections to database
- Check file permissions on `./database/`

## 📝 License

ISC

## 👥 Support

For issues or questions, contact the Daremon development team.
