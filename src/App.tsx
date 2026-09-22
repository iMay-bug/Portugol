import React, { useState, useRef, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { CodeEditor } from './components/Editor/CodeEditor';
import { TerminalConsole } from './components/Console/TerminalConsole';
import { MemoryTable } from './components/MemoryTable/MemoryTable';
import { DocViewer } from './components/Docs/DocViewer';
import { ExerciseList } from './components/Exercises/ExerciseList';
import { ExerciseDetail } from './components/Exercises/ExerciseDetail';
import { CheatSheet } from './components/CheatSheet/CheatSheet';
import { VisualGRunner } from './engine/runner';
import { VariableInfo } from './engine/types';
import { EXERCISES, Exercise } from './data/exercises';
import { api, DbStats, UserProfile, DEFAULT_GUEST_USER } from './services/api';
import { SavedAlgorithmsModal } from './components/Database/SavedAlgorithmsModal';
import { AuthModal } from './components/Auth/AuthModal';
import { Code2, Terminal, Database } from 'lucide-react';

const DEFAULT_CODE = `algoritmo "CalculoMedia"
// Disciplina  : Lógica de Programação
// Professor   : VisualG 3.0 Web
// Descrição   : Programa para cálculo da média semestral
var
   aluno: caractere
   nota1, nota2, media: real
inicio
   escreva("Digite o nome do estudante: ")
   leia(aluno)

   escreva("Digite a primeira nota: ")
   leia(nota1)

   escreva("Digite a segunda nota: ")
   leia(nota2)

   media <- (nota1 + nota2) / 2

   escreval("-----------------------------------------")
   escreval("Estudante: ", aluno)
   escreval("Média Semestral: ", media:5:2)

   se media >= 7.0 entao
      escreval("Situação: APROVADO(A)! Parabéns!")
   senao
      se media >= 5.0 entao
         escreval("Situação: EM RECUPERAÇÃO.")
      senao
         escreval("Situação: REPROVADO(A).")
      fimse
   fimse
   escreval("-----------------------------------------")
fimalgoritmo`;

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('playground');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('visualg_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem('visualg_user_code') || DEFAULT_CODE;
  });

  // Runner state
  const runnerRef = useRef<VisualGRunner>(new VisualGRunner());
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isWaitingInput, setIsWaitingInput] = useState<boolean>(false);
  const [waitingVarName, setWaitingVarName] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [memory, setMemory] = useState<Record<string, VariableInfo>>({});
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [currentLine, setCurrentLine] = useState<number | undefined>(undefined);

  // Exercises state
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('visualg_completed_exercises');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  // Database & Profile state
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [dbStats, setDbStats] = useState<DbStats | undefined>(undefined);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => api.getCurrentUserSync());
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [savedModalView, setSavedModalView] = useState<'list' | 'save'>('list');
  const [playgroundMobileTab, setPlaygroundMobileTab] = useState<'editor' | 'console' | 'memory'>('editor');

  // Check SQLite health & user profile
  useEffect(() => {
    let isMounted = true;
    const fetchDbStatus = async () => {
      const health = await api.checkHealth();
      if (!isMounted) return;
      setIsDbConnected(health.connected);
      if (health.stats) {
        setDbStats(health.stats);
      }
      const user = await api.getCurrentUser();
      if (!isMounted) return;
      setUserProfile(user);
      if (user && user.completedExercises && user.completedExercises.length > 0) {
        setCompletedExerciseIds((prev) => {
          const merged = Array.from(new Set([...prev, ...user.completedExercises]));
          localStorage.setItem('visualg_completed_exercises', JSON.stringify(merged));
          return merged;
        });
      }
    };

    fetchDbStatus();
    const interval = setInterval(fetchDbStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleUserChanged = (user: UserProfile) => {
    setUserProfile(user);
    const exIds = user.completedExercises || [];
    setCompletedExerciseIds(exIds);
    localStorage.setItem('visualg_completed_exercises', JSON.stringify(exIds));
  };

  // Synchronize HTML element class with current theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('visualg_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Persist user code
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    localStorage.setItem('visualg_user_code', newCode);
  };

  // Run code handler
  const handleRunCode = async () => {
    if (isRunning) return;

    setErrorMessage(undefined);
    setCurrentLine(undefined);
    setLogs([
      `[SISTEMA] Iniciando execução do algoritmo...`,
      `[SISTEMA] Ambiente: VisualG 3.0 Web Interpreter`
    ]);
    setIsRunning(true);
    if (window.innerWidth < 1024) {
      setPlaygroundMobileTab('console');
    }

    const startTime = performance.now();

    await runnerRef.current.execute(code, {
      onOutput: (text, isNewLine) => {
        setLogs((prev) => {
          if (prev.length === 0) {
            return isNewLine ? [text] : [text];
          }
          const lastIdx = prev.length - 1;
          const updated = [...prev];
          updated[lastIdx] = updated[lastIdx] + text;
          if (isNewLine) {
            updated.push('');
          }
          return updated;
        });
      },
      onInput: async (varName) => {
        setIsWaitingInput(true);
        setWaitingVarName(varName || '');
        return '';
      },
      onMemoryUpdate: (mem) => {
        setMemory({ ...mem });
      },
      onError: (err, line) => {
        setErrorMessage(err);
        if (line) setCurrentLine(line);
        setLogs((prev) => [...prev, `[ERRO] ${err}`]);
      },
      onClearScreen: () => {
        setLogs([]);
      },
      onStep: (line) => {
        setCurrentLine(line);
      }
    });

    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    setLogs((prev) => [
      ...prev,
      `[SISTEMA] Fim da execução. (Tempo: ${elapsed}s)`
    ]);
    setIsRunning(false);
    setIsWaitingInput(false);
    setWaitingVarName('');
  };

  const handleStopCode = () => {
    runnerRef.current.stop();
    setIsRunning(false);
    setIsWaitingInput(false);
    setLogs((prev) => [...prev, `[SISTEMA] Execução interrompida pelo usuário.`]);
  };

  const handleSendInput = (val: string) => {
    setLogs((prev) => [...prev, `> ${val}`]);
    setIsWaitingInput(false);
    runnerRef.current.provideInput(val);
  };

  const handleClearConsole = () => {
    setLogs([]);
    setErrorMessage(undefined);
  };

  const handleLoadExampleInPlayground = (exampleCode: string) => {
    setCode(exampleCode);
    localStorage.setItem('visualg_user_code', exampleCode);
    setActiveTab('playground');
  };

  const handleCompleteExercise = async (id: string) => {
    if (!completedExerciseIds.includes(id)) {
      const updated = [...completedExerciseIds, id];
      setCompletedExerciseIds(updated);
      localStorage.setItem('visualg_completed_exercises', JSON.stringify(updated));
    }
    const currentEx = EXERCISES.find((e) => e.id === id);
    const reward = currentEx?.honor || 10;
    const updatedUser = await api.recordProgress(id, reward, userProfile?.id);
    if (updatedUser) {
      setUserProfile(updatedUser);
    }
  };

  const handleOpenSavedModal = (view: 'list' | 'save' = 'list') => {
    setSavedModalView(view);
    setIsSavedModalOpen(true);
  };

  const handleLoadSavedAlgorithm = (loadedCode: string) => {
    setCode(loadedCode);
    localStorage.setItem('visualg_user_code', loadedCode);
    setActiveTab('playground');
  };

  // Keyboard shortcut listener for F9 globally
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault();
        if (activeTab === 'playground' && !isRunning) {
          handleRunCode();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeTab, isRunning, code]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'exercises') {
            setActiveExercise(null);
          }
        }}
        completedExercisesCount={completedExerciseIds.length}
        totalExercisesCount={EXERCISES.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isDbConnected={isDbConnected}
        onOpenDatabase={() => handleOpenSavedModal('list')}
        userHonor={userProfile?.honor || 0}
        userKyu={userProfile?.kyu || 8}
        currentUser={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main App Content Body - with pb-20 on mobile for bottom dock clearance */}
      <main className="flex-1 flex flex-col pb-20 md:pb-6">
        {/* TAB 1: PLAYGROUND & IDE */}
        {activeTab === 'playground' && (
          <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:px-8">
            {/* Mobile View Switcher for Playground */}
            <div className="lg:hidden flex items-center bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl mb-3 border border-slate-300 dark:border-slate-800 shadow-xs">
              <button
                onClick={() => setPlaygroundMobileTab('editor')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  playgroundMobileTab === 'editor'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setPlaygroundMobileTab('console')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer relative ${
                  playgroundMobileTab === 'console'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console</span>
                {isRunning && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
                {isWaitingInput && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
                {errorMessage && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
              <button
                onClick={() => setPlaygroundMobileTab('memory')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  playgroundMobileTab === 'memory'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Memória</span>
                {Object.keys(memory).length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold">
                    {Object.keys(memory).length}
                  </span>
                )}
              </button>
            </div>

            {/* Playground Grid: Full Side-by-Side on Desktop, Tabbed on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px] lg:min-h-[680px]">
              {/* Left Column: Code Editor */}
              <div className={`lg:col-span-7 h-full min-h-[480px] ${playgroundMobileTab !== 'editor' ? 'hidden lg:block' : 'block'}`}>
                <CodeEditor
                  code={code}
                  onChange={handleCodeChange}
                  onRun={handleRunCode}
                  onStop={handleStopCode}
                  isRunning={isRunning}
                  highlightLine={currentLine}
                  onOpenSavedModal={handleOpenSavedModal}
                />
              </div>

              {/* Right Column: Console & Memory Table */}
              <div className={`lg:col-span-5 flex flex-col gap-5 h-full ${playgroundMobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
                {/* Console Output */}
                <div className={`flex-1 min-h-[360px] ${playgroundMobileTab === 'memory' ? 'hidden lg:block' : 'block'}`}>
                  <TerminalConsole
                    logs={logs}
                    isWaitingInput={isWaitingInput}
                    waitingVarName={waitingVarName}
                    onSendInput={handleSendInput}
                    onClear={handleClearConsole}
                    errorMessage={errorMessage}
                  />
                </div>

                {/* VisualG Variable Watcher (Área das Variáveis) */}
                <div className={`h-72 lg:h-64 flex-shrink-0 ${playgroundMobileTab === 'console' ? 'hidden lg:block' : 'block'}`}>
                  <MemoryTable memory={memory} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCUMENTATION */}
        {activeTab === 'docs' && (
          <DocViewer onLoadExampleInPlayground={handleLoadExampleInPlayground} />
        )}

        {/* TAB 3: EXERCISES */}
        {activeTab === 'exercises' && (
          activeExercise ? (
            <ExerciseDetail
              exercise={activeExercise}
              onBack={() => setActiveExercise(null)}
              onComplete={handleCompleteExercise}
              isCompleted={completedExerciseIds.includes(activeExercise.id)}
              onNextExercise={() => {
                const currentIdx = EXERCISES.findIndex((e) => e.id === activeExercise.id);
                if (currentIdx < EXERCISES.length - 1) {
                  setActiveExercise(EXERCISES[currentIdx + 1]);
                }
              }}
            />
          ) : (
            <ExerciseList
              completedExerciseIds={completedExerciseIds}
              onSelectExercise={(ex) => setActiveExercise(ex)}
            />
          )
        )}

        {/* TAB 4: CHEATSHEET */}
        {activeTab === 'cheatsheet' && <CheatSheet />}
      </main>

      {/* SQLite Database Saved Algorithms Modal */}
      <SavedAlgorithmsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        currentCode={code}
        onLoadAlgorithm={handleLoadSavedAlgorithm}
        isDbConnected={isDbConnected}
        dbStats={dbStats}
        currentUser={userProfile}
      />

      {/* Account / Registration & Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={userProfile || DEFAULT_GUEST_USER}
        onUserChanged={handleUserChanged}
      />
    </div>
  );
}

export default App;
