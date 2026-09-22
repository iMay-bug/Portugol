import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security: Password Hashing Helper
const PASSWORD_SALT = 'portugol_salt_sec_2026';
export function hashPassword(plainPassword) {
  if (!plainPassword) return '';
  return crypto.createHash('sha256').update(plainPassword + PASSWORD_SALT).digest('hex');
}

// Ensure data directory exists
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'portugol.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance & concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    honor INTEGER DEFAULT 0,
    kyu INTEGER DEFAULT 8,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS algorithms (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    code TEXT NOT NULL,
    is_favorite INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    user_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, exercise_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    code TEXT NOT NULL,
    passed INTEGER DEFAULT 0,
    passed_tests INTEGER DEFAULT 0,
    total_tests INTEGER DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );
`);

// Migration: ensure password, email, avatar columns exist
try {
  db.exec(`ALTER TABLE users ADD COLUMN password TEXT;`);
} catch (e) {}
try {
  db.exec(`ALTER TABLE users ADD COLUMN email TEXT;`);
} catch (e) {}
try {
  db.exec(`ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT '🧙‍♂️';`);
} catch (e) {}

// Ensure a default user exists
const defaultUserId = 'default_user';
const defaultUser = db.prepare('SELECT id FROM users WHERE id = ?').get(defaultUserId);
if (!defaultUser) {
  db.prepare(`
    INSERT INTO users (id, username, email, password, avatar, honor, kyu)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(defaultUserId, 'Estudante Portugol', '', '', '🧙‍♂️', 0, 8);
}

