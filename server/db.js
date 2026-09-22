import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Ensure a default user exists
const defaultUserId = 'default_user';
const defaultUser = db.prepare('SELECT id FROM users WHERE id = ?').get(defaultUserId);
if (!defaultUser) {
  db.prepare(`
    INSERT INTO users (id, username, honor, kyu)
    VALUES (?, ?, ?, ?)
  `).run(defaultUserId, 'Estudante Portugol', 0, 8);
}

// Database Helper Methods
export const dbService = {
  // User operations
  getUser(userId = defaultUserId) {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) return null;

    const progress = db.prepare('SELECT exercise_id, completed_at FROM user_progress WHERE user_id = ?').all(userId);
    return {
      ...user,
      completedExercises: progress.map((p) => p.exercise_id),
      progress
    };
  },

  updateUser(userId = defaultUserId, { username }) {
    if (username) {
      db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username, userId);
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
