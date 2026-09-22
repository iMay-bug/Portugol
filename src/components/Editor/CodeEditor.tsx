import React, { useState } from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Copy,
  Check,
  Download,
  FolderOpen,
  ZoomIn,
  ZoomOut,
  Database,
  Save
} from 'lucide-react';
import { EXAMPLES } from '../../data/examples';
import { HighlightedCodeEditor } from './HighlightedCodeEditor';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun: () => void;
  onStop: () => void;
  isRunning: boolean;
  highlightLine?: number;
  onOpenSavedModal?: (view?: 'list' | 'save') => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  onStop,
  isRunning,
  highlightLine,
  onOpenSavedModal
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);

  const lines = code.split('\n');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // F9 shortcut to run code
    if (e.key === 'F9') {
      e.preventDefault();
      if (!isRunning) {
        onRun();
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'algoritmo.alg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Deseja redefinir o editor para o modelo básico padrão?')) {
      onChange(`algoritmo "NovoAlgoritmo"
// Disciplina  : Lógica de Programação
// Professor   : VisualG
var
   // Seção de Declaração das variáveis
   nome: caractere
inicio
   // Seção de Comandos
   escreva("Digite o seu nome: ")
   leia(nome)
   escreval("Olá, ", nome, "! Bem-vindo(a) ao VisualG.")
fimalgoritmo`);
    }
  };

  const handleSelectExample = (exampleId: string) => {
    const ex = EXAMPLES.find((item) => item.id === exampleId);
    if (ex) {
      onChange(ex.code);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-md dark:shadow-xl transition-colors duration-200">
      {/* Editor Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          {/* Run Button */}
          {!isRunning ? (
            <button
              onClick={onRun}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
              title="Executar Algoritmo (Atalho: F9)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Executar (F9)</span>
            </button>
          ) : (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-lg shadow-md shadow-rose-600/20 transition active:scale-95 animate-pulse cursor-pointer"
              title="Parar Execução"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Parar</span>
            </button>
          )}

          {/* Reset button */}
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/70 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs transition disabled:opacity-50 cursor-pointer"
            title="Redefinir código"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </button>

          {/* Examples Dropdown */}
          <div className="relative flex items-center max-w-[135px] sm:max-w-none">
            <FolderOpen className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-2 pointer-events-none" />
            <select
              onChange={(e) => {
                if (e.target.value) handleSelectExample(e.target.value);
                e.target.value = '';
              }}
              defaultValue=""
              disabled={isRunning}
              className="pl-7 pr-2 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/60 rounded-lg outline-none cursor-pointer disabled:opacity-50 transition truncate w-full"
            >
              <option value="" disabled>
                Exemplos...
              </option>
              {EXAMPLES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>

          {/* SQLite Database Buttons */}
          {onOpenSavedModal && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onOpenSavedModal('save')}
                disabled={isRunning}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-blue-700 dark:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                title="Salvar algoritmo atual no Banco de Dados"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salvar</span>
              </button>
              <button
                onClick={() => onOpenSavedModal('list')}
                disabled={isRunning}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/70 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
                title="Abrir gerenciador de algoritmos salvos no banco"
              >
                <Database className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Salvos</span>
              </button>
            </div>
          )}
        </div>

        {/* Right side utility buttons */}
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          {/* Zoom controls (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setFontSize((prev) => Math.max(12, prev - 1))}
              className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Diminuir fonte"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono w-6 text-center text-slate-500 dark:text-slate-400">{fontSize}px</span>
            <button
              onClick={() => setFontSize((prev) => Math.min(22, prev + 1))}
              className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Aumentar fonte"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs transition cursor-pointer"
            title="Copiar código para área de transferência"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold hidden xs:inline">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Copiar</span>
              </>
            )}
          </button>

          {/* Download .alg file */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2 py-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs transition cursor-pointer"
            title="Baixar arquivo .alg para VisualG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">.alg</span>
          </button>
        </div>
      </div>

      {/* Synchronized Syntax-Highlighted Editor */}
      <HighlightedCodeEditor
        code={code}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        fontSize={fontSize}
        highlightLine={highlightLine}
      />

      {/* Editor Status Bar */}
      <div className="bg-slate-50 dark:bg-slate-950 px-4 py-1.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <div>VisualG 3.0 • Destaque de Sintaxe Ativo</div>
        <div className="flex items-center gap-4">
          <span>{lines.length} linhas</span>
          <span>{code.length} caracteres</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium">Atalho: F9 para executar</span>
        </div>
      </div>
    </div>
  );
};
