import React from 'react';
import { Database, Cpu, HelpCircle } from 'lucide-react';
import { VariableInfo } from '../../engine/types';

interface MemoryTableProps {
  memory: Record<string, VariableInfo>;
}

export const MemoryTable: React.FC<MemoryTableProps> = ({ memory }) => {
  const variables = Object.values(memory);

  const getTypeBadge = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.startsWith('vetor')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
          {type}
        </span>
      );
    }
    if (lower.includes('inteiro')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
          inteiro
        </span>
      );
    }
    if (lower.includes('real')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
          real
        </span>
      );
    }
    if (lower.includes('caractere')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
          caractere
        </span>
      );
    }
    if (lower.includes('logico')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
          logico
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
        {type}
      </span>
    );
  };

  const formatDisplayValue = (item: VariableInfo) => {
    const val = item.displayValue;
    if (item.type.toLowerCase().includes('logico')) {
      return (
        <span className={val === 'VERDADEIRO' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
          {val}
        </span>
      );
    }
    if (item.type.toLowerCase().includes('caractere')) {
      return <span className="text-emerald-600 dark:text-emerald-300 font-mono font-medium">{val}</span>;
    }
    if (item.type.toLowerCase().includes('real') || item.type.toLowerCase().includes('inteiro')) {
      return <span className="text-blue-600 dark:text-cyan-300 font-mono font-medium">{val}</span>;
    }
    return <span className="text-amber-700 dark:text-amber-200 font-mono font-medium">{val}</span>;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-md dark:shadow-xl text-xs transition-colors duration-200">
      {/* Table Header */}
      <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Área das Variáveis (Memória)</span>
          <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 rounded text-[10px] font-mono">
            {variables.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400" title="Monitor em tempo real do VisualG">
          <Cpu className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>VisualG Watcher</span>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto">
        {variables.length === 0 ? (
          <div className="p-6 text-center text-slate-400 dark:text-slate-600 flex flex-col items-center justify-center h-full">
            <HelpCircle className="w-8 h-8 mb-2 opacity-30" />
            <p className="font-medium text-slate-600 dark:text-slate-400">Nenhuma variável em memória</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
              Ao executar um algoritmo com a seção <code className="text-slate-600 dark:text-slate-400 font-mono">var</code>, as variáveis e seus valores atuais aparecerão aqui em tempo real.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/50 text-[11px] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-2 px-3 font-semibold">Nome</th>
                <th className="py-2 px-3 font-semibold">Tipo</th>
                <th className="py-2 px-3 font-semibold">Valor Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {variables.map((v) => (
                <tr key={v.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition">
                  <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {v.name}
                  </td>
                  <td className="py-2 px-3">
                    {getTypeBadge(v.type)}
                  </td>
                  <td className="py-2 px-3 break-all">
                    {formatDisplayValue(v)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