// Database Helper Methods
export const dbService = {
  // User operations
  getUser(userId = defaultUserId) {
    // Security: Do NOT select password from users
    const user = db.prepare(`
      SELECT id, username, email, avatar, honor, kyu, created_at 
      FROM users WHERE id = ?
    `).get(userId);
    if (!user) return null;

    const progress = db.prepare('SELECT exercise_id, completed_at FROM user_progress WHERE user_id = ?').all(userId);
    return {
      ...user,
      completedExercises: progress.map((p) => p.exercise_id),
      progress
    };
  },

  // Internal: Get credentials for authentication only
  _getUserCredentials(username) {
    return db.prepare('SELECT id, username, password FROM users WHERE LOWER(username) = LOWER(?)').get(username);
  },

  getUserByUsername(username) {
    // Safe lookup without password
    return db.prepare(`
      SELECT id, username, avatar, honor, kyu, created_at 
      FROM users WHERE LOWER(username) = LOWER(?)
    `).get(username);
  },

  registerUser({ username, email = '', password = '', avatar = '🧙‍♂️' }) {
    const trimmedUsername = username ? username.trim() : '';
    if (!trimmedUsername) {
      throw new Error('Nome de usuário é obrigatório.');
    }
    if (!password || password.trim().length < 3) {
      throw new Error('A senha deve ter no mínimo 3 caracteres para proteger sua conta.');
    }

    const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(trimmedUsername);
    if (existing) {
      throw new Error('Nome de usuário já cadastrado. Escolha outro nome.');
    }

    const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const hashedPassword = hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, username, email, password, avatar, honor, kyu)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, trimmedUsername, email ? email.trim() : '', hashedPassword, avatar, 0, 8);

    return this.getUser(id);
  },

  loginUser({ username, password = '' }) {
    const trimmedUsername = username ? username.trim() : '';
    if (!trimmedUsername) {
      throw new Error('Informe o nome de usuário.');
    }
    if (!password || !password.trim()) {
      throw new Error('Informe a senha da conta.');
    }

    const creds = this._getUserCredentials(trimmedUsername);
    if (!creds) {
      throw new Error('Usuário não encontrado. Verifique o nome ou cadastre-se.');
    }

    const hashedInput = hashPassword(password);
    // Allow matching hashed or legacy plaintext password
    const isMatch = creds.password === hashedInput || creds.password === password;
    if (!isMatch) {
      throw new Error('Senha incorreta! Não é permitido acessar contas de outros jogadores sem autorização.');
    }

    // If password was stored as legacy plaintext, automatically upgrade to hashed
    if (creds.password === password && creds.password !== hashedInput) {
      try {
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedInput, creds.id);
      } catch {}
    }

    return this.getUser(creds.id);
  },

  // Public Dojo Leaderboard (Read-Only) - Never exposes passwords or emails
  getAllUsers() {
    return db.prepare(`
      SELECT id, username, avatar, honor, kyu, created_at 
      FROM users 
      WHERE id != 'default_user'
      ORDER BY honor DESC, kyu ASC, created_at ASC
    `).all();
  },

  updateUser(userId = defaultUserId, { username, avatar }) {
    if (username) {
      db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username, userId);
    }
    if (avatar) {
      db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatar, userId);
    }
    return this.getUser(userId);
  },

  // Algorithm CRUD
  getAlgorithms(userId = defaultUserId) {
    return db.prepare(`
      SELECT * FROM algorithms
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `).all(userId);
  },

  getAlgorithmById(id) {
    return db.prepare('SELECT * FROM algorithms WHERE id = ?').get(id);
  },

  saveAlgorithm({ id, userId = defaultUserId, title, description = '', code }) {
    const existing = db.prepare('SELECT id FROM algorithms WHERE id = ?').get(id);
    const now = new Date().toISOString();

    if (existing) {
      db.prepare(`
        UPDATE algorithms
        SET title = ?, description = ?, code = ?, updated_at = ?
        WHERE id = ?
      `).run(title, description, code, now, id);
      return this.getAlgorithmById(id);
    } else {
      db.prepare(`
        INSERT INTO algorithms (id, user_id, title, description, code, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, userId, title, description, code, now, now);
      return this.getAlgorithmById(id);
    }
  },

  updateAlgorithm(id, { title, description, code, is_favorite }) {
    const now = new Date().toISOString();
    const current = this.getAlgorithmById(id);
    if (!current) return null;

    const newTitle = title !== undefined ? title : current.title;
    const newDesc = description !== undefined ? description : current.description;
    const newCode = code !== undefined ? code : current.code;
    const newFav = is_favorite !== undefined ? (is_favorite ? 1 : 0) : current.is_favorite;

    db.prepare(`
      UPDATE algorithms
      SET title = ?, description = ?, code = ?, is_favorite = ?, updated_at = ?
      WHERE id = ?
    `).run(newTitle, newDesc, newCode, newFav, now, id);

    return this.getAlgorithmById(id);
  },

  deleteAlgorithm(id) {
    const res = db.prepare('DELETE FROM algorithms WHERE id = ?').run(id);
    return res.changes > 0;
  },

  // Exercise Progress and Submissions
  markExerciseCompleted(userId = defaultUserId, exerciseId, honorReward = 0) {
    const existing = db.prepare('SELECT * FROM user_progress WHERE user_id = ? AND exercise_id = ?').get(userId, exerciseId);

    if (!existing) {
      db.prepare(`
        INSERT INTO user_progress (user_id, exercise_id)
        VALUES (?, ?)
      `).run(userId, exerciseId);

      // Add honor points
      if (honorReward > 0) {
        db.prepare(`
          UPDATE users
          SET honor = honor + ?
          WHERE id = ?
        `).run(honorReward, userId);

        // Check for rank promotion
        const user = db.prepare('SELECT honor FROM users WHERE id = ?').get(userId);
        const honor = user.honor;
        let newKyu = 8;
        if (honor >= 350) newKyu = 4;
        else if (honor >= 220) newKyu = 5;
        else if (honor >= 120) newKyu = 6;
        else if (honor >= 50) newKyu = 7;

        db.prepare('UPDATE users SET kyu = ? WHERE id = ?').run(newKyu, userId);
      }
    }

    return this.getUser(userId);
  },

  recordSubmission({ id, userId = defaultUserId, exerciseId, code, passed, passedTests, totalTests, durationMs }) {
    db.prepare(`
      INSERT INTO submissions (id, user_id, exercise_id, code, passed, passed_tests, total_tests, duration_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, exerciseId, code, passed ? 1 : 0, passedTests, totalTests, durationMs);

    return db.prepare('SELECT * FROM submissions WHERE id = ?').get(id);
  },

  getSubmissions(userId = defaultUserId, exerciseId = null) {
    if (exerciseId) {
      return db.prepare(`
        SELECT * FROM submissions
        WHERE user_id = ? AND exercise_id = ?
        ORDER BY created_at DESC
        LIMIT 20
      `).all(userId, exerciseId);
    }
    return db.prepare(`
      SELECT * FROM submissions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).all(userId);
  },

  // Global statistics
  getStats() {
    const totalAlgorithms = db.prepare('SELECT COUNT(*) as count FROM algorithms').get().count;
    const totalSubmissions = db.prepare('SELECT COUNT(*) as count FROM submissions').get().count;
    const passedSubmissions = db.prepare('SELECT COUNT(*) as count FROM submissions WHERE passed = 1').get().count;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

    return {
      totalAlgorithms,
      totalSubmissions,
      passedSubmissions,
      totalUsers,
      dbLocation: dbPath
    };
  }
};

export default dbService;
