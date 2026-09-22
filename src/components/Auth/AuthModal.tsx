import React, { useState, useEffect } from 'react';
import {
  User,
  UserPlus,
  LogIn,
  LogOut,
  Key,
  Mail,
  Check,
  X,
  Sparkles,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  Trophy,
  ShieldCheck
} from 'lucide-react';
import { api, UserProfile, DEFAULT_GUEST_USER } from '../../services/api';

const AVATAR_OPTIONS = [
  '🧙‍♂️', '🥋', '🚀', '🐱', '💻', '🦊', '⚡', '🌟', '🎯', '👾', '🦁', '🐼'
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChanged: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'accounts'>('register');
  const [savedUsers, setSavedUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('🧙‍♂️');

  const isGuest = currentUser.id === DEFAULT_GUEST_USER.id;

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(null);
      loadSavedUsers();
      if (isGuest) {
        setTab('register');
      } else {
        setTab('accounts');
      }
    }
  }, [isOpen, currentUser.id]);

  const loadSavedUsers = async () => {
    try {
      const list = await api.getAllUsers();
      setSavedUsers(list);
    } catch {
      setSavedUsers(api.getLocalUsersList());
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor, informe seu nome de usuário.');
      return;
    }
    if (!password || password.trim().length < 3) {
      setError('A senha deve ter no mínimo 3 caracteres para proteger sua conta.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const user = await api.register({
        username: username.trim(),
        email: email.trim(),
        password: password,
        avatar: selectedAvatar
      });
      setSuccess(`Bem-vindo(a), ${user.username}! Conta cadastrada e protegida por senha.`);
      onUserChanged(user);
      await loadSavedUsers();
      setPassword('');
      setTimeout(() => {
        onClose();
      }, 1300);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Informe seu nome de usuário para entrar.');
      return;
    }
    if (!password || !password.trim()) {
      setError('Informe a senha da conta para acessar.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const user = await api.login({
        username: username.trim(),
        password: password
      });
      setSuccess(`Olá novamente, ${user.username}! Acesso autorizado.`);
      onUserChanged(user);
      await loadSavedUsers();
      setPassword('');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Erro ao efetuar login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const guest = api.logout();
    onUserChanged(guest);
    setSuccess('Desconectado. Você agora está no modo visitante.');
    setPassword('');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-xl shadow-md shadow-blue-500/20">
              {currentUser.avatar || '🧙‍♂️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Conta & Progresso
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {currentUser.kyu} Kyu
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isGuest ? 'Modo Visitante (Crie sua conta para salvar)' : currentUser.username}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 p-1 gap-1">
          <button
            onClick={() => {
              setTab('register');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar</span>
          </button>
          <button
            onClick={() => {
              setTab('login');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar</span>
          </button>
          <button
            onClick={() => {
              setTab('accounts');
              setError(null);
              setSuccess(null);
              loadSavedUsers();
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
              tab === 'accounts'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Meu Perfil</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Notifications */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm animate-fadeIn">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* TAB 1: REGISTRATION */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Escolha seu Avatar:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`text-2xl h-11 flex items-center justify-center rounded-xl border transition cursor-pointer ${
                        selectedAvatar === av
                          ? 'border-blue-500 bg-blue-500/10 scale-105 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome de Usuário / Apelido <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: DevJunior, MariaSilva"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail <span className="text-slate-400 font-normal">(Opcional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Senha da Conta <span className="text-rose-500 font-bold">* (Mínimo 3 caracteres)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={3}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma senha de acesso"
                    className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Sua conta é protegida com criptografia e impede acessos não autorizados.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Cadastrando...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Cadastrar e Proteger Perfil</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                Seu progresso de Katas, Kyu, XP e algoritmos criados serão salvos com sua conta.
              </p>
            </form>
          )}

          {/* TAB 2: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome de Usuário <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Seu nome cadastrado"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Senha <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha de acesso"
                    className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Entrando...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Entrar no Perfil</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Ainda não tem conta? </span>
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Cadastre-se agora
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PERFIL ATIVO & RANKING PÚBLICO (SOMENTE LEITURA) */}
          {tab === 'accounts' && (
            <div className="space-y-4">
              {/* Current User Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/60 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    {currentUser.avatar || '🧙‍♂️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {currentUser.username}
                      </span>
                      {isGuest ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                          Visitante
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Conectado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-amber-600 dark:text-amber-400 font-semibold">
                        <Sparkles className="w-3 h-3" /> {currentUser.kyu} Kyu
                      </span>
                      <span>•</span>
                      <span>{currentUser.honor || 0} XP</span>
                      <span>•</span>
                      <span>{currentUser.completedExercises?.length || 0} Katas</span>
                    </div>
                  </div>
                </div>

                {!isGuest ? (
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    title="Desconectar da conta"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setTab('register')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Criar Conta</span>
                  </button>
                )}
              </div>

              {/* Security Shield Notice */}
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                    Proteção de Contas Ativa:
                  </strong>{' '}
                  Nenhum jogador pode acessar a conta de outro sem a senha correta. Para entrar em outra conta, utilize a aba{' '}
                  <button
                    onClick={() => {
                      setTab('login');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    Entrar
                  </button>{' '}
                  informando a senha.
                </div>
              </div>

              {/* Dojo Leaderboard (Read-Only Public Ranking) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ranking do Dojo (Placar de Alunos)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {savedUsers.filter((u) => u.id !== 'default_user').length} Alunos
                  </span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {savedUsers
                    .filter((u) => u.id !== 'default_user')
                    .sort((a, b) => (b.honor || 0) - (a.honor || 0))
                    .map((user, index) => {
                      const isMe = user.id === currentUser.id;
                      const rank = index + 1;
                      const badgeBg =
                        rank === 1
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          : rank === 2
                          ? 'bg-slate-300/20 text-slate-400 border-slate-400/30'
                          : rank === 3
                          ? 'bg-amber-700/10 text-amber-700 dark:text-amber-600 border-amber-700/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700';

                      return (
                        <div
                          key={user.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                            isMe
                              ? 'border-blue-500/40 bg-blue-500/5'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Rank Position */}
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold border ${badgeBg}`}
                            >
                              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                            </div>

                            <span className="text-xl">{user.avatar || '🧙‍♂️'}</span>

                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {user.username}
                                </span>
                                {isMe && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500 text-white">
                                    Você
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                {user.kyu} Kyu • {user.completedExercises?.length || 0} Katas
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                              {user.honor || 0} XP
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {savedUsers.filter((u) => u.id !== 'default_user').length === 0 && (
                    <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      <Trophy className="w-6 h-6 text-slate-400 mx-auto mb-1 opacity-50" />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Nenhum jogador cadastrado no ranking ainda.
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Crie sua conta para figurar no topo do placar!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Sincronização com SQLite & Offline Storage</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
