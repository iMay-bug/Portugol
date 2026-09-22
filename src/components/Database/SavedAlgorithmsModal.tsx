import React, { useState, useEffect } from 'react';
import {
  Database,
  Save,
  Trash2,
  FolderOpen,
  Star,
  Search,
  Plus,
  FileCode,
  Check,
  X,
  Clock,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { api, SavedAlgorithm, DbStats } from '../../services/api';

interface SavedAlgorithmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCode: string;
  onLoadAlgorithm: (code: string, title?: string) => void;
  isDbConnected: boolean;
  dbStats?: DbStats;
}

export const SavedAlgorithmsModal: React.FC<SavedAlgorithmsModalProps> = ({
  isOpen,
  onClose,
  currentCode,
  onLoadAlgorithm,
  isDbConnected,
  dbStats
}) => {
  const [activeView, setActiveView] = useState<'list' | 'save'>('list');
  const [algorithms, setAlgorithms] = useState<SavedAlgorithm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Extract algorithm name from current code if present
  useEffect(() => {
    if (isOpen) {
      loadAlgorithms();
      const match = currentCode.match(/algoritmo\s+"([^"]+)"/i);
      if (match && match[1]) {
        setTitle(match[1]);
      } else {
        setTitle('Meu Algoritmo');
      }
      setDescription('');
      setSuccessMessage(null);
    }
  }, [isOpen, currentCode]);

  const loadAlgorithms = async () => {
    setIsLoading(true);
    try {
      const list = await api.getAlgorithms();
      setAlgorithms(list);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await api.saveAlgorithm({
        title: title.trim(),
        description: description.trim(),
        code: currentCode
      });
      setSuccessMessage('Algoritmo salvo no Banco de Dados SQLite com sucesso!');
      await loadAlgorithms();
      setTimeout(() => {
        setSuccessMessage(null);
        setActiveView('list');
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o algoritmo "${name}" do banco de dados?`)) {
      await api.deleteAlgorithm(id);
      await loadAlgorithms();
    }
  };

  const handleToggleFavorite = async (alg: SavedAlgorithm) => {
    const newFav = alg.is_favorite ? 0 : 1;
    await api.updateAlgorithm(alg.id, { is_favorite: newFav });
    await loadAlgorithms();
  };

  const handleLoad = (alg: SavedAlgorithm) => {
    onLoadAlgorithm(alg.code, alg.title);
    onClose();
  };

  const filteredAlgorithms = algorithms.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] transition-colors duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Banco de Dados Portugol
                </h3>
                {isDbConnected ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SQLite Ativo
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Modo Local
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isDbConnected
                  ? `Persistência em arquivo SQLite (${dbStats?.totalAlgorithms || algorithms.length} algoritmos armazenados)`
                  : 'Backend desconectado. Operando com armazenamento local seguro.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={() => setActiveView('list')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeView === 'list'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Meus Códigos Salvos ({algorithms.length})</span>
          </button>
          <button
            onClick={() => setActiveView('save')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeView === 'save'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Salvar Algoritmo Atual</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeView === 'list' ? (
            <div className="space-y-4">
              {/* Search and refresh toolbar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por título ou descrição..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <button
                  onClick={loadAlgorithms}
                  disabled={isLoading}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  title="Recarregar do banco"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setActiveView('save')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Salvar Novo</span>
                </button>
              </div>

              {/* Algorithms list */}
              {filteredAlgorithms.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <FileCode className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nenhum algoritmo salvo ainda
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                    Clique na aba &quot;Salvar Algoritmo Atual&quot; para guardar o código em execução no banco SQLite.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredAlgorithms.map((alg) => (
                    <div
                      key={alg.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl hover:border-blue-500/50 transition group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                            {alg.title}
                          </h4>
                          <button
                            onClick={() => handleToggleFavorite(alg)}
                            className={`p-1 rounded transition cursor-pointer ${
                              alg.is_favorite
                                ? 'text-amber-500'
                                : 'text-slate-400 hover:text-amber-400'
                            }`}
                            title={alg.is_favorite ? 'Desfavoritar' : 'Favoritar'}
                          >
                            <Star className={`w-3.5 h-3.5 ${alg.is_favorite ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        {alg.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                            {alg.description}
                          </p>
                        )}
                        <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>
                            {alg.updated_at
                              ? new Date(alg.updated_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Sem data'}
                          </span>
                          <span>•</span>
                          <span>{alg.code.split('\n').length} linhas</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                        <button
                          onClick={() => handleDelete(alg.id, alg.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                          title="Excluir do Banco de Dados"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleLoad(alg)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Abrir no Editor</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Título do Algoritmo *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: CalculoDeFatorial"
                  className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Descrição ou Anotação (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Exercício de repetição para cálculo de fatorial com laço para..faca"
                  className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Prévia do Código ({currentCode.split('\n').length} linhas)
                </label>
                <pre className="p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-xl max-h-36 overflow-y-auto border border-slate-800 leading-relaxed">
                  {currentCode}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    Destino: {isDbConnected ? 'SQLite (server/data/portugol.db)' : 'LocalStorage (Navegador)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveView('list')}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !title.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isLoading ? 'Salvando...' : 'Salvar no Banco'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
