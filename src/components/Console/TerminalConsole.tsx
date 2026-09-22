import React, { useRef, useEffect, useState } from 'react';
import { Terminal as TerminalIcon, Trash2, CornerDownLeft, AlertCircle } from 'lucide-react';

interface TerminalConsoleProps {
  logs: string[];
  isWaitingInput: boolean;
  waitingVarName?: string;
  onSendInput: (value: string) => void;
  onClear: () => void;
  errorMessage?: string;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  logs,
  isWaitingInput,
  waitingVarName,
  onSendInput,
  onClear,
  errorMessage
}) => {
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll when logs change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isWaitingInput, errorMessage]);

  // Focus input when waiting
  useEffect(() => {
    if (isWaitingInput) {
      inputRef.current?.focus();
    }
  }, [isWaitingInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWaitingInput) return;
    onSendInput(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-md dark:shadow-xl font-mono-code text-sm transition-colors duration-200">
      {/* Console Header */}
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Terminal de Saída (Console)</span>
          {isWaitingInput && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Aguardando entrada (leia)
            </span>
          )}
        </div>

        <button
          onClick={onClear}
          className="flex items-center gap-1 text-slate-400 hover:text-rose-400 px-2 py-1 rounded text-xs transition hover:bg-slate-800/60 cursor-pointer"
          title="Limpar console"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-[11px]">Limpar</span>
        </button>
      </div>

      {/* Console Output Scrollable Area */}
      <div className="flex-1 p-4 overflow-y-auto text-slate-200 space-y-1 select-text">
        {logs.length === 0 && !errorMessage && !isWaitingInput && (
          <div className="text-slate-500 text-xs italic py-2">
            Nenhuma saída ainda. Clique em "Executar (F9)" para rodar o algoritmo.
          </div>
        )}

        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed ${
              log.startsWith('[SISTEMA]')
                ? 'text-cyan-400 text-xs font-bold py-0.5'
                : log.startsWith('>')
                ? 'text-amber-300 font-semibold'
                : 'text-slate-100'
            }`}
          >
            {log}
          </div>
        ))}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-rose-950/50 border border-rose-800/80 rounded-lg text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-rose-200">Erro de Execução no VisualG:</div>
              <div className="mt-0.5 text-rose-300 font-mono">{errorMessage}</div>
            </div>
          </div>
        )}

        {/* Interactive Leia Input Box */}
        {isWaitingInput && (
          <form onSubmit={handleSubmit} className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold select-none flex-shrink-0">
              <span>leia({waitingVarName || 'valor'}) &gt;</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite o valor e tecle Enter..."
              className="flex-1 bg-slate-900 border border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-amber-400 transition"
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer"
            >
              <span>Enviar</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
