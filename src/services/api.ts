// API Service for SQLite Backend & LocalStorage Fallback with User Registration & Persistence

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
  email?: string;
  avatar?: string;
  password?: string;
  honor: number;
  kyu: number;
  completedExercises: string[];
  created_at?: string;
}

export interface DbStats {
  totalAlgorithms: number;
  totalSubmissions: number;
  passedSubmissions: number;
  totalUsers: number;
  dbLocation: string;
}

const API_BASE = 'http://localhost:3001/api';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'portugol_current_user';
const LOCAL_STORAGE_REGISTERED_USERS_KEY = 'portugol_registered_users';
const LOCAL_STORAGE_ALGOS_PREFIX = 'portugol_saved_algorithms_';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'portugol_submissions';

export const DEFAULT_GUEST_USER: UserProfile = {
  id: 'default_user',
  username: 'Estudante Portugol',
  avatar: '🧙‍♂️',
  honor: 0,
  kyu: 8,
  completedExercises: []
};

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

  // Synchronous getter for current active user from localStorage
  getCurrentUserSync(): UserProfile {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id) return parsed;
      }
    } catch {}
    return DEFAULT_GUEST_USER;
  },

  // Asynchronous getter for current user, refreshed against server when available
  async getCurrentUser(): Promise<UserProfile> {
    const local = this.getCurrentUserSync();
    try {
      const res = await fetch(`${API_BASE}/user?userId=${encodeURIComponent(local.id)}`);
      if (res.ok) {
        const serverUser = await res.json();
        if (serverUser && serverUser.id) {
          localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(serverUser));
          this.updateLocalUsersList(serverUser);
          return serverUser;
        }
      }
    } catch {
      // Offline fallback
    }
    return local;
  },

  // Register new account
  async register(data: {
    username: string;
    email?: string;
    password?: string;
    avatar?: string;
  }): Promise<UserProfile> {
    const trimmedUsername = data.username.trim();
    if (!trimmedUsername) {
      throw new Error('Nome de usuário é obrigatório.');
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUsername,
          email: data.email?.trim() || '',
          password: data.password || '',
          avatar: data.avatar || '🧙‍♂️'
        })
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Erro ao cadastrar usuário.');
      }

      // Save as current user & add to local registry
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(body));
      this.updateLocalUsersList(body);
      return body;
    } catch (err: any) {
      // If error message came from backend response, rethrow
      if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed')) {
        throw err;
      }

      // Offline fallback for Vercel / offline usage
      const users = this.getLocalUsersList();
      const exists = users.find(
        (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
      );
      if (exists) {
        throw new Error('Nome de usuário já cadastrado. Por favor, escolha outro ou faça login.');
      }

      const newUser: UserProfile = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        username: trimmedUsername,
        email: data.email?.trim() || '',
        avatar: data.avatar || '🧙‍♂️',
        password: data.password || '',
        honor: 0,
        kyu: 8,
        completedExercises: [],
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(LOCAL_STORAGE_REGISTERED_USERS_KEY, JSON.stringify(users));
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(newUser));
      return newUser;
    }
  },

  // Login existing account
  async login(credentials: { username: string; password?: string }): Promise<UserProfile> {
    const trimmedUsername = credentials.username.trim();
    if (!trimmedUsername) {
      throw new Error('Nome de usuário é obrigatório.');
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUsername,
          password: credentials.password || ''
        })
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Falha ao autenticar.');
      }

      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(body));
      this.updateLocalUsersList(body);
      return body;
    } catch (err: any) {
      // If error message is from backend API
      if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed')) {
        throw err;
      }

      // Offline login fallback
      const users = this.getLocalUsersList();
      const user = users.find(
        (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
      );

      if (!user) {
        throw new Error('Usuário não encontrado. Verifique o nome ou crie uma conta.');
      }

      if (user.password && user.password !== credentials.password) {
        throw new Error('Senha incorreta.');
      }

      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
  },

  // Switch to account or guest
  switchUser(user: UserProfile) {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    this.updateLocalUsersList(user);
    return user;
  },

  // Logout (revert to guest)
  logout(): UserProfile {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(DEFAULT_GUEST_USER));
    return DEFAULT_GUEST_USER;
  },

  // Get list of saved/registered users
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) {
        const users = await res.json();
        const merged = this.mergeUsersLists(this.getLocalUsersList(), users);
        localStorage.setItem(LOCAL_STORAGE_REGISTERED_USERS_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch {}

    const localList = this.getLocalUsersList();
    if (localList.length === 0) {
      return [DEFAULT_GUEST_USER];
    }
    return localList;
  },

  // Local user helpers
  getLocalUsersList(): UserProfile[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_REGISTERED_USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [DEFAULT_GUEST_USER];
  },

  updateLocalUsersList(user: UserProfile) {
    const list = this.getLocalUsersList();
    const idx = list.findIndex((u) => u.id === user.id || u.username.toLowerCase() === user.username.toLowerCase());
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...user };
    } else {
      list.push(user);
    }
    localStorage.setItem(LOCAL_STORAGE_REGISTERED_USERS_KEY, JSON.stringify(list));
  },

  mergeUsersLists(localList: UserProfile[], remoteList: UserProfile[]): UserProfile[] {
    const map = new Map<string, UserProfile>();
    for (const u of localList) {
      map.set(u.id, u);
    }
    for (const u of remoteList) {
      const existing = map.get(u.id);
      map.set(u.id, { ...existing, ...u });
    }
    return Array.from(map.values());
  },

  // Algorithm storage keys
  getAlgoStorageKey(userId?: string): string {
    const uid = userId || this.getCurrentUserSync().id || 'default_user';
    return `${LOCAL_STORAGE_ALGOS_PREFIX}${uid}`;
  },

  // Algorithms CRUD
  async getAlgorithms(userId?: string): Promise<SavedAlgorithm[]> {
    const targetUserId = userId || this.getCurrentUserSync().id || 'default_user';
    const storageKey = this.getAlgoStorageKey(targetUserId);

    try {
      const res = await fetch(`${API_BASE}/algorithms?userId=${encodeURIComponent(targetUserId)}`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(storageKey, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('[API] SQLite offline, buscando códigos do armazenamento local:', e);
    }

    // Fallback to localStorage
    const saved = localStorage.getItem(storageKey) || localStorage.getItem('portugol_saved_algorithms');
    return saved ? JSON.parse(saved) : [];
  },

  async saveAlgorithm(alg: {
    id?: string;
    title: string;
    description?: string;
    code: string;
    userId?: string;
  }): Promise<SavedAlgorithm> {
    const targetUserId = alg.userId || this.getCurrentUserSync().id || 'default_user';
    const storageKey = this.getAlgoStorageKey(targetUserId);

    try {
      const res = await fetch(`${API_BASE}/algorithms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...alg, userId: targetUserId })
      });
      if (res.ok) {
        const data = await res.json();
        const localList = await this.getAlgorithms(targetUserId);
        const existingIdx = localList.findIndex((item) => item.id === data.id);
        if (existingIdx >= 0) {
          localList[existingIdx] = data;
        } else {
          localList.unshift(data);
        }
        localStorage.setItem(storageKey, JSON.stringify(localList));
        return data;
      }
    } catch (e) {
      console.warn('[API] SQLite offline, salvando localmente:', e);
    }

    // Fallback to localStorage
    const saved = localStorage.getItem(storageKey);
    const list: SavedAlgorithm[] = saved ? JSON.parse(saved) : [];
    const newId = alg.id || 'alg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();
    const newAlg: SavedAlgorithm = {
      id: newId,
      user_id: targetUserId,
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
    localStorage.setItem(storageKey, JSON.stringify(list));
    return newAlg;
  },

  async updateAlgorithm(id: string, updates: Partial<SavedAlgorithm>, userId?: string): Promise<SavedAlgorithm | null> {
    const targetUserId = userId || this.getCurrentUserSync().id || 'default_user';
    const storageKey = this.getAlgoStorageKey(targetUserId);

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
    const saved = localStorage.getItem(storageKey);
    const list: SavedAlgorithm[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(storageKey, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  async deleteAlgorithm(id: string, userId?: string): Promise<boolean> {
    const targetUserId = userId || this.getCurrentUserSync().id || 'default_user';
    const storageKey = this.getAlgoStorageKey(targetUserId);

    try {
      const res = await fetch(`${API_BASE}/algorithms/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const list: SavedAlgorithm[] = JSON.parse(saved);
          localStorage.setItem(storageKey, JSON.stringify(list.filter((a) => a.id !== id)));
        }
        return true;
      }
    } catch (e) {
      console.warn('[API] SQLite offline, removendo localmente:', e);
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const list: SavedAlgorithm[] = JSON.parse(saved);
      localStorage.setItem(storageKey, JSON.stringify(list.filter((a) => a.id !== id)));
      return true;
    }
    return false;
  },

  // Progress & Honor Points
  async recordProgress(exerciseId: string, honorReward: number, userId?: string): Promise<UserProfile | null> {
    const targetUserId = userId || this.getCurrentUserSync().id || 'default_user';

    try {
      const res = await fetch(`${API_BASE}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId, honorReward, userId: targetUserId })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
        this.updateLocalUsersList(user);
        return user;
      }
    } catch (e) {
      console.warn('[API] Falha ao registrar progresso no SQLite, salvando localmente:', e);
    }

    // Local fallback
    const user: UserProfile = this.getCurrentUserSync();
    if (!user.completedExercises) {
      user.completedExercises = [];
    }

    if (!user.completedExercises.includes(exerciseId)) {
      user.completedExercises.push(exerciseId);
      user.honor = (user.honor || 0) + honorReward;
      if (user.honor >= 350) user.kyu = 4;
      else if (user.honor >= 220) user.kyu = 5;
      else if (user.honor >= 120) user.kyu = 6;
      else if (user.honor >= 50) user.kyu = 7;
      else user.kyu = 8;

      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
      this.updateLocalUsersList(user);
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
    userId?: string;
  }) {
    const targetUserId = sub.userId || this.getCurrentUserSync().id || 'default_user';

    try {
      const res = await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sub, userId: targetUserId })
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
      user_id: targetUserId,
      created_at: new Date().toISOString()
    };
    list.unshift(submission);
    localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(list.slice(0, 50)));
    return submission;
  }
};
