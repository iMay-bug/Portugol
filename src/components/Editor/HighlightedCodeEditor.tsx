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

  const highlightedHtml = highlightVisualG(code + (code.endsWith('\n') ? ' ' : ''));

  return (
    <div className="relative flex-1 flex overflow-hidden font-mono-code select-none">
      {/* Line Numbers Column */}
      <div
        ref={lineNumbersRef}
        className="w-12 bg-slate-100/80 dark:bg-slate-950/80 text-slate-400 dark:text-slate-600 select-none py-3 text-right pr-3 overflow-hidden border-r border-slate-200 dark:border-slate-800/80 flex-shrink-0"
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
          className="pointer-events-none absolute inset-0 m-0 p-3 overflow-hidden whitespace-pre font-mono-code leading-[1.6] select-none"
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
          className="absolute inset-0 w-full h-full p-3 m-0 bg-transparent text-transparent caret-blue-600 dark:caret-cyan-400 selection:bg-blue-500/25 selection:text-transparent outline-none resize-none border-0 overflow-auto whitespace-pre font-mono-code leading-[1.6]"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.6',
            tabSize: 3
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
