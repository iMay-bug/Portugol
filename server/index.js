import express from 'express';
import cors from 'cors';
import { dbService } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    const stats = dbService.getStats();
    res.json({
      status: 'ok',
      database: 'connected',
      type: 'SQLite 3',
      stats
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Nome de usuário é obrigatório.' });
    }
    if (!password || password.trim().length < 3) {
      return res.status(400).json({ error: 'A senha deve conter no mínimo 3 caracteres para a segurança da sua conta.' });
    }
    const user = dbService.registerUser({
      username: username.trim(),
      email: email || '',
      password: password,
      avatar: avatar || '🧙‍♂️'
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Nome de usuário é obrigatório.' });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ error: 'Informe a senha da sua conta para acessar.' });
    }
    const user = dbService.loginUser({
      username: username.trim(),
      password: password
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/users', (req, res) => {
  try {
    const users = dbService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User routes
app.get('/api/user', (req, res) => {
  try {
    const userId = req.query.userId ? String(req.query.userId) : undefined;
    const user = dbService.getUser(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/user', (req, res) => {
  try {
    const { username, avatar, userId } = req.body;
    const user = dbService.updateUser(userId || undefined, { username, avatar });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Algorithms CRUD routes
app.get('/api/algorithms', (req, res) => {
  try {
    const userId = req.query.userId ? String(req.query.userId) : undefined;
    const algorithms = dbService.getAlgorithms(userId);
    res.json(algorithms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/algorithms/:id', (req, res) => {
  try {
    const algorithm = dbService.getAlgorithmById(req.params.id);
    if (!algorithm) {
      return res.status(404).json({ error: 'Algoritmo não encontrado.' });
    }
    res.json(algorithm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/algorithms', (req, res) => {
  try {
    const { id, title, description, code, userId } = req.body;
    if (!title || !code) {
      return res.status(400).json({ error: 'Título e código são obrigatórios.' });
    }
    const algId = id || 'alg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const saved = dbService.saveAlgorithm({
      id: algId,
      userId: userId || undefined,
      title,
      description: description || '',
      code
    });
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/algorithms/:id', (req, res) => {
  try {
    const { title, description, code, is_favorite } = req.body;
    const updated = dbService.updateAlgorithm(req.params.id, {
      title,
      description,
      code,
      is_favorite
    });
    if (!updated) {
      return res.status(404).json({ error: 'Algoritmo não encontrado.' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/algorithms/:id', (req, res) => {
  try {
    const success = dbService.deleteAlgorithm(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Algoritmo não encontrado.' });
    }
    res.json({ success: true, message: 'Algoritmo excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise progress & submissions
app.post('/api/progress', (req, res) => {
  try {
    const { exerciseId, honorReward, userId } = req.body;
    if (!exerciseId) {
      return res.status(400).json({ error: 'exerciseId é obrigatório.' });
    }
    const updatedUser = dbService.markExerciseCompleted(userId || undefined, exerciseId, Number(honorReward) || 0);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/submissions', (req, res) => {
  try {
    const { exerciseId, code, passed, passedTests, totalTests, durationMs, userId } = req.body;
    const subId = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const submission = dbService.recordSubmission({
      id: subId,
      userId: userId || undefined,
      exerciseId,
      code,
      passed,
      passedTests: Number(passedTests) || 0,
      totalTests: Number(totalTests) || 0,
      durationMs: Number(durationMs) || 0
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/submissions', (req, res) => {
  try {
    const exerciseId = req.query.exerciseId ? String(req.query.exerciseId) : null;
    const list = dbService.getSubmissions(undefined, exerciseId);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// General statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = dbService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Banco de Dados SQLite & Servidor API] Rodando em http://localhost:${PORT}`);
});
