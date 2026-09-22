// API Service for SQLite Backend & LocalStorage Fallback

export interface SavedAlgorithm {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  code: string;
  is_favorite?: number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  honor: number;
  kyu: number;
  completedExercises: string[];
}

export interface DbStats {
  totalAlgorithms: number;
  totalSubmissions: number;
  passedSubmissions: number;
  totalUsers: number;
  dbLocation: string;
}

const API_BASE = 'http://localhost:3001/api';
const LOCAL_STORAGE_ALGOS_KEY = 'portugol_saved_algorithms';
const LOCAL_STORAGE_USER_KEY = 'portugol_user_profile';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'portugol_submissions';

export const api = {
  // Check if SQLite backend is active and reachable
  async checkHealth(): Promise<{ connected: boolean; stats?: DbStats }> {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET', credentials: 'omit' });
      if (res.ok) {
        const data = await res.json();
        return { connected: true, stats: data.stats };
      }
      return { connected: false };
    } catch {
      return { connected: false };
    }
  },

  // Algorithms
  async getAlgorithms(): Promise<SavedAlgorithm[]> {
    try {
      const res = await fetch(`${API_BASE}/algorithms`);
      if (res.ok) {
        const data = await res.json();
        // Also sync to localStorage as offline cache
        localStorage.setItem(LOCAL_STORAGE_ALGOS_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('[API] Falha ao buscar algoritmos do SQLite, usando armazenamento local:', e);
    }

    // Fallback to localStorage
    const saved = localStorage.getItem(LOCAL_STORAGE_ALGOS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  async saveAlgorithm(alg: { id?: string; title: string; description?: string; code: string }): Promise<SavedAlgorithm> {
    try {
      const res = await fetch(`${API_BASE}/algorithms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alg)
      });
      if (res.ok) {
        const data = await res.json();
        // Update local cache
        const localList = await this.getAlgorithms();
        const existingIdx = localList.findIndex((item) => item.id === data.id);
        if (existingIdx >= 0) {
          localList[existingIdx] = data;
        } else {
          localList.unshift(data);
        }
        localStorage.setItem(LOCAL_STORAGE_ALGOS_KEY, JSON.stringify(localList));
        return data;
      }
    } catch (e) {
      console.warn('[API] SQLite offline, salvando localmente:', e);
    }

    // Fallback to localStorage
    const saved = localStorage.getItem(LOCAL_STORAGE_ALGOS_KEY);
    const list: SavedAlgorithm[] = saved ? JSON.parse(saved) : [];
    const newId = alg.id || 'local_alg_' + Date.now();
    const now = new Date().toISOString();
    const newAlg: SavedAlgorithm = {
      id: newId,
      title: alg.title,
      description: alg.description || '',
      code: alg.code,
      is_favorite: 0,
      created_at: now,
      updated_at: now
    };

    const existingIdx = list.findIndex((item) => item.id === newId);
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...newAlg, updated_at: now };
    } else {
      list.unshift(newAlg);
    }
    localStorage.setItem(LOCAL_STORAGE_ALGOS_KEY, JSON.stringify(list));
    return newAlg;
  },

  async updateAlgorithm(id: string, updates: Partial<SavedAlgorithm>): Promise<SavedAlgorithm | null> {
    try {
      const res = await fetch(`${API_BASE}/algorithms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[API] SQLite offline, atualizando localmente:', e);
    }

    // Local fallback
    const saved = localStorage.getItem(LOCAL_STORAGE_ALGOS_KEY);
    const list: SavedAlgorithm[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(LOCAL_STORAGE_ALGOS_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  async deleteAlgorithm(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/algorithms/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        // Also remove from cache
        const saved = localStorage.getItem(LOCAL_STORAGE_ALGOS_KEY);
        if (saved) {
          const list: SavedAlgorithm[] = JSON.parse(saved);
          localStorage.setItem(LOCAL_STORAGE_ALGOS_KEY, JSON.stringify(list.filter((a) => a.id !== id)));
        }
        return true;
      }
    } catch (e) {
      console.warn('[API] SQLite offline, removendo localmente:', e);
    }

    // Local fallback
    const saved = localStorage.getItem(LOCAL_STORAGE_ALGOS_KEY);
    if (saved) {
      const list: SavedAlgorithm[] = JSON.parse(saved);
      localStorage.setItem(LOCAL_STORAGE_ALGOS_KEY, JSON.stringify(list.filter((a) => a.id !== id)));
      return true;
    }
    return false;
  },

  // Progress & Honor Points
  async recordProgress(exerciseId: string, honorReward: number): Promise<UserProfile | null> {
    try {
      const res = await fetch(`${API_BASE}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId, honorReward })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
        return user;
      }
    } catch (e) {
      console.warn('[API] Falha ao registrar progresso no SQLite:', e);
    }

    // Local fallback
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    const user: UserProfile = raw ? JSON.parse(raw) : {
      id: 'default_user',
      username: 'Estudante Portugol',
      honor: 0,
      kyu: 8,
      completedExercises: []
    };

    if (!user.completedExercises.includes(exerciseId)) {
      user.completedExercises.push(exerciseId);
      user.honor += honorReward;
      if (user.honor >= 350) user.kyu = 4;
      else if (user.honor >= 220) user.kyu = 5;
      else if (user.honor >= 120) user.kyu = 6;
      else if (user.honor >= 50) user.kyu = 7;
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    }
    return user;
  },

  // Submissions
  async recordSubmission(sub: {
    exerciseId: string;
    code: string;
    passed: boolean;
    passedTests: number;
    totalTests: number;
    durationMs: number;
  }) {
    try {
      const res = await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[API] Falha ao salvar submissão no SQLite:', e);
    }

    // Local fallback
    const listRaw = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
    const list = listRaw ? JSON.parse(listRaw) : [];
    const submission = {
      id: 'sub_' + Date.now(),
      ...sub,
      created_at: new Date().toISOString()
    };
    list.unshift(submission);
    localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(list.slice(0, 50)));
    return submission;
  },

  async getUser(): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/user`);
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
        return user;
      }
    } catch {
      // Offline
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : {
      id: 'default_user',
      username: 'Estudante Portugol',
      honor: 0,
      kyu: 8,
      completedExercises: []
    };
  }
};
