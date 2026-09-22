import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Exercise } from '../../data/exercises';
import { VisualGRunner } from '../../engine/runner';
import {
  Play,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Terminal as TerminalIcon,
  Swords,
  ShieldCheck,
  Check
} from 'lucide-react';
import { HighlightedCodeEditor } from '../Editor/HighlightedCodeEditor';
import { VisualGCodeView } from '../Editor/VisualGCodeView';
import { ExerciseInstructionView } from './ExerciseInstructionView';
import { api } from '../../services/api';

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack: () => void;
  onComplete: (id: string) => void;
  isCompleted: boolean;
  onNextExercise?: () => void;
}

interface TestResult {
  label: string;
  passed: boolean;
  input: string[];
  expected: string[];
  actual: string;
  isSecret?: boolean;
  error?: string;
  durationMs: number;
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = ({
  exercise,
  onBack,
  onComplete,
  isCompleted,
  onNextExercise
}) => {
  const storageKey = `visualg_exercise_code_${exercise.id}`;
  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem(storageKey) || exercise.starterCode;
  });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [testMode, setTestMode] = useState<'sample' | 'attempt'>('sample');
  const [allPassed, setAllPassed] = useState<boolean>(isCompleted);
  const [mobileTab, setMobileTab] = useState<'instructions' | 'code'>('instructions');

  // Sync when exercise changes
  useEffect(() => {
    const saved = localStorage.getItem(`visualg_exercise_code_${exercise.id}`);
    setCode(saved || exercise.starterCode);
    setShowHint(false);
    setHintIndex(0);
    setShowSolution(false);
    setTestResults(null);
    setAllPassed(isCompleted);
  }, [exercise.id, isCompleted]);

  // Save code to localStorage on change
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    localStorage.setItem(storageKey, newCode);
  };

  const handleResetCode = () => {
    if (confirm('Deseja resetar o código deste Kata para o modelo inicial?')) {
      handleCodeChange(exercise.starterCode);
      setTestResults(null);
    }
  };

  // Run tests: either sample only or full attempt
  const handleExecuteTests = async (mode: 'sample' | 'attempt') => {
    setIsTesting(true);
    setTestMode(mode);
    setTestResults(null);
    if (window.innerWidth < 1024) {
      setMobileTab('code');
    }

    const testList = mode === 'sample'
      ? exercise.testCases.filter((tc) => !tc.isSecret)
      : exercise.testCases;

    const results: TestResult[] = [];
    let passedCount = 0;

    for (const tc of testList) {
      const start = performance.now();
      const runRes = await VisualGRunner.runHeadless(code, tc.input);
      const durationMs = Math.round(performance.now() - start);

      let passed = true;
      if (runRes.error) {
        passed = false;
      } else {
        const outNormalized = runRes.output.toLowerCase();
        for (const exp of tc.expectedOutputContains) {
          if (!outNormalized.includes(exp.toLowerCase())) {
            passed = false;
            break;
          }
        }
      }

      if (passed) passedCount++;

      results.push({
        label: tc.label,
        passed,
        input: tc.input,
        expected: tc.expectedOutputContains,
        actual: runRes.output,
        isSecret: tc.isSecret,
        error: runRes.error,
        durationMs
      });
    }

    setTestResults(results);
    setIsTesting(false);

    const isAllPassed = (mode === 'attempt' && passedCount === exercise.testCases.length);
    const totalDuration = results.reduce((acc, r) => acc + r.durationMs, 0);

    // Persist submission in SQLite database
    api.recordSubmission({
      exerciseId: exercise.id,
      code,
      passed: isAllPassed,
      passedTests: passedCount,
      totalTests: testList.length,
      durationMs: totalDuration
    }).catch(console.error);

    if (isAllPassed) {
      setAllPassed(true);
      api.recordProgress(exercise.id, exercise.honor || 10).catch(console.error);
      onComplete(exercise.id);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const getKyuBadge = (kyu: number) => {
    if (kyu === 4) {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-cyan-500/60 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
          4 kyu
        </span>
      );
    }
    if (kyu === 5 || kyu === 6) {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-400">
          {kyu} kyu
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
        {kyu} kyu
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Dojo de Katas</span>
        </button>

        <div className="flex items-center gap-3">
          {allPassed && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Kata Concluído! (+{exercise.honor} Honra)</span>
            </span>
          )}
          {onNextExercise && (
            <button
              onClick={onNextExercise}
              className="flex items-center gap-1.5 text-xs text-white px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <span>Próximo Kata</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Subtab Switcher (Visible on mobile/tablet < 1024px) */}
      <div className="lg:hidden flex items-center bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl mb-4 border border-slate-300 dark:border-slate-800 shadow-xs">
        <button
          onClick={() => setMobileTab('instructions')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
            mobileTab === 'instructions'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Instruções & Dicas</span>
        </button>
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer relative ${
            mobileTab === 'code'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>Solução & Testes</span>
          {testResults && (
            <span
              className={`w-2 h-2 rounded-full ${
                allPassed ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Kata Instructions & Solution Drawer */}
        <div className={`lg:col-span-5 space-y-4 ${mobileTab !== 'instructions' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getKyuBadge(exercise.kyu)}
                <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  +{exercise.honor} Honra
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {exercise.category}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {exercise.title}
            </h2>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              {exercise.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Rich Markdown & Card Instructions */}
            <ExerciseInstructionView description={exercise.description} />

            {/* Quick I/O Visual Example Card */}
            {exercise.testCases && exercise.testCases.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  <span>Resumo do que o programa deve fazer:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {exercise.testCases[0].input.length > 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        ⌨️ Entrada (Você digita)
                      </span>
                      <code className="text-blue-600 dark:text-cyan-300 font-mono font-bold text-xs">
                        {exercise.testCases[0].input.join(', ')}
                      </code>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        ⌨️ Entrada
                      </span>
                      <span className="text-slate-500 italic text-xs">
                        Nenhuma entrada necessária
                      </span>
                    </div>
                  )}
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      🖥️ Resposta na Tela (Saída)
                    </span>
                    <code className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">
                      {exercise.testCases[0].expectedOutputContains.join(' ')}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hints Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                <Lightbulb className="w-4 h-4" />
                <span>Dica do Sensei</span>
              </div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-amber-700 dark:text-amber-300 hover:underline font-medium transition cursor-pointer"
              >
                {showHint ? 'Ocultar Dica' : 'Ver Dica'}
              </button>
            </div>

            {showHint && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed space-y-2">
                <p>💡 {exercise.hints[hintIndex]}</p>
                {exercise.hints.length > 1 && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setHintIndex((p) => Math.max(0, p - 1))}
                      disabled={hintIndex === 0}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      Dica anterior
                    </button>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {hintIndex + 1} de {exercise.hints.length}
                    </span>
                    <button
                      onClick={() => setHintIndex((p) => Math.min(exercise.hints.length - 1, p + 1))}
                      disabled={hintIndex === exercise.hints.length - 1}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      Próxima dica
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Solution Gabarito Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-bold text-xs">
                {showSolution ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                <span>Gabarito do Kata</span>
              </div>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition cursor-pointer"
              >
                {showSolution ? 'Esconder Solução' : 'Revelar Solução'}
              </button>
            </div>

            {showSolution && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 italic">
                  Compare sua solução após tentar resolver no editor:
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto text-xs font-mono-code text-slate-200">
                  <VisualGCodeView code={exercise.solutionCode} fontSize={12} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Codewars Test Runner */}
        <div className={`lg:col-span-7 flex flex-col space-y-4 ${mobileTab !== 'code' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Editor Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-xl flex flex-col h-[420px]">
            <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Arena de Solução (Solution)</span>
              </div>
              <button
                onClick={handleResetCode}
                className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                title="Resetar para template inicial"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Resetar</span>
              </button>
            </div>

            <HighlightedCodeEditor
              code={code}
              onChange={handleCodeChange}
              fontSize={13}
              placeholder="Escreva seu algoritmo VisualG aqui para resolver o Kata..."
            />

            {/* Codewars Action Buttons: Test vs Attempt */}
            <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                F9 para testar • Salvo localmente
              </span>

              <div className="flex items-center gap-2">
                {/* Sample Test Button */}
                <button
                  onClick={() => handleExecuteTests('sample')}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-lg transition cursor-pointer"
                  title="Testar apenas com exemplos públicos"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Testes de Amostra</span>
                </button>

                {/* Attempt (Submeter Solução) Button */}
                <button
                  onClick={() => handleExecuteTests('attempt')}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
                  title="Executar todos os testes incluindo casos ocultos e ganhar Honra"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isTesting && testMode === 'attempt' ? 'Testando...' : 'Submeter Solução (Attempt)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Test Results Banner (Codewars Terminal Style) */}
          {testResults && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                    {testMode === 'sample' ? 'Testes de Amostra' : 'Submissão Completa (Attempt)'}
                  </span>
                </div>

                <div className="text-[11px]">
                  {testResults.every((t) => t.passed) ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Passou em todos os {testResults.length} testes!
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold">
                      {testResults.filter((t) => t.passed).length} passaram / {testResults.filter((t) => !t.passed).length} falharam
                    </span>
                  )}
                </div>
              </div>

              {/* Passed Honor Banner */}
              {testMode === 'attempt' && testResults.every((t) => t.passed) && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/60 border border-emerald-500/40 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="font-bold text-emerald-300">Kata Concluído com Sucesso!</div>
                      <div className="text-[11px] text-slate-300">+{exercise.honor} Pontos de Honra adicionados ao seu perfil!</div>
                    </div>
                  </div>
                  {onNextExercise && (
                    <button
                      onClick={onNextExercise}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                    >
                      Próximo Kata &rarr;
                    </button>
                  )}
                </div>
              )}

              {/* Test Cases Output List */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {testResults.map((tr, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border leading-relaxed transition ${
                      tr.passed
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 font-bold">
                        {tr.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        )}
                        <span>{tr.label}</span>
                        {tr.isSecret && (
                          <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                            Caso Oculto
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {tr.durationMs}ms
                      </span>
                    </div>

                    {!tr.passed && (
                      <div className="mt-2 pl-5 text-[11px] space-y-1 border-t border-rose-900/30 pt-1.5">
                        {tr.input.length > 0 && (
                          <div className="text-slate-400">
                            Entrada: <span className="text-slate-200">[{tr.input.join(', ')}]</span>
                          </div>
                        )}
                        {tr.error ? (
                          <div className="text-rose-400">Erro: {tr.error}</div>
                        ) : (
                          <>
                            <div className="text-slate-400">
                              Esperado conter: <span className="text-emerald-400">"{tr.expected.join('", "')}"</span>
                            </div>
                            <div className="text-slate-400">
                              Saída obtida: <span className="text-rose-300">"{tr.actual.trim() || '<vazio>'}"</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
