import { RuntimeValue } from './types';

export const BUILTIN_CONSTANTS: Record<string, number> = {
  pi: Math.PI,
};

export const BUILTIN_FUNCTIONS: Record<string, (...args: RuntimeValue[]) => RuntimeValue> = {
  // Funções Matemáticas
  abs: (x) => Math.abs(Number(x)),
  raizq: (x) => {
    const val = Number(x);
    if (val < 0) throw new Error('Não é possível calcular a raiz quadrada de um número negativo.');
    return Math.sqrt(val);
  },
  int: (x) => Math.trunc(Number(x)),
  grauprad: (x) => (Number(x) * Math.PI) / 180,
  radpgrau: (x) => (Number(x) * 180) / Math.PI,
  sen: (x) => Math.sin(Number(x)),
  cos: (x) => Math.cos(Number(x)),
  tan: (x) => Math.tan(Number(x)),
  exp: (x, y) => Math.pow(Number(x), Number(y)),
  log: (x) => {
    const val = Number(x);
    if (val <= 0) throw new Error('Logaritmo indefinido para valores menores ou iguais a zero.');
    return Math.log(val);
  },
  logn: (x) => {
    const val = Number(x);
    if (val <= 0) throw new Error('Logaritmo indefinido para valores menores ou iguais a zero.');
    return Math.log10(val);
  },
  rand: () => Math.random(),
  randi: (limit) => Math.floor(Math.random() * Math.max(1, Number(limit))),
  quad: (x) => Math.pow(Number(x), 2),

  // Funções de Caractere (String) - VisualG usa indexação baseada em 1
  compr: (s) => String(s ?? '').length,
  copia: (s, pos, count) => {
    const str = String(s ?? '');
    const startIdx = Math.max(0, Number(pos) - 1);
    const length = Math.max(0, Number(count));
    return str.slice(startIdx, startIdx + length);
  },
  maiusc: (s) => String(s ?? '').toUpperCase(),
  minusc: (s) => String(s ?? '').toLowerCase(),
  pos: (sub, s) => {
    const str = String(s ?? '');
    const subStr = String(sub ?? '');
    const index = str.indexOf(subStr);
    return index === -1 ? 0 : index + 1;
  },
  asc: (s) => {
    const str = String(s ?? '');
    return str.length > 0 ? str.charCodeAt(0) : 0;
  },
  carac: (code) => String.fromCharCode(Number(code)),
  numpcarac: (n) => String(n),
  caracpnum: (s) => {
    const num = Number(s);
    return isNaN(num) ? 0 : num;
  }
};
