// VisualG Syntax Highlighting Engine

interface TokenRule {
  type:
    | 'comment'
    | 'string'
    | 'number'
    | 'section'
    | 'keyword'
    | 'type'
    | 'io'
    | 'builtin'
    | 'boolean'
    | 'operator'
    | 'punctuation'
    | 'text';
  colorClass: string;
}

export function highlightVisualG(code: string): string {
  // Escape HTML entities first to avoid XSS
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  // Regex pattern matching VisualG tokens in order of precedence:
  // 1. Comments: //.*
  // 2. Strings: ".*?" or '.*?'
  // 3. Numbers: \b\d+(\.\d+)?\b
  // 4. Identifiers/Words: \b[a-zA-Z_áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ][a-zA-Z0-9_áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ]*\b
  // 5. Operators: <- | := | \.\. | <= | >= | <> | = | \+ | - | \* | / | \\ | \^ | %
  // 6. Other characters

  const tokenRegex =
    /(\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ][a-zA-Z0-9_áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ]*\b)|(<-|:=|\.\.|<=|>=|<>|[+\-*\/\\^%=><])|([^\s\w])/g;

  const sections = new Set(['algoritmo', 'fimalgoritmo', 'var', 'inicio']);
  const keywords = new Set([
    'se',
    'entao',
    'senao',
    'fimse',
    'escolha',
    'caso',
    'outrocaso',
    'fimescolha',
    'para',
    'de',
    'ate',
    'passo',
    'faca',
    'fimpara',
    'enquanto',
    'fimenquanto',
    'repita',
    'interrompa',
    'procedimento',
    'fimprocedimento',
    'funcao',
    'fimfuncao',
    'retorne'
  ]);
  const types = new Set(['inteiro', 'real', 'caractere', 'caracter', 'logico', 'vetor']);
  const ioCommands = new Set(['escreva', 'escreval', 'leia', 'limpatela']);
  const builtins = new Set([
    'raizq',
    'abs',
    'int',
    'quad',
    'sen',
    'cos',
    'tan',
    'exp',
    'log',
    'logn',
    'rand',
    'randi',
    'pi',
    'compr',
    'copia',
    'maiusc',
    'minusc',
    'pos',
    'asc',
    'carac',
    'numpcarac',
    'caracpnum'
  ]);
  const booleans = new Set(['verdadeiro', 'falso']);
  const wordOperators = new Set(['e', 'ou', 'nao', 'xou', 'mod', 'div']);

  let html = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(code)) !== null) {
    // Append any whitespace or skipped text before this match
    if (match.index > lastIndex) {
      html += escapeHtml(code.slice(lastIndex, match.index));
    }
    lastIndex = tokenRegex.lastIndex;

    const [
      fullMatch,
      comment,
      str,
      num,
      word,
      symbolOp
    ] = match;

    if (comment) {
      html += `<span class="text-slate-400 dark:text-slate-500 italic">${escapeHtml(comment)}</span>`;
    } else if (str) {
      html += `<span class="text-emerald-600 dark:text-emerald-400 font-medium">${escapeHtml(str)}</span>`;
    } else if (num) {
      html += `<span class="text-orange-600 dark:text-amber-300 font-semibold">${escapeHtml(num)}</span>`;
    } else if (word) {
      const lower = word.toLowerCase();
      if (sections.has(lower)) {
        html += `<span class="text-blue-600 dark:text-blue-400 font-bold">${escapeHtml(word)}</span>`;
      } else if (keywords.has(lower)) {
        html += `<span class="text-indigo-600 dark:text-indigo-400 font-bold">${escapeHtml(word)}</span>`;
      } else if (types.has(lower)) {
        html += `<span class="text-teal-600 dark:text-cyan-300 font-semibold">${escapeHtml(word)}</span>`;
      } else if (ioCommands.has(lower)) {
        html += `<span class="text-purple-600 dark:text-purple-400 font-bold">${escapeHtml(word)}</span>`;
      } else if (builtins.has(lower)) {
        html += `<span class="text-amber-600 dark:text-yellow-400 font-semibold">${escapeHtml(word)}</span>`;
      } else if (booleans.has(lower)) {
        html += `<span class="text-rose-600 dark:text-rose-400 font-bold">${escapeHtml(word)}</span>`;
      } else if (wordOperators.has(lower)) {
        html += `<span class="text-pink-600 dark:text-pink-400 font-bold">${escapeHtml(word)}</span>`;
      } else {
        html += `<span class="text-slate-800 dark:text-slate-200">${escapeHtml(word)}</span>`;
      }
    } else if (symbolOp) {
      html += `<span class="text-rose-600 dark:text-rose-400 font-bold">${escapeHtml(symbolOp)}</span>`;
    } else {
      html += escapeHtml(fullMatch);
    }
  }

  // Append remaining text
  if (lastIndex < code.length) {
    html += escapeHtml(code.slice(lastIndex));
  }

  return html;
}
