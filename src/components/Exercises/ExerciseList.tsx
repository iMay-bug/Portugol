import React, { useState } from 'react';
import { EXERCISES, Exercise } from '../../data/exercises';
import { CheckCircle2, Circle, ArrowRight, Award, Swords, Sparkles, Sprout, Compass } from 'lucide-react';

interface ExerciseListProps {
  completedExerciseIds: string[];
  onSelectExercise: (exercise: Exercise) => void;
}

type ViewMode = 'all' | 'beta' | 'kata';

export const ExerciseList: React.FC<ExerciseListProps> = ({
  completedExerciseIds,
  onSelectExercise
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedKyu, setSelectedKyu] = useState<string>('todos');

  // Filter based on viewMode and selectedKyu
  const filteredExercises = EXERCISES.filter((ex) => {
    if (viewMode === 'beta' && ex.track !== 'beta') return false;
    if (viewMode === 'kata' && ex.track !== 'kata') return false;

    if (viewMode === 'kata' && selectedKyu !== 'todos') {
      return ex.kyu === Number(selectedKyu);
    }
    return true;
  });

  const betaExercises = EXERCISES.filter((ex) => ex.track === 'beta');
  const kataExercises = EXERCISES.filter((ex) => ex.track === 'kata');

  const completedBetaCount = betaExercises.filter((ex) => completedExerciseIds.includes(ex.id)).length;
  const completedKataCount = kataExercises.filter((ex) => completedExerciseIds.includes(ex.id)).length;

  const totalHonor = EXERCISES.reduce((sum, ex) => {
    return completedExerciseIds.includes(ex.id) ? sum + ex.honor : sum;
  }, 0);

  const maxHonor = EXERCISES.reduce((sum, ex) => sum + ex.honor, 0);

  const getCurrentRank = (honor: number) => {
    if (honor >= 350) return { kyu: 4, title: 'Sensei do Portugol', color: 'border-cyan-400 text-cyan-400 bg-cyan-500/10' };
    if (honor >= 220) return { kyu: 5, title: 'Faixa Roxa (5 Kyu)', color: 'border-amber-400 text-amber-400 bg-amber-500/10' };
    if (honor >= 120) return { kyu: 6, title: 'Faixa Amarela (6 Kyu)', color: 'border-amber-400 text-amber-400 bg-amber-500/10' };
    if (honor >= 50) return { kyu: 7, title: 'Praticante (7 Kyu)', color: 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' };
    return { kyu: 8, title: 'Iniciante (8 Kyu)', color: 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' };
  };

  const userRank = getCurrentRank(totalHonor);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6 transition-colors duration-200">
      {/* Classification Hero Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Beta Track (Super Fácil) Banner */}
        <div
          onClick={() => setViewMode('beta')}
          className={`lg:col-span-6 rounded-2xl p-6 border transition-all cursor-pointer shadow-sm relative overflow-hidden flex flex-col justify-between ${
            viewMode === 'beta'
              ? 'bg-gradient-to-tr from-emerald-900/90 via-teal-950 to-slate-900 border-emerald-500 text-white shadow-emerald-900/20 shadow-lg'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Nível Zero • Bem Fácil
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {completedBetaCount} / {betaExercises.length} Concluídos
              </span>
            </div>

            <h3 className={`text-xl font-bold mb-1 ${viewMode === 'beta' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              Trilha Beta: Comece Aqui!
            </h3>
            <p className={`text-xs leading-relaxed ${viewMode === 'beta' ? 'text-emerald-100/80' : 'text-slate-600 dark:text-slate-400'}`}>
              Passos ultra fáceis ensinando um comando de cada vez: primeiro um "Olá Mundo", depois lendo seu nome, somando números e calculando médias.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400">
              {completedBetaCount === betaExercises.length ? '🎉 Trilha Beta Completa!' : 'Ideal para iniciantes'}
            </span>
            <span className="flex items-center gap-1 font-bold text-emerald-400">
              <span>{viewMode === 'beta' ? 'Exibindo Trilha' : 'Ver Desafios Beta'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Right Card: Codewars Katas Dojo Banner */}
        <div
          onClick={() => setViewMode('kata')}
          className={`lg:col-span-6 rounded-2xl p-6 border transition-all cursor-pointer shadow-sm relative overflow-hidden flex flex-col justify-between ${
            viewMode === 'kata'
              ? 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border-blue-500 text-white shadow-blue-900/20 shadow-lg'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Swords className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Dojo Ranqueado (8 a 4 Kyu)
                </span>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${userRank.color}`}>
                {userRank.kyu} kyu
              </span>
            </div>

            <h3 className={`text-xl font-bold mb-1 ${viewMode === 'kata' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              Dojo de Katas (Estilo Codewars)
            </h3>
            <p className={`text-xs leading-relaxed ${viewMode === 'kata' ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
              Desafios graduais de lógica, strings, laços de repetição, ordenação de vetores e números primos com testes de casos ocultos!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-mono font-bold">
              {totalHonor} Honra (XP) acumulada
            </span>
            <span className="flex items-center gap-1 font-bold text-blue-400">
              <span>{viewMode === 'kata' ? 'Exibindo Katas' : 'Ver Katas Ranqueados'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Mode Filters & Classification Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Classificação:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setViewMode('all'); setSelectedKyu('todos'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Todos ({EXERCISES.length})
            </button>
            <button
              onClick={() => setViewMode('beta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'beta'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Nível Beta Fácil ({betaExercises.length})</span>
            </button>
            <button
              onClick={() => setViewMode('kata')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'kata'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Dojo Katas ({kataExercises.length})</span>
            </button>
          </div>
        </div>

        {/* Kyu filters when on Kata track or All */}
        {viewMode !== 'beta' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium mr-1">Ranks:</span>
            {[
              { id: 'todos', label: 'Todos' },
              { id: '8', label: '8 kyu' },
              { id: '7', label: '7 kyu' },
              { id: '6', label: '6 kyu' },
              { id: '5', label: '5 kyu' },
              { id: '4', label: '4 kyu' }
            ].map((k) => (
              <button
                key={k.id}
                onClick={() => setSelectedKyu(k.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition cursor-pointer ${
                  selectedKyu === k.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exercises / Katas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((ex) => {
          const isDone = completedExerciseIds.includes(ex.id);
          const isBeta = ex.track === 'beta';

          return (
            <div
              key={ex.id}
              onClick={() => onSelectExercise(ex)}
              className={`group bg-white dark:bg-slate-900 border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-xl relative flex flex-col justify-between ${
                isDone
                  ? 'border-emerald-500/50 dark:border-emerald-500/40 hover:border-emerald-500'
                  : isBeta
                  ? 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {isBeta ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Sprout className="w-3 h-3" />
                      <span>{ex.classification}</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                          ex.kyu === 4
                            ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                            : ex.kyu === 5 || ex.kyu === 6
                            ? 'border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {ex.kyu} kyu
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                        +{ex.honor} Honra
                      </span>
                    </div>
                  )}

                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {ex.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-2">
                  {ex.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {ex.description
                    .replace(/###.*?\n/g, '')
                    .replace(/```.*?```/gs, '')
                    .replace(/[*_`]/g, '')
                    .trim()}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  {ex.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        isBeta
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {isDone ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Concluído
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-[11px]">
                      <Circle className="w-3 h-3" />
                      Não iniciado
                    </span>
                  )}
                </div>

                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    isBeta
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white'
                      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
                  }`}
                >
                  <span>{isBeta ? 'Resolver Passo' : 'Treinar Kata'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
