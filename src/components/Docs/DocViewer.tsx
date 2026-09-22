import React, { useState } from 'react';
import { DOCUMENTATION } from '../../data/documentation';
import {
  BookOpen,
  Play,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Search
} from 'lucide-react';
import { VisualGCodeView } from '../Editor/VisualGCodeView';

interface DocViewerProps {
  onLoadExampleInPlayground: (code: string) => void;
}

export const DocViewer: React.FC<DocViewerProps> = ({ onLoadExampleInPlayground }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(DOCUMENTATION[0].id);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const currentDoc = DOCUMENTATION.find((d) => d.id === selectedDocId) || DOCUMENTATION[0];
  const currentIndex = DOCUMENTATION.findIndex((d) => d.id === currentDoc.id);

  const filteredDocs = DOCUMENTATION.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = () => {
    if (currentIndex < DOCUMENTATION.length - 1) {
      setSelectedDocId(DOCUMENTATION[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedDocId(DOCUMENTATION[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sticky top-20 shadow-md dark:shadow-lg transition-colors duration-200">
          {/* Search Box */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar na documentação..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            <span>Módulos de Estudo</span>
            <span>{DOCUMENTATION.length} Aulas</span>
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === currentDoc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="truncate">
                    <div className="truncate font-medium">{doc.title}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {doc.category}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-medium ${
                      isSelected
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {doc.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Documentation Article */}
      <main className="flex-1 min-w-0">
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-md dark:shadow-xl transition-colors duration-200">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {currentDoc.category}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Nível: {currentDoc.badge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {currentDoc.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">
              {currentDoc.summary}
            </p>
          </div>

          {/* Article Markdown-like Content */}
          <div className="max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-4">
            {currentDoc.content.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={pIdx} className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('1. ') || paragraph.startsWith('* ')) {
                return (
                  <div key={pIdx} className="space-y-1.5 pl-2 my-3">
                    {paragraph.split('\n').map((line, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/^[*0-9.]+\s*/, '')
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white">$1</strong>')
                              .replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded text-blue-600 dark:text-cyan-300 text-xs border border-slate-200 dark:border-slate-800">$1</code>')
                          }}
                        />
                      </div>
                    ))}
                  </div>
                );
              }
              if (paragraph.startsWith('| ')) {
                // Render markdown table
                const rows = paragraph.trim().split('\n');
                const headerCols = rows[0].split('|').filter(c => c.trim().length > 0);
                const bodyRows = rows.slice(2);
                return (
                  <div key={pIdx} className="overflow-x-auto my-4">
                    <table className="min-w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                      <thead className="bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-300">
                        <tr>
                          {headerCols.map((col, cIdx) => (
                            <th key={cIdx} className="p-2.5 font-semibold border-b border-slate-200 dark:border-slate-800">
                              <span dangerouslySetInnerHTML={{ __html: col.replace(/\*\*(.*?)\*\*/g, '$1') }} />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-slate-50/40 dark:bg-slate-900/60">
                        {bodyRows.map((row, rIdx) => {
                          const cols = row.split('|').filter(c => c.trim().length > 0);
                          return (
                            <tr key={rIdx} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
                              {cols.map((col, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="p-2.5 text-slate-700 dark:text-slate-300"
                                  dangerouslySetInnerHTML={{
                                    __html: col
                                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white">$1</strong>')
                                      .replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded text-blue-600 dark:text-cyan-300 font-mono">$1</code>')
                                  }}
                                />
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }

              return (
                <p
                  key={pIdx}
                  dangerouslySetInnerHTML={{
                    __html: paragraph
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white">$1</strong>')
                      .replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded text-blue-600 dark:text-cyan-300 text-xs border border-slate-200 dark:border-slate-800">$1</code>')
                  }}
                />
              );
            })}
          </div>

          {/* Interactive Code Example Box */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Exemplo Prático VisualG
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(currentDoc.codeSnippet)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onLoadExampleInPlayground(currentDoc.codeSnippet)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs shadow-md shadow-blue-600/20 transition active:scale-95 cursor-pointer"
                  title="Abrir no editor interativo e rodar"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Carregar no Editor</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto font-mono-code text-xs text-slate-200 leading-relaxed shadow-inner">
              <VisualGCodeView code={currentDoc.codeSnippet} fontSize={12} />
            </div>
          </div>

          {/* Tips and Pitfalls */}
          {currentDoc.tips && currentDoc.tips.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Lightbulb className="w-4 h-4" />
                <span>Dicas Importantes do VisualG</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-900/90 dark:text-amber-200/90 pl-1">
                {currentDoc.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Aula Anterior</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === DOCUMENTATION.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <span>Próxima Aula</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </article>
      </main>
    </div>
  );
};
