/**
 * Database Initialization Script
 * Creates database schema and default admin user
 */

import bcrypt from 'bcrypt';
import readline from 'readline';
import { initializeDatabase, getDatabase } from '../config/database.js';

const db = getDatabase();
const BCRYPT_ROUNDS = 12;

// Initialize database schema
console.log('🔧 Initializing database schema...');
initializeDatabase();

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createAdminUser() {
    console.log('\n👤 Creating admin user...\n');

    try {
        // Check if admin exists
        const existingAdmin = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');

        if (existingAdmin) {
            console.log('✅ Admin user already exists (ID: ' + existingAdmin.id + ')');
            const recreate = await question('Do you want to create another admin? (y/n): ');

            if (recreate.toLowerCase() !== 'y') {
                console.log('Skipping admin creation.');
                rl.close();
                return;
            }
        }

        // Get admin details
        const username = await question('Admin username (min 3 chars): ');
        const email = await question('Admin email: ');

        // Get password securely
        let password;
        let confirmPassword;

        do {
            password = await question('Admin password (min 8 chars, 1 uppercase, 1 lowercase, 1 number): ');
            confirmPassword = await question('Confirm password: ');

            if (password !== confirmPassword) {
                console.log('❌ Passwords do not match. Try again.\n');
            }
        } while (password !== confirmPassword);

        // Validate inputs
        if (username.length < 3) {
            throw new Error('Username must be at least 3 characters');
        }

        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
            throw new Error('Password must contain at least one uppercase, lowercase, and number');
        }

        // Hash password
        console.log('\n🔐 Hashing password...');
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // Create admin user
        const result = db.prepare(`
            INSERT INTO users (username, email, password_hash, role, is_active)
            VALUES (?, ?, ?, ?, ?)
        `).run(username, email, passwordHash, 'admin', 1);

        console.log('\n✅ Admin user created successfully!');
        console.log(`   ID: ${result.lastInsertRowid}`);
        console.log(`   Username: ${username}`);
        console.log(`   Email: ${email}`);
        console.log(`   Role: admin\n`);

        // Log admin creation
        db.prepare(`
            INSERT INTO audit_log (user_id, action, resource, status, details)
            VALUES (?, ?, ?, ?, ?)
        `).run(result.lastInsertRowid, 'ADMIN_CREATED', '/scripts/init', 'success', 'Initial admin user created');

    } catch (error) {
        console.error('\n❌ Error creating admin user:', error.message);
    } finally {
        rl.close();
    }
}

// Run admin creation
createAdminUser().then(() => {
    console.log('🎉 Database initialization complete!\n');
    process.exit(0);
}).catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
