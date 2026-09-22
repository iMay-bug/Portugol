import React from 'react';
import { Target, Lightbulb, Terminal, ArrowRight, Sparkles, Info, CheckCircle2, Code2 } from 'lucide-react';

interface ExerciseInstructionViewProps {
  description: string;
}

interface ParsedBlock {
  type: 'header' | 'mission' | 'example' | 'tip' | 'code' | 'list' | 'paragraph';
  title?: string;
  content: string;
  items?: string[];
  inputExample?: string;
  outputExample?: string;
}

export const ExerciseInstructionView: React.FC<ExerciseInstructionViewProps> = ({ description }) => {
  // Parse markdown into rich structured blocks
  const parseMarkdownToBlocks = (raw: string): ParsedBlock[] => {
    const lines = raw.trim().split('\n');
    const blocks: ParsedBlock[] = [];
    let currentParagraph: string[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let currentList: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ').trim();
        if (text) {
          blocks.push({ type: 'paragraph', content: text });
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: '', items: [...currentList] });
        currentList = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Code blocks ```
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Closing code block
          blocks.push({
            type: 'code',
            content: codeLines.join('\n')
          });
          codeLines = [];
          inCodeBlock = false;
        } else {
          flushParagraph();
          flushList();
          inCodeBlock = true;
          codeLines = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(lines[i]);
        continue;
      }

      // Empty line
      if (!line) {
        flushParagraph();
        flushList();
        continue;
      }

      // Headers (### or ## or #)
      if (line.startsWith('#')) {
        flushParagraph();
        flushList();
        const cleanHeader = line.replace(/^#+\s*/, '').trim();

        // Detect if this is a "Missão" / "Objetivo" header
        if (cleanHeader.toLowerCase().includes('missão') || cleanHeader.toLowerCase().includes('objetivo')) {
          blocks.push({ type: 'header', title: cleanHeader, content: '' });
        } else if (cleanHeader.toLowerCase().includes('exemplo')) {
          blocks.push({ type: 'header', title: cleanHeader, content: '' });
        } else {
          blocks.push({ type: 'header', title: cleanHeader, content: '' });
        }
        continue;
      }

      // Blockquotes (> or > ⚠️)
      if (line.startsWith('>')) {
        flushParagraph();
        flushList();
        const tipText = line.replace(/^>\s*(⚠️\s*)?/, '').trim();
        blocks.push({ type: 'tip', content: tipText });
        continue;
      }

      // Lists: - or * or 1.
      const listMatch = line.match(/^[-*]\s+(.*)$/) || line.match(/^\d+\.\s+(.*)$/);
      if (listMatch) {
        flushParagraph();
        currentList.push(listMatch[1]);
        continue;
      }

      // Regular text
      flushList();
      currentParagraph.push(line);
    }

    flushParagraph();
    flushList();
    return blocks;
  };

  const blocks = parseMarkdownToBlocks(description);

  // Helper to render inline formatting: **bold** and `code`
  const renderInlineFormatted = (text: string) => {
    // Replace markdown bold and code
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-slate-900 dark:text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-slate-950 text-blue-600 dark:text-cyan-300 font-mono text-xs border border-blue-200 dark:border-slate-800 font-semibold mx-0.5"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIdx = regex.lastIndex;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="space-y-3.5 text-xs sm:text-sm">
      {blocks.map((block, idx) => {
        if (block.type === 'header') {
          const isMission =
            block.title?.toLowerCase().includes('missão') ||
            block.title?.toLowerCase().includes('objetivo');
          const isExample = block.title?.toLowerCase().includes('exemplo');
          const isLearn =
            block.title?.toLowerCase().includes('aprender') ||
            block.title?.toLowerCase().includes('comando') ||
            block.title?.toLowerCase().includes('entenda');

          if (isMission) {
            return (
              <div
                key={idx}
                className="flex items-center gap-2 pt-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm tracking-tight border-b border-indigo-100 dark:border-indigo-900/40 pb-1.5"
              >
                <div className="p-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>{block.title}</span>
              </div>
            );
          }

          if (isExample) {
            return (
              <div
                key={idx}
                className="flex items-center gap-2 pt-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm tracking-tight border-b border-emerald-100 dark:border-emerald-900/40 pb-1.5"
              >
                <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span>{block.title}</span>
              </div>
            );
          }

          if (isLearn) {
            return (
              <div
                key={idx}
                className="flex items-center gap-2 pt-2 text-blue-700 dark:text-blue-400 font-bold text-sm tracking-tight border-b border-blue-100 dark:border-blue-900/40 pb-1.5"
              >
                <div className="p-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span>{block.title}</span>
              </div>
            );
          }

          return (
            <h4
              key={idx}
              className="text-sm font-bold text-slate-900 dark:text-white pt-2 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1"
            >
              <span>{block.title}</span>
            </h4>
          );
        }

        if (block.type === 'tip') {
          return (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs leading-relaxed shadow-xs"
            >
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>{renderInlineFormatted(block.content)}</div>
            </div>
          );
        }

        if (block.type === 'code') {
          return (
            <div
              key={idx}
              className="bg-slate-950 rounded-xl p-3 border border-slate-800 shadow-inner overflow-x-auto my-2"
            >
              <div className="flex items-center justify-between text-[10px] uppercase font-mono text-slate-400 mb-1.5 select-none pb-1 border-b border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  Saída Esperada no Console
                </span>
                <span className="text-slate-500">VisualG</span>
              </div>
              <pre className="text-cyan-300 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {block.content}
              </pre>
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <div key={idx} className="space-y-2 my-2">
              {block.items?.map((item, itemIdx) => {
                // Check if item has input / output pattern (e.g. "Se você digitar: X -> O computador responde: Y")
                const isIoExample = item.includes('&rarr;') || item.includes('->') || item.includes('responder:') || item.includes('deve ser');

                if (isIoExample) {
                  return (
                    <div
                      key={itemIdx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-xs"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {renderInlineFormatted(item)}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={itemIdx} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 border border-blue-500/20">
                      {itemIdx + 1}
                    </span>
                    <span className="leading-relaxed">{renderInlineFormatted(item)}</span>
                  </div>
                );
              })}
            </div>
          );
        }

        return (
          <p
            key={idx}
            className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm"
          >
            {renderInlineFormatted(block.content)}
          </p>
        );
      })}
    </div>
  );
};
