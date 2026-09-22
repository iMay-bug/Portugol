import React from 'react';
import { Zap, Hash, Compass, ArrowRight, Code, BookmarkCheck, Calculator } from 'lucide-react';

export const CheatSheet: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6 transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Guia Rápido & Tabela de Referência do VisualG 3.0
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          Consulte rapidamente as palavras reservadas, operadores, tipos de dados e funções nativas do dialeto oficial do VisualG.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {/* 1. Estrutura Padrão */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
            <Code className="w-4 h-4" />
            <span>Estrutura do Programa</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Todo algoritmo válido no VisualG segue esta estrutura exata:
          </p>
          <pre className="bg-slate-950 p-3 rounded-lg text-cyan-300 font-mono text-[11px] leading-relaxed border border-slate-800">
{`algoritmo "Nome"
var
   // declarações
inicio
   // comandos
fimalgoritmo`}
          </pre>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <div>• Comentários: <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">// texto</code></div>
            <div>• Atribuição: <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">&lt;-</code> ou <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">:=</code></div>
            <div>• Case-insensitive (maiúsculas/minúsculas não diferem).</div>
          </div>
        </div>

        {/* 2. Tipos de Dados */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
            <Hash className="w-4 h-4" />
            <span>Tipos Primitivos</span>
          </div>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">inteiro</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Números sem decimais</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Ex: -10, 0, 42</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">real</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Números com decimais (.)</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Ex: 3.14, -0.5</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">caractere</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Textos entre aspas duplas</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Ex: "Brasil"</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">logico</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Booleanos</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">verdadeiro, falso</span>
            </div>
          </div>
        </div>

        {/* 3. Operadores Aritméticos */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
            <Calculator className="w-4 h-4" />
            <span>Operadores Aritméticos</span>
          </div>
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-1.5 font-mono text-cyan-600 dark:text-cyan-300 font-bold">+ / -</td>
                <td className="py-1.5 text-slate-600 dark:text-slate-400">Adição e Subtração</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-cyan-600 dark:text-cyan-300 font-bold">* / /</td>
                <td className="py-1.5 text-slate-600 dark:text-slate-400">Multiplicação e Divisão real</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-cyan-600 dark:text-cyan-300 font-bold">\</td>
                <td className="py-1.5 text-slate-600 dark:text-slate-400">Divisão inteira (ex: 7 \ 2 = 3)</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-cyan-600 dark:text-cyan-300 font-bold">mod (%)</td>
                <td className="py-1.5 text-slate-600 dark:text-slate-400">Resto da divisão (ex: 7 mod 2 = 1)</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-cyan-600 dark:text-cyan-300 font-bold">^</td>
                <td className="py-1.5 text-slate-600 dark:text-slate-400">Exponenciação (ex: 2 ^ 3 = 8)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. Operadores Relacionais e Lógicos */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
            <Compass className="w-4 h-4" />
            <span>Relacionais & Lógicos</span>
          </div>
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-1.5 font-mono text-amber-600 dark:text-amber-300 font-bold">= / &lt;&gt;</td>
                <td className="py-1.5 text-slate-600 dark:text-slate-400">Igual e Diferente</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-amber-600 dark:text-amber-300 font-bold">&gt; / &lt;</td>
                <td className="py-1.5 text-slate-600 dark:text-slate-400">Maior e Menor</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-amber-600 dark:text-amber-300 font-bold">&gt;= / &lt;=</td>
                <td className="py-1.5 text-slate-600 dark:text-slate-400">Maior igual e Menor igual</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-purple-600 dark:text-purple-300 font-bold">e / ou</td>
                <td className="py-1.5 text-slate-600 dark:text-slate-400">Conjunção e Disjunção</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-purple-600 dark:text-purple-300 font-bold">nao / xou</td>
                <td className="py-1.5 text-slate-600 dark:text-slate-400">Negação e Ou Exclusivo</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. Estruturas de Controle */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
            <ArrowRight className="w-4 h-4" />
            <span>Estruturas Condicionais</span>
          </div>
          <div className="space-y-2 font-mono text-[11px]">
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400 font-bold">se</span> condicao <span className="text-blue-600 dark:text-blue-400 font-bold">entao</span><br />
              &nbsp;&nbsp;// comandos<br />
              <span className="text-blue-600 dark:text-blue-400 font-bold">senao</span><br />
              &nbsp;&nbsp;// comandos alternativos<br />
              <span className="text-blue-600 dark:text-blue-400 font-bold">fimse</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400 font-bold">escolha</span> opcao<br />
              &nbsp;&nbsp;<span className="text-blue-600 dark:text-blue-400 font-bold">caso</span> 1, 2: // comandos<br />
              &nbsp;&nbsp;<span className="text-blue-600 dark:text-blue-400 font-bold">outrocaso</span>: // padrao<br />
              <span className="text-blue-600 dark:text-blue-400 font-bold">fimescolha</span>
            </div>
          </div>
        </div>

        {/* 6. Laços de Repetição */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
            <BookmarkCheck className="w-4 h-4" />
            <span>Laços de Repetição</span>
          </div>
          <div className="space-y-2 font-mono text-[11px]">
            <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <span className="text-rose-600 dark:text-rose-400 font-bold">para</span> i <span className="text-rose-600 dark:text-rose-400 font-bold">de</span> 1 <span className="text-rose-600 dark:text-rose-400 font-bold">ate</span> 10 [<span className="text-rose-600 dark:text-rose-400 font-bold">passo</span> 1] <span className="text-rose-600 dark:text-rose-400 font-bold">faca</span><br />
              &nbsp;&nbsp;// repeticao com contador<br />
              <span className="text-rose-600 dark:text-rose-400 font-bold">fimpara</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <span className="text-rose-600 dark:text-rose-400 font-bold">enquanto</span> condicao <span className="text-rose-600 dark:text-rose-400 font-bold">faca</span><br />
              &nbsp;&nbsp;// pré-testado<br />
              <span className="text-rose-600 dark:text-rose-400 font-bold">fimenquanto</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <span className="text-rose-600 dark:text-rose-400 font-bold">repita</span><br />
              &nbsp;&nbsp;// pós-testado (repete até ser verdadeiro)<br />
              <span className="text-rose-600 dark:text-rose-400 font-bold">ate</span> condicao
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
