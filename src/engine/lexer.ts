import { Token, TokenType } from './types';

export const KEYWORDS = new Set([
  'algoritmo',
  'fimalgoritmo',
  'var',
  'inicio',
  'escreva',
  'escreval',
  'leia',
  'limpatela',
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
  'inteiro',
  'real',
  'caractere',
  'caracter',
  'logico',
  'vetor',
  'procedimento',
  'fimprocedimento',
  'funcao',
  'fimfuncao',
  'retorne'
]);

export const LOGICAL_KEYWORDS = new Set([
  'e',
  'ou',
  'nao',
  'xou',
  'mod',
  'div'
]);

export class Lexer {
  private source: string;
  private pos: number = 0;
  private line: number = 1;
  private col: number = 1;
  private length: number;

  constructor(source: string) {
    this.source = source;
    this.length = source.length;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.pos < this.length) {
      const char = this.source[this.pos];

      // Whitespace
      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance();
        continue;
      }

      // New line
      if (char === '\n') {
        this.advance();
        this.line++;
        this.col = 1;
        continue;
      }

      // Comments: //
      if (char === '/' && this.peek(1) === '/') {
        while (this.pos < this.length && this.source[this.pos] !== '\n') {
          this.advance();
        }
        continue;
      }

      // String literals: "..." or '...'
      if (char === '"' || char === "'") {
        tokens.push(this.readString(char));
        continue;
      }

      // Numbers: integer or float
      if (this.isDigit(char)) {
        tokens.push(this.readNumber());
        continue;
      }

      // Range operator: ..
      if (char === '.' && this.peek(1) === '.') {
        const tokenCol = this.col;
        this.advance();
        this.advance();
        tokens.push({
          type: 'OPERATOR',
          value: '..',
          line: this.line,
          col: tokenCol
        });
        continue;
      }

      // Assignment: <-
      if (char === '<' && this.peek(1) === '-') {
        const tokenCol = this.col;
        this.advance();
        this.advance();
        tokens.push({
          type: 'OPERATOR',
          value: '<-',
          line: this.line,
          col: tokenCol
        });
        continue;
      }

      // Assignment: :=
      if (char === ':' && this.peek(1) === '=') {
        const tokenCol = this.col;
        this.advance();
        this.advance();
        tokens.push({
          type: 'OPERATOR',
          value: '<-', // normalize := to <-
          line: this.line,
          col: tokenCol
        });
        continue;
      }

      // Relational two-char operators: <=, >=, <>
      if (
        (char === '<' && (this.peek(1) === '=' || this.peek(1) === '>')) ||
        (char === '>' && this.peek(1) === '=')
      ) {
        const tokenCol = this.col;
        const op = char + this.peek(1);
        this.advance();
        this.advance();
        tokens.push({
          type: 'OPERATOR',
          value: op,
          line: this.line,
          col: tokenCol
        });
        continue;
      }

      // Single-character operators & punctuation
      if ('+-*/\\^%=><'.includes(char)) {
        const tokenCol = this.col;
        this.advance();
        tokens.push({
          type: 'OPERATOR',
          value: char,
          line: this.line,
          col: tokenCol
        });
        continue;
      }

      if ('(),:;[]'.includes(char)) {
        const tokenCol = this.col;
        this.advance();
        tokens.push({
          type: 'PUNCTUATION',
          value: char,
          line: this.line,
          col: tokenCol
        });
        continue;
      }

      // Identifiers, keywords, booleans, or word operators (e, ou, nao, etc.)
      if (this.isAlpha(char) || char === '_') {
        tokens.push(this.readIdentifier());
        continue;
      }

      // If we encounter unexpected character, advance and report or skip
      this.advance();
    }

    tokens.push({
      type: 'EOF',
      value: '',
      line: this.line,
      col: this.col
    });

    return tokens;
  }

  private advance(): string {
    const char = this.source[this.pos];
    this.pos++;
    this.col++;
    return char;
  }

  private peek(offset: number = 0): string {
    const target = this.pos + offset;
    return target < this.length ? this.source[target] : '';
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (
      (char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z') ||
      // Portuguese accented characters
      'áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ'.includes(char)
    );
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char) || char === '_';
  }

  private readString(quoteChar: string): Token {
    const tokenCol = this.col;
    const tokenLine = this.line;
    this.advance(); // skip opening quote

    let result = '';
    while (this.pos < this.length && this.source[this.pos] !== quoteChar) {
      if (this.source[this.pos] === '\n') {
        this.line++;
        this.col = 1;
      }
      result += this.source[this.pos];
      this.advance();
    }

    if (this.pos < this.length && this.source[this.pos] === quoteChar) {
      this.advance(); // skip closing quote
    }

    return {
      type: 'STRING',
      value: result,
      line: tokenLine,
      col: tokenCol
    };
  }

  private readNumber(): Token {
    const tokenCol = this.col;
    let numStr = '';

    while (this.pos < this.length && this.isDigit(this.source[this.pos])) {
      numStr += this.advance();
    }

    // Check for decimal point (ensure it's not the range operator '..')
    if (this.source[this.pos] === '.' && this.peek(1) !== '.') {
      numStr += this.advance(); // include '.'
      while (this.pos < this.length && this.isDigit(this.source[this.pos])) {
        numStr += this.advance();
      }
    }

    return {
      type: 'NUMBER',
      value: numStr,
      line: this.line,
      col: tokenCol
    };
  }

  private readIdentifier(): Token {
    const tokenCol = this.col;
    let word = '';

    while (this.pos < this.length && this.isAlphaNumeric(this.source[this.pos])) {
      word += this.advance();
    }

    const lower = word.toLowerCase();

    if (lower === 'verdadeiro' || lower === 'falso') {
      return {
        type: 'BOOLEAN',
        value: lower,
        line: this.line,
        col: tokenCol
      };
    }

    if (LOGICAL_KEYWORDS.has(lower)) {
      return {
        type: 'OPERATOR',
        value: lower,
        line: this.line,
        col: tokenCol
      };
    }

    if (KEYWORDS.has(lower)) {
      return {
        type: 'KEYWORD',
        value: lower,
        line: this.line,
        col: tokenCol
      };
    }

    return {
      type: 'IDENTIFIER',
      value: word,
      line: this.line,
      col: tokenCol
    };
  }
}
