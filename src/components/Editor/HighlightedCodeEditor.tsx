import React, { useRef, useEffect } from 'react';
import { highlightVisualG } from '../../utils/syntaxHighlight';

interface HighlightedCodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  fontSize?: number;
  placeholder?: string;
  highlightLine?: number;
}

export const HighlightedCodeEditor: React.FC<HighlightedCodeEditorProps> = ({
  code,
  onChange,
  onKeyDown,
  fontSize = 14,
  placeholder = 'Digite seu código VisualG aqui...',
  highlightLine
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');

  // Synchronize scroll between textarea, highlight overlay and line numbers
  const handleScroll = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (preRef.current) {
      preRef.current.scrollTop = textarea.scrollTop;
      preRef.current.scrollLeft = textarea.scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textarea.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
      if (e.defaultPrevented) return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '   '; // 3 spaces for VisualG indentation

      const updatedCode = code.substring(0, start) + spaces + code.substring(end);
      onChange(updatedCode);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  const handleInsertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? code.length;
    const end = textarea.selectionEnd ?? code.length;
    const updated = code.substring(0, start) + snippet + code.substring(end);
    onChange(updated);
    setTimeout(() => {
      textarea.focus();
      // If snippet has quotes or parens, place cursor inside
      let cursorOffset = snippet.length;
      if (snippet === '""' || snippet === '()') {
        cursorOffset = 1;
      } else if (snippet === 'escreval("")') {
        cursorOffset = 10;
      } else if (snippet === 'leia()') {
        cursorOffset = 5;
      }
      textarea.selectionStart = textarea.selectionEnd = start + cursorOffset;
    }, 10);
  };

  const highlightedHtml = highlightVisualG(code + (code.endsWith('\n') ? ' ' : ''));

  return (
    <div className="flex flex-col flex-1 overflow-hidden font-mono-code select-none">
      {/* Code Area */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Line Numbers Column (Compact on mobile) */}
        <div
          ref={lineNumbersRef}
          className="w-9 sm:w-12 bg-slate-100/80 dark:bg-slate-950/80 text-slate-400 dark:text-slate-600 select-none py-3 text-right pr-1.5 sm:pr-3 overflow-hidden border-r border-slate-200 dark:border-slate-800/80 flex-shrink-0"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
        >
          {lines.map((_, index) => {
            const lineNum = index + 1;
            const isHighlighted = highlightLine === lineNum;
            return (
              <div
                key={lineNum}
                className={`${
                  isHighlighted ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold' : ''
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Editor Main Canvas (Overlay) */}
        <div className="relative flex-1 h-full overflow-hidden bg-white dark:bg-slate-900/90">
          {/* Layer 1: Syntax Highlighted Backdrop */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-0 p-2.5 sm:p-3 overflow-hidden whitespace-pre font-mono-code leading-[1.6] select-none"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              tabSize: 3
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />

          {/* Layer 2: Transparent Interactive Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full p-2.5 sm:p-3 m-0 bg-transparent text-transparent caret-blue-600 dark:caret-cyan-400 selection:bg-blue-500/25 selection:text-transparent outline-none resize-none border-0 overflow-auto whitespace-pre font-mono-code leading-[1.6]"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              tabSize: 3
            }}
            placeholder={placeholder}
          />
        </div>
      </div>

      {/* Mobile Quick Keys Accessory Bar (Barra de Teclas Rápidas para Celular) */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 overflow-x-auto select-none shrink-0">
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-1 uppercase shrink-0">
          Atalhos:
        </span>
        {[
          { label: '<-', text: ' <- ' },
          { label: 'Tab ⇥', text: '   ' },
          { label: '""', text: '""' },
          { label: '(', text: '(' },
          { label: ')', text: ')' },
          { label: ':', text: ': ' },
          { label: ',', text: ', ' },
          { label: 'escreval', text: 'escreval("")' },
          { label: 'leia', text: 'leia()' },
          { label: 'se..entao', text: 'se  entao\n   \nfimse' },
          { label: 'para', text: 'para i de 1 ate  faca\n   \nfimpara' },
          { label: 'inteiro', text: 'inteiro' },
          { label: 'real', text: 'real' },
          { label: 'caractere', text: 'caractere' }
        ].map((keyItem, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleInsertSnippet(keyItem.text)}
            className="px-2 py-1 text-[11px] font-mono font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md shadow-xs active:bg-blue-600 active:text-white transition shrink-0 cursor-pointer"
          >
            {keyItem.label}
          </button>
        ))}
      </div>
    </div>
  );
};
