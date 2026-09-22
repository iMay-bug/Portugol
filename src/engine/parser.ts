import {
  Token,
  ProgramNode,
  VarBlockNode,
  VariableDecl,
  DataType,
  StatementNode,
  AssignNode,
  WriteNode,
  WriteArgument,
  ReadNode,
  IfNode,
  ChooseNode,
  CaseClause,
  ForNode,
  WhileNode,
  RepeatNode,
  BreakNode,
  ClearScreenNode,
  ExpressionNode,
  LiteralNode,
  VariableAccessNode,
  BinaryOpNode,
  UnaryOpNode,
  FunctionCallNode,
  ArrayDimension
} from './types';
import { BUILTIN_FUNCTIONS, BUILTIN_CONSTANTS } from './builtins';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(): ProgramNode {
    let name = 'Sem Nome';
    let line = 1;

    // Optional: algoritmo "nome"
    if (this.matchKeyword('algoritmo')) {
      line = this.previous().line;
      if (this.check('STRING') || this.check('IDENTIFIER')) {
        name = this.advance().value;
      }
    }

    // Optional var block
    let varBlock: VarBlockNode | undefined;
    if (this.matchKeyword('var')) {
      varBlock = this.parseVarBlock();
    }

    // Expect 'inicio' (or tolerate if user started directly with statements)
    if (this.matchKeyword('inicio')) {
      // consumed
    }

    // Parse statements until 'fimalgoritmo' or EOF
    const body: StatementNode[] = [];
    while (!this.isAtEnd() && !this.checkKeyword('fimalgoritmo')) {
      // Skip extra semicolons or empty tokens if any
      if (this.matchPunctuation(';')) {
        continue;
      }
      const stmt = this.parseStatement();
      if (stmt) {
        body.push(stmt);
      }
    }

    if (this.matchKeyword('fimalgoritmo')) {
      // consumed
    }

    return {
      type: 'Program',
      name,
      varBlock,
      body,
      line
    };
  }

  // --- Var Block Parsing ---
  private parseVarBlock(): VarBlockNode {
    const startLine = this.previous().line;
    const declarations: VariableDecl[] = [];

    // Continue until 'inicio', 'algoritmo', 'fimalgoritmo' or EOF
    while (
      !this.isAtEnd() &&
      !this.checkKeyword('inicio') &&
      !this.checkKeyword('fimalgoritmo') &&
      !this.checkKeyword('procedimento') &&
      !this.checkKeyword('funcao')
    ) {
      if (this.matchPunctuation(';')) {
        continue;
      }

      // If we see an identifier, it's a variable declaration line: a, b, c : tipo
      if (this.check('IDENTIFIER')) {
        const decl = this.parseVariableDeclarationLine();
        if (decl) {
          declarations.push(decl);
        }
      } else {
        // If not an identifier, we might have hit 'inicio' without keyword match or invalid syntax
        break;
      }
    }

    return {
      type: 'VarBlock',
      declarations,
      line: startLine
    };
  }

  private parseVariableDeclarationLine(): VariableDecl | null {
    const line = this.peek().line;
    const names: string[] = [];

    // Read comma-separated variable names
    do {
      if (!this.check('IDENTIFIER')) {
        throw new Error(`Linha ${this.peek().line}: Esperado nome de variável na seção 'var'.`);
      }
      names.push(this.advance().value);
    } while (this.matchPunctuation(','));

    // Expect ':'
    if (!this.matchPunctuation(':')) {
      throw new Error(`Linha ${line}: Esperado ':' após o nome da(s) variável(is).`);
    }

    // Check if it's a vector: 'vetor [1..10] de tipo'
    if (this.matchKeyword('vetor')) {
      if (!this.matchPunctuation('[')) {
        throw new Error(`Linha ${this.peek().line}: Esperado '[' após a palavra 'vetor'.`);
      }

      const dimensions: ArrayDimension[] = [];
      do {
        const start = this.parseIntegerLiteral('início do intervalo do vetor');
        if (!this.matchOperator('..')) {
          throw new Error(`Linha ${this.peek().line}: Esperado '..' no intervalo do vetor (ex: 1..10).`);
        }
        const end = this.parseIntegerLiteral('fim do intervalo do vetor');
        dimensions.push({ start, end });
      } while (this.matchPunctuation(','));

      if (!this.matchPunctuation(']')) {
        throw new Error(`Linha ${this.peek().line}: Esperado ']' após as dimensões do vetor.`);
      }

      // Expect 'de'
      if (!this.matchKeyword('de')) {
        throw new Error(`Linha ${this.peek().line}: Esperado 'de' após as dimensões do vetor.`);
      }

      const elemType = this.parseDataType();
      return {
        names,
        type: 'vetor',
        dimensions,
        elementType: elemType,
        line
      };
    }

    // Normal scalar type
    const type = this.parseDataType();
    return {
      names,
      type,
      line
    };
  }

  private parseDataType(): DataType {
    const tok = this.peek();
    if (tok.type === 'KEYWORD') {
      const val = tok.value.toLowerCase();
      if (val === 'inteiro' || val === 'real' || val === 'logico') {
        this.advance();
        return val as DataType;
      }
      if (val === 'caractere' || val === 'caracter') {
        this.advance();
        return 'caractere';
      }
    }
    throw new Error(`Linha ${tok.line}: Tipo de dado inválido '${tok.value}'. Esperado inteiro, real, caractere ou logico.`);
  }

  private parseIntegerLiteral(context: string): number {
    let sign = 1;
    if (this.matchOperator('-')) {
      sign = -1;
    } else if (this.matchOperator('+')) {
      sign = 1;
    }

    if (!this.check('NUMBER')) {
      throw new Error(`Linha ${this.peek().line}: Esperado número inteiro para ${context}.`);
    }
    const val = parseInt(this.advance().value, 10);
    return sign * val;
  }

  // --- Statement Parsing ---
  private parseStatement(): StatementNode | null {
    if (this.isAtEnd()) return null;

    const token = this.peek();

    // 1. escreva / escreval
    if (this.checkKeyword('escreva') || this.checkKeyword('escreval')) {
      return this.parseWriteStatement();
    }

    // 2. leia
    if (this.checkKeyword('leia')) {
      return this.parseReadStatement();
    }

    // 3. limpatela
    if (this.matchKeyword('limpatela')) {
      return { type: 'ClearScreen', line: token.line };
    }

    // 4. se ... entao ... senao ... fimse
    if (this.checkKeyword('se')) {
      return this.parseIfStatement();
    }

    // 5. escolha ... caso ... outrocaso ... fimescolha
    if (this.checkKeyword('escolha')) {
      return this.parseChooseStatement();
    }

    // 6. para ... de ... ate ... faca ... fimpara
    if (this.checkKeyword('para')) {
      return this.parseForStatement();
    }

    // 7. enquanto ... faca ... fimenquanto
    if (this.checkKeyword('enquanto')) {
      return this.parseWhileStatement();
    }

    // 8. repita ... ate
    if (this.checkKeyword('repita')) {
      return this.parseRepeatStatement();
    }

    // 9. interrompa
    if (this.matchKeyword('interrompa')) {
      return { type: 'Break', line: token.line };
    }

    // 10. Assignment: var <- expr OR array[i] <- expr
    if (this.check('IDENTIFIER')) {
      return this.parseAssignmentOrCall();
    }

    // Skip unknown or rogue token to prevent infinite loop
    this.advance();
    return null;
  }

  private parseWriteStatement(): WriteNode {
    const kwToken = this.advance();
    const isNewLine = kwToken.value.toLowerCase() === 'escreval';

    if (!this.matchPunctuation('(')) {
      throw new Error(`Linha ${kwToken.line}: Esperado '(' após '${kwToken.value}'.`);
    }

    const args: WriteArgument[] = [];
    if (!this.checkPunctuation(')')) {
      do {
        const expression = this.parseExpression();
        let width: ExpressionNode | undefined;
        let decimals: ExpressionNode | undefined;

        // VisualG supports formatting like: x:10:2
        if (this.matchPunctuation(':')) {
          width = this.parsePrimary();
          if (this.matchPunctuation(':')) {
            decimals = this.parsePrimary();
          }
        }

        args.push({ expression, width, decimals });
      } while (this.matchPunctuation(','));
    }

    if (!this.matchPunctuation(')')) {
      throw new Error(`Linha ${this.peek().line}: Esperado ')' ao fechar '${kwToken.value}'.`);
    }

    return {
      type: 'Write',
      isNewLine,
      args,
      line: kwToken.line
    };
  }

  private parseReadStatement(): ReadNode {
    const kwToken = this.advance(); // leia

    if (!this.matchPunctuation('(')) {
      throw new Error(`Linha ${kwToken.line}: Esperado '(' após 'leia'.`);
    }

    const targets: VariableAccessNode[] = [];
    do {
      if (!this.check('IDENTIFIER')) {
        throw new Error(`Linha ${this.peek().line}: Esperado nome de variável no comando 'leia'.`);
      }
      const target = this.parseVariableAccess();
      targets.push(target);
    } while (this.matchPunctuation(','));

    if (!this.matchPunctuation(')')) {
      throw new Error(`Linha ${this.peek().line}: Esperado ')' ao fechar 'leia'.`);
    }

    return {
      type: 'Read',
      targets,
      line: kwToken.line
    };
  }

  private parseIfStatement(): IfNode {
    const seToken = this.advance(); // se
    const condition = this.parseExpression();

    if (!this.matchKeyword('entao')) {
      throw new Error(`Linha ${this.peek().line}: Esperado 'entao' após condição do 'se'.`);
    }

    const thenBranch: StatementNode[] = [];
    while (
      !this.isAtEnd() &&
      !this.checkKeyword('senao') &&
      !this.checkKeyword('fimse')
    ) {
      if (this.matchPunctuation(';')) continue;
      const stmt = this.parseStatement();
      if (stmt) thenBranch.push(stmt);
    }

    let elseBranch: StatementNode[] | undefined;
    if (this.matchKeyword('senao')) {
      elseBranch = [];
      while (!this.isAtEnd() && !this.checkKeyword('fimse')) {
        if (this.matchPunctuation(';')) continue;
        const stmt = this.parseStatement();
        if (stmt) elseBranch.push(stmt);
      }
    }

    if (!this.matchKeyword('fimse')) {
      throw new Error(`Linha ${this.peek().line}: Esperado 'fimse' para fechar o bloco 'se'.`);
    }

    return {
      type: 'If',
      condition,
      thenBranch,
      elseBranch,
      line: seToken.line
    };
  }

  private parseChooseStatement(): ChooseNode {
    const escolhaToken = this.advance(); // escolha
    const discriminant = this.parseExpression();

    const cases: CaseClause[] = [];
    let defaultBranch: StatementNode[] | undefined;

    while (!this.isAtEnd() && !this.checkKeyword('fimescolha')) {
      if (this.matchKeyword('caso')) {
        const caseLine = this.previous().line;
        const values: ExpressionNode[] = [];
        do {
          values.push(this.parseExpression());
        } while (this.matchPunctuation(','));

        const body: StatementNode[] = [];
        while (
          !this.isAtEnd() &&
          !this.checkKeyword('caso') &&
          !this.checkKeyword('outrocaso') &&
          !this.checkKeyword('fimescolha')
        ) {
          if (this.matchPunctuation(';')) continue;
          const stmt = this.parseStatement();
          if (stmt) body.push(stmt);
        }

        cases.push({ values, body, line: caseLine });
      } else if (this.matchKeyword('outrocaso')) {
        defaultBranch = [];
        while (!this.isAtEnd() && !this.checkKeyword('fimescolha')) {
          if (this.matchPunctuation(';')) continue;
          const stmt = this.parseStatement();
          if (stmt) defaultBranch.push(stmt);
        }
      } else {
        // Skip unexpected token
        this.advance();
      }
    }

    if (!this.matchKeyword('fimescolha')) {
      throw new Error(`Linha ${this.peek().line}: Esperado 'fimescolha' para fechar o bloco 'escolha'.`);
    }

    return {
      type: 'Choose',
      discriminant,
      cases,
      defaultBranch,
      line: escolhaToken.line
    };
  }

  private parseForStatement(): ForNode {
    const paraToken = this.advance(); // para
    if (!this.check('IDENTIFIER')) {
      throw new Error(`Linha ${this.peek().line}: Esperado nome de variável após 'para'.`);
    }
    const variable = this.advance().value;

    if (!this.matchKeyword('de')) {
      throw new Error(`Linha ${this.peek().line}: Esperado 'de' no comando 'para'.`);
    }
    const from = this.parseExpression();

    if (!this.matchKeyword('ate')) {
      throw new Error(`Linha ${this.peek().line}: Esperado 'ate' no comando 'para'.`);
    }
    const to = this.parseExpression();

    let step: ExpressionNode | undefined;
    if (this.matchKeyword('passo')) {
      step = this.parseExpression();
    }

    if (!this.matchKeyword('faca')) {
      throw new Error(`Linha ${this.peek().line}: Esperado 'faca' no comando 'para'.`);
    }

    const body: StatementNode[] = [];
    while (!this.isAtEnd() && !this.checkKeyword('fimpara')) {
      if (this.matchPunctuation(';')) continue;
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    if (!this.matchKeyword('fimpara')) {
      throw new Error(`Linha ${this.peek().line}: Esperado 'fimpara' para fechar o laço 'para'.`);
    }

    return {
      type: 'For',
      variable,
      from,
      to,
      step,
      body,
      line: paraToken.line
    };
  }

  private parseWhileStatement(): WhileNode {
    const enquantoToken = this.advance(); // enquanto
    const condition = this.parseExpression();

    if (!this.matchKeyword('faca')) {
      throw new Error(`Linha ${this.peek().line}: Esperado 'faca' após a condição do 'enquanto'.`);
    }

    const body: StatementNode[] = [];
    while (!this.isAtEnd() && !this.checkKeyword('fimenquanto')) {
      if (this.matchPunctuation(';')) continue;
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    if (!this.matchKeyword('fimenquanto')) {
      throw new Error(`Linha ${this.peek().line}: Esperado 'fimenquanto' para fechar o laço 'enquanto'.`);
    }

    return {
      type: 'While',
      condition,
      body,
      line: enquantoToken.line
    };
  }

  private parseRepeatStatement(): RepeatNode {
    const repitaToken = this.advance(); // repita

    const body: StatementNode[] = [];
    while (!this.isAtEnd() && !this.checkKeyword('ate')) {
      if (this.matchPunctuation(';')) continue;
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    if (!this.matchKeyword('ate')) {
      throw new Error(`Linha ${this.peek().line}: Esperado 'ate' para fechar o laço 'repita'.`);
    }

    const condition = this.parseExpression();

    return {
      type: 'Repeat',
      condition,
      body,
      line: repitaToken.line
    };
  }

  private parseAssignmentOrCall(): StatementNode {
    const line = this.peek().line;
    const target = this.parseVariableAccess();

    if (this.matchOperator('<-')) {
      const value = this.parseExpression();
      return {
        type: 'Assign',
        target,
        value,
        line
      };
    }

    // If it was just an expression statement
    return {
      type: 'ExpressionStatement',
      expression: target,
      line
    };
  }

  private parseVariableAccess(): VariableAccessNode {
    const tok = this.advance();
    const name = tok.value;
    const line = tok.line;

    let indices: ExpressionNode[] | undefined;
    if (this.matchPunctuation('[')) {
      indices = [];
      do {
        indices.push(this.parseExpression());
      } while (this.matchPunctuation(','));

      if (!this.matchPunctuation(']')) {
        throw new Error(`Linha ${this.peek().line}: Esperado ']' ao fechar índices do vetor.`);
      }
    }

    return {
      type: 'VariableAccess',
      name,
      indices,
      line
    };
  }

  // --- Expressions Parsing (Precedence Climbing) ---
  public parseExpression(): ExpressionNode {
    return this.parseLogicalOr();
  }

  private parseLogicalOr(): ExpressionNode {
    let expr = this.parseLogicalAnd();

    while (this.matchOperator('ou') || this.matchOperator('xou')) {
      const op = this.previous().value.toLowerCase();
      const right = this.parseLogicalAnd();
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private parseLogicalAnd(): ExpressionNode {
    let expr = this.parseEquality();

    while (this.matchOperator('e')) {
      const op = this.previous().value.toLowerCase();
      const right = this.parseEquality();
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private parseEquality(): ExpressionNode {
    let expr = this.parseComparison();

    while (this.matchOperator('=') || this.matchOperator('<>') || this.matchOperator('==') || this.matchOperator('!=')) {
      let op = this.previous().value;
      if (op === '==') op = '=';
      if (op === '!=') op = '<>';
      const right = this.parseComparison();
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private parseComparison(): ExpressionNode {
    let expr = this.parseAdditive();

    while (
      this.matchOperator('<') ||
      this.matchOperator('<=') ||
      this.matchOperator('>') ||
      this.matchOperator('>=')
    ) {
      const op = this.previous().value;
      const right = this.parseAdditive();
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private parseAdditive(): ExpressionNode {
    let expr = this.parseMultiplicative();

    while (this.matchOperator('+') || this.matchOperator('-')) {
      const op = this.previous().value;
      const right = this.parseMultiplicative();
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private parseMultiplicative(): ExpressionNode {
    let expr = this.parsePower();

    while (
      this.matchOperator('*') ||
      this.matchOperator('/') ||
      this.matchOperator('\\') ||
      this.matchOperator('mod') ||
      this.matchOperator('%') ||
      this.matchOperator('div')
    ) {
      let op = this.previous().value.toLowerCase();
      if (op === '%') op = 'mod';
      if (op === 'div') op = '\\';
      const right = this.parsePower();
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private parsePower(): ExpressionNode {
    let expr = this.parseUnary();

    while (this.matchOperator('^')) {
      const op = this.previous().value;
      const right = this.parseUnary();
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right,
        line: expr.line
      };
    }

    return expr;
  }

  private parseUnary(): ExpressionNode {
    if (this.matchOperator('-') || this.matchOperator('nao') || this.matchOperator('+')) {
      const op = this.previous().value.toLowerCase();
      const operand = this.parseUnary();
      if (op === '+') return operand; // ignore unary plus
      return {
        type: 'UnaryOp',
        operator: op,
        operand,
        line: this.previous().line
      };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): ExpressionNode {
    const token = this.peek();

    // Number literal
    if (this.match('NUMBER')) {
      const raw = this.previous().value;
      const isFloat = raw.includes('.');
      return {
        type: 'Literal',
        value: isFloat ? parseFloat(raw) : parseInt(raw, 10),
        dataType: isFloat ? 'real' : 'inteiro',
        line: token.line
      };
    }

    // String literal
    if (this.match('STRING')) {
      return {
        type: 'Literal',
        value: this.previous().value,
        dataType: 'caractere',
        line: token.line
      };
    }

    // Boolean literal
    if (this.match('BOOLEAN')) {
      const val = this.previous().value.toLowerCase();
      return {
        type: 'Literal',
        value: val === 'verdadeiro',
        dataType: 'logico',
        line: token.line
      };
    }

    // Parentheses (expr)
    if (this.matchPunctuation('(')) {
      const expr = this.parseExpression();
      if (!this.matchPunctuation(')')) {
        throw new Error(`Linha ${this.peek().line}: Esperado ')' após a expressão.`);
      }
      return expr;
    }

    // Identifier: function call or variable access or constant
    if (this.match('IDENTIFIER')) {
      const name = this.previous().value;
      const lowerName = name.toLowerCase();

      // Check if it's a function call: func(...)
      if (this.matchPunctuation('(')) {
        const args: ExpressionNode[] = [];
        if (!this.checkPunctuation(')')) {
          do {
            args.push(this.parseExpression());
          } while (this.matchPunctuation(','));
        }

        if (!this.matchPunctuation(')')) {
          throw new Error(`Linha ${this.peek().line}: Esperado ')' após argumentos da função '${name}'.`);
        }

        return {
          type: 'FunctionCall',
          name,
          args,
          line: token.line
        };
      }

      // Check for array access: v[i] or mat[i, j]
      if (this.matchPunctuation('[')) {
        const indices: ExpressionNode[] = [];
        do {
          indices.push(this.parseExpression());
        } while (this.matchPunctuation(','));

        if (!this.matchPunctuation(']')) {
          throw new Error(`Linha ${this.peek().line}: Esperado ']' nos índices de '${name}'.`);
        }

        return {
          type: 'VariableAccess',
          name,
          indices,
          line: token.line
        };
      }

      // Check for builtin constant e.g. pi
      if (lowerName in BUILTIN_CONSTANTS) {
        return {
          type: 'Literal',
          value: BUILTIN_CONSTANTS[lowerName],
          dataType: 'real',
          line: token.line
        };
      }

      // Normal variable reference
      return {
        type: 'VariableAccess',
        name,
        line: token.line
      };
    }

    throw new Error(`Linha ${token.line}: Expressão inesperada '${token.value || token.type}'.`);
  }

  // --- Helper Methods ---
  private check(type: string): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private checkKeyword(keyword: string): boolean {
    if (this.isAtEnd()) return false;
    const tok = this.peek();
    return tok.type === 'KEYWORD' && tok.value.toLowerCase() === keyword.toLowerCase();
  }

  private checkPunctuation(punct: string): boolean {
    if (this.isAtEnd()) return false;
    const tok = this.peek();
    return tok.type === 'PUNCTUATION' && tok.value === punct;
  }

  private match(type: string): boolean {
    if (this.check(type)) {
      this.advance();
      return true;
    }
    return false;
  }

  private matchKeyword(keyword: string): boolean {
    if (this.checkKeyword(keyword)) {
      this.advance();
      return true;
    }
    return false;
  }

  private matchPunctuation(punct: string): boolean {
    if (this.checkPunctuation(punct)) {
      this.advance();
      return true;
    }
    return false;
  }

  private matchOperator(op: string): boolean {
    if (this.isAtEnd()) return false;
    const tok = this.peek();
    if (tok.type === 'OPERATOR' && tok.value.toLowerCase() === op.toLowerCase()) {
      this.advance();
      return true;
    }
    return false;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length || this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}
