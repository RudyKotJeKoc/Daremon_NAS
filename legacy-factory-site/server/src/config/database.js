/**
 * Database Configuration
 * Using SQLite for simplicity - can be easily switched to PostgreSQL in production
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database/daremon.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize database schema
 */
export function initializeDatabase() {
    // Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
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
    `);

    // Refresh tokens table
    db.exec(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Employee surveys table
    db.exec(`
        CREATE TABLE IF NOT EXISTS employee_surveys (
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
    `);

    // Granulate surveys table
    db.exec(`
        CREATE TABLE IF NOT EXISTS granulate_surveys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            session_token TEXT,
            experience TEXT,
            factory TEXT,
            factory_other TEXT,
            role TEXT,
            role_other TEXT,
            interruption_frequency TEXT,
            system_problems TEXT,
            system_problems_other TEXT,
            interruption_duration TEXT,
            sensors_function TEXT,
            system_diagnosis TEXT,
            alarm_resolution TEXT,
            supply_continuity TEXT,
            buffer_need TEXT,
            delivery_ergonomics TEXT,
            training_received TEXT,
            operation_confidence TEXT,
            help_needed TEXT,
            help_needed_other TEXT,
            improvements TEXT,
            harmful_behavior TEXT,
            harmful_behavior_detail TEXT,
            stress_level TEXT,
            additional_comments TEXT,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
    `);

    // Audit log table (security requirement)
    db.exec(`
        CREATE TABLE IF NOT EXISTS audit_log (
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
    `);

    // Create indexes for performance
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
        CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
        CREATE INDEX IF NOT EXISTS idx_employee_surveys_user_id ON employee_surveys(user_id);
        CREATE INDEX IF NOT EXISTS idx_granulate_surveys_user_id ON granulate_surveys(user_id);
        CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
        CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
    `);

    console.log('✅ Database initialized successfully');
}

/**
 * Get database instance
 */
export function getDatabase() {
    return db;
}

/**
 * Close database connection
 */
export function closeDatabase() {
    db.close();
}

export default db;
