import React from 'react';
import { BookOpen, Code2, Trophy, Zap, Terminal, Sun, Moon, Database, Sparkles } from 'lucide-react';

export type TabType = 'docs' | 'playground' | 'exercises' | 'cheatsheet';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  completedExercisesCount: number;
  totalExercisesCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isDbConnected?: boolean;
  onOpenDatabase?: () => void;
  userHonor?: number;
  userKyu?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  completedExercisesCount,
  totalExercisesCount,
  theme,
  onToggleTheme,
  isDbConnected = false,
  onOpenDatabase,
  userHonor = 0,
  userKyu = 8
}) => {
  const tabs = [
    {
      id: 'playground' as TabType,
      label: 'Playground / Editor',
      icon: Terminal,
      badge: 'F9'
    },
    {
      id: 'docs' as TabType,
      label: 'Documentação',
      icon: BookOpen,
      badge: '8 Módulos'
    },
    {
      id: 'exercises' as TabType,
      label: 'Exercícios Práticos',
      icon: Trophy,
      badge: `${completedExercisesCount}/${totalExercisesCount}`
    },
    {
      id: 'cheatsheet' as TabType,
      label: 'Guia Rápido',
      icon: Zap,
      badge: 'VisualG'
    }
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 text-slate-800 dark:text-white shadow-sm dark:shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('playground')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  Portugol VisualG
                </span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  3.0 Web
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Ambiente Interativo de Estudo & Lógica de Programação
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                  {tab.id === 'exercises' && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-blue-800 text-blue-100'
                          : 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {tab.id === 'playground' && (
                    <span className="text-[10px] hidden lg:inline px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-mono">
                      F9
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Database Status, Kyu/XP & Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Kyu & Honor Badge */}
            <div
              onClick={() => setActiveTab('exercises')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs cursor-pointer hover:border-amber-500/50 transition"
              title="Graduação no Dojo de Exercícios"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{userKyu} kyu</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">{userHonor} XP</span>
            </div>

            {/* Database Connection Pill */}
            {onOpenDatabase && (
              <button
                onClick={onOpenDatabase}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer shadow-sm ${
                  isDbConnected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                }`}
                title={
                  isDbConnected
                    ? 'Banco de Dados SQLite Conectado (Clique para gerenciar códigos)'
                    : 'Modo Local Offline (Clique para gerenciar códigos)'
                }
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <Database className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isDbConnected ? 'SQLite' : 'Modo Local'}
                </span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition shadow-sm cursor-pointer"
              title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium hidden sm:inline">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-medium hidden sm:inline">Escuro</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
