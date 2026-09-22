import {
  ProgramNode,
  StatementNode,
  ExpressionNode,
  VariableDecl,
  RuntimeValue,
  VariableInfo,
  InterpreterCallbacks,
  ArrayDimension
} from './types';
import { BUILTIN_FUNCTIONS, BUILTIN_CONSTANTS } from './builtins';

interface VariableInternal {
  name: string;
  type: string;
  value: RuntimeValue;
  dimensions?: ArrayDimension[];
  elementType?: string;
  isVector?: boolean;
}

export class BreakException extends Error {
  constructor() {
    super('interrompa');
  }
}

export class Interpreter {
  private program: ProgramNode;
  private callbacks: InterpreterCallbacks;
  private memory: Map<string, VariableInternal> = new Map();
  private isAborted: boolean = false;
  private stepCount: number = 0;
  private maxSteps: number = 100000;

  constructor(program: ProgramNode, callbacks: InterpreterCallbacks) {
    this.program = program;
    this.callbacks = callbacks;
  }

  public abort(): void {
    this.isAborted = true;
  }

  public async run(): Promise<void> {
    this.isAborted = false;
    this.stepCount = 0;
    this.memory.clear();

    try {
      // 1. Initialize variables
      if (this.program.varBlock) {
        for (const decl of this.program.varBlock.declarations) {
          this.initVariableDeclaration(decl);
        }
      }
      this.notifyMemoryUpdate();

      // 2. Execute statements
      for (const stmt of this.program.body) {
        if (this.isAborted) break;
        await this.executeStatement(stmt);
      }
    } catch (err: any) {
      if (err instanceof BreakException) {
        this.callbacks.onError('Comando "interrompa" utilizado fora de uma estrutura de repetição.');
      } else if (!this.isAborted) {
        this.callbacks.onError(err.message || String(err));
      }
    }
  }

  private initVariableDeclaration(decl: VariableDecl): void {
    for (const rawName of decl.names) {
      const key = rawName.toLowerCase();
      let initialVal: RuntimeValue;

      if (decl.type === 'vetor' && decl.dimensions && decl.elementType) {
        initialVal = this.createArrayStructure(decl.dimensions, decl.elementType);
        this.memory.set(key, {
          name: rawName,
          type: `vetor [${decl.dimensions.map((d) => `${d.start}..${d.end}`).join(', ')}] de ${decl.elementType}`,
          value: initialVal,
          dimensions: decl.dimensions,
          elementType: decl.elementType,
          isVector: true
        });
      } else {
        switch (decl.type) {
          case 'inteiro':
            initialVal = 0;
            break;
          case 'real':
            initialVal = 0.0;
            break;
          case 'caractere':
            initialVal = '';
            break;
          case 'logico':
            initialVal = false;
            break;
          default:
            initialVal = 0;
        }
        this.memory.set(key, {
          name: rawName,
          type: decl.type,
          value: initialVal,
          isVector: false
        });
      }
    }
  }

  private createArrayStructure(dimensions: ArrayDimension[], elemType: string): RuntimeValue[] {
    const dim = dimensions[0];
    const size = Math.max(0, dim.end - dim.start + 1);
    const arr: RuntimeValue[] = [];

    let defaultElem: RuntimeValue = 0;
    if (elemType === 'caractere') defaultElem = '';
    else if (elemType === 'logico') defaultElem = false;
    else if (elemType === 'real') defaultElem = 0.0;

    for (let i = 0; i < size; i++) {
      if (dimensions.length > 1) {
        arr.push(this.createArrayStructure(dimensions.slice(1), elemType));
      } else {
        arr.push(defaultElem);
      }
    }
    return arr;
  }

  private notifyMemoryUpdate(): void {
    const memSnapshot: Record<string, VariableInfo> = {};
    this.memory.forEach((item, key) => {
      memSnapshot[key] = {
        name: item.name,
        type: item.type,
        value: item.value,
        displayValue: this.formatValueForMemory(item),
        isVector: item.isVector
      };
    });
    this.callbacks.onMemoryUpdate(memSnapshot);
  }

  private formatValueForMemory(item: VariableInternal): string {
    if (item.isVector && Array.isArray(item.value)) {
      return this.formatArrayValue(item.value);
    }
    if (typeof item.value === 'boolean') {
      return item.value ? 'VERDADEIRO' : 'FALSO';
    }
    if (typeof item.value === 'string') {
      return `"${item.value}"`;
    }
    return String(item.value);
  }

  private formatArrayValue(arr: RuntimeValue[]): string {
    const items = arr.map((v) => {
      if (Array.isArray(v)) return this.formatArrayValue(v);
      if (typeof v === 'boolean') return v ? 'VERDADEIRO' : 'FALSO';
      if (typeof v === 'string') return `"${v}"`;
      return String(v);
    });
    return `[${items.join(', ')}]`;
  }

  private checkStepLimit(line?: number): void {
    this.stepCount++;
    if (this.stepCount > this.maxSteps) {
      throw new Error(`Linha ${line || 0}: Limite de instruções excedido (${this.maxSteps}). Possível laço infinito.`);
    }
  }

  private async executeStatement(stmt: StatementNode): Promise<void> {
    if (this.isAborted) return;
    this.checkStepLimit(stmt.line);

    if (this.callbacks.onStep) {
      this.callbacks.onStep(stmt.line);
    }

    switch (stmt.type) {
      case 'ClearScreen': {
        this.callbacks.onClearScreen();
        break;
      }

      case 'Write': {
        let output = '';
        for (const arg of stmt.args) {
          const val = await this.evaluateExpression(arg.expression);
          let strVal: string;

          if (typeof val === 'boolean') {
            strVal = val ? 'VERDADEIRO' : 'FALSO';
          } else if (typeof val === 'number') {
            if (arg.decimals !== undefined) {
              const decimals = Number(await this.evaluateExpression(arg.decimals));
              strVal = val.toFixed(decimals);
            } else {
              strVal = String(val);
            }
          } else {
            strVal = String(val ?? '');
          }

          if (arg.width !== undefined) {
            const width = Number(await this.evaluateExpression(arg.width));
            strVal = strVal.padStart(width, ' ');
          }

          output += strVal;
        }

        this.callbacks.onOutput(output, stmt.isNewLine);
        break;
      }

      case 'Read': {
        for (const target of stmt.targets) {
          if (this.isAborted) return;
          const varName = target.name;
          const inputStr = await this.callbacks.onInput(varName);
          if (this.isAborted) return;

          const key = varName.toLowerCase();
          const variable = this.memory.get(key);
          if (!variable) {
            throw new Error(`Linha ${stmt.line}: Variável '${varName}' não declarada na seção 'var'.`);
          }

          let parsedVal: RuntimeValue;
          let targetType = variable.type;
          if (variable.isVector && variable.elementType) {
            targetType = variable.elementType;
          }

          if (targetType.includes('inteiro')) {
            parsedVal = parseInt(inputStr.trim(), 10);
            if (isNaN(parsedVal)) parsedVal = 0;
          } else if (targetType.includes('real')) {
            parsedVal = parseFloat(inputStr.trim().replace(',', '.'));
            if (isNaN(parsedVal)) parsedVal = 0.0;
          } else if (targetType.includes('logico')) {
            const lower = inputStr.trim().toLowerCase();
            parsedVal = lower === 'verdadeiro' || lower === 'v' || lower === 'true' || lower === '1';
          } else {
            parsedVal = inputStr;
          }

          if (target.indices && target.indices.length > 0) {
            await this.setArrayValue(variable, target.indices, parsedVal, stmt.line);
          } else {
            variable.value = parsedVal;
          }

          this.notifyMemoryUpdate();
        }
        break;
      }

      case 'Assign': {
        const value = await this.evaluateExpression(stmt.value);
        const key = stmt.target.name.toLowerCase();
        let variable = this.memory.get(key);

        if (!variable) {
          // In VisualG, variables must be declared in 'var', but to be tolerant or show clean error:
          throw new Error(`Linha ${stmt.line}: Variável '${stmt.target.name}' não foi declarada.`);
        }

        let coercedValue = value;
        let expectedType = variable.type;
        if (variable.isVector && variable.elementType) {
          expectedType = variable.elementType;
        }

        if (expectedType.includes('inteiro') && typeof value === 'number') {
          coercedValue = Math.trunc(value);
        } else if (expectedType.includes('real') && typeof value === 'number') {
          coercedValue = Number(value);
        } else if (expectedType.includes('caractere')) {
          coercedValue = String(value);
        } else if (expectedType.includes('logico')) {
          coercedValue = Boolean(value);
        }

        if (stmt.target.indices && stmt.target.indices.length > 0) {
          await this.setArrayValue(variable, stmt.target.indices, coercedValue, stmt.line);
        } else {
          variable.value = coercedValue;
        }

        this.notifyMemoryUpdate();
        break;
      }

      case 'If': {
        const condition = await this.evaluateExpression(stmt.condition);
        if (condition) {
          for (const s of stmt.thenBranch) {
            if (this.isAborted) return;
            await this.executeStatement(s);
          }
        } else if (stmt.elseBranch) {
          for (const s of stmt.elseBranch) {
            if (this.isAborted) return;
            await this.executeStatement(s);
          }
        }
        break;
      }

      case 'Choose': {
        const discVal = await this.evaluateExpression(stmt.discriminant);
        let matched = false;

        for (const c of stmt.cases) {
          for (const valExpr of c.values) {
            const caseVal = await this.evaluateExpression(valExpr);
            if (caseVal === discVal) {
              matched = true;
              break;
            }
          }

          if (matched) {
            for (const s of c.body) {
              if (this.isAborted) return;
              await this.executeStatement(s);
            }
            break;
          }
        }

        if (!matched && stmt.defaultBranch) {
          for (const s of stmt.defaultBranch) {
            if (this.isAborted) return;
            await this.executeStatement(s);
          }
        }
        break;
      }

      case 'For': {
        const startVal = Number(await this.evaluateExpression(stmt.from));
        const endVal = Number(await this.evaluateExpression(stmt.to));
        let stepVal = 1;

        if (stmt.step) {
          stepVal = Number(await this.evaluateExpression(stmt.step));
        } else if (startVal > endVal) {
          stepVal = -1;
        }

        const key = stmt.variable.toLowerCase();
        let loopVar = this.memory.get(key);
        if (!loopVar) {
          throw new Error(`Linha ${stmt.line}: Variável de controle '${stmt.variable}' não declarada.`);
        }

        let curr = startVal;
        loopVar.value = curr;
        this.notifyMemoryUpdate();

        const shouldContinue = (c: number) => (stepVal > 0 ? c <= endVal : c >= endVal);

        while (shouldContinue(curr)) {
          if (this.isAborted) return;
          this.checkStepLimit(stmt.line);

          try {
            for (const s of stmt.body) {
              if (this.isAborted) return;
              await this.executeStatement(s);
            }
          } catch (e) {
            if (e instanceof BreakException) {
              break;
            }
            throw e;
          }

          curr += stepVal;
          loopVar.value = curr;
          this.notifyMemoryUpdate();
        }
        break;
      }

      case 'While': {
        while (Boolean(await this.evaluateExpression(stmt.condition))) {
          if (this.isAborted) return;
          this.checkStepLimit(stmt.line);

          try {
            for (const s of stmt.body) {
              if (this.isAborted) return;
              await this.executeStatement(s);
            }
          } catch (e) {
            if (e instanceof BreakException) {
              break;
            }
            throw e;
          }
        }
        break;
      }

      case 'Repeat': {
        // repita ... ate <condicao>
        // Repeats until condition is true (so it loops while condition is false!)
        do {
          if (this.isAborted) return;
          this.checkStepLimit(stmt.line);

          try {
            for (const s of stmt.body) {
              if (this.isAborted) return;
              await this.executeStatement(s);
            }
          } catch (e) {
            if (e instanceof BreakException) {
              break;
            }
            throw e;
          }
        } while (!Boolean(await this.evaluateExpression(stmt.condition)));
        break;
      }

      case 'Break': {
        throw new BreakException();
      }

      case 'ExpressionStatement': {
        await this.evaluateExpression(stmt.expression);
        break;
      }
    }
  }

  private async setArrayValue(
    variable: VariableInternal,
    indexExprs: ExpressionNode[],
    value: RuntimeValue,
    line: number
  ): Promise<void> {
    if (!variable.dimensions || variable.dimensions.length === 0) {
      throw new Error(`Linha ${line}: '${variable.name}' não é um vetor.`);
    }

    if (indexExprs.length !== variable.dimensions.length) {
      throw new Error(
        `Linha ${line}: Dimensões incompatíveis para '${variable.name}'. Esperado ${variable.dimensions.length}, recebido ${indexExprs.length}.`
      );
    }

    let targetArr: any = variable.value;
    for (let d = 0; d < indexExprs.length; d++) {
      const idx = Number(await this.evaluateExpression(indexExprs[d]));
      const dim: ArrayDimension = variable.dimensions![d];

      if (idx < dim.start || idx > dim.end) {
        throw new Error(
          `Linha ${line}: Índice [${idx}] fora dos limites do vetor [${dim.start}..${dim.end}] para '${variable.name}'.`
        );
      }

      const offset = idx - dim.start;
      if (d === indexExprs.length - 1) {
        targetArr[offset] = value;
      } else {
        targetArr = targetArr[offset];
      }
    }
  }

  private async getArrayValue(
    variable: VariableInternal,
    indexExprs: ExpressionNode[],
    line: number
  ): Promise<RuntimeValue> {
    if (!variable.dimensions || variable.dimensions.length === 0) {
      throw new Error(`Linha ${line}: '${variable.name}' não é um vetor.`);
    }

    let targetArr: any = variable.value;
    for (let d = 0; d < indexExprs.length; d++) {
      const idx = Number(await this.evaluateExpression(indexExprs[d]));
      const dim: ArrayDimension = variable.dimensions![d];

      if (idx < dim.start || idx > dim.end) {
        throw new Error(
          `Linha ${line}: Índice [${idx}] fora dos limites do vetor [${dim.start}..${dim.end}] para '${variable.name}'.`
        );
      }

      const offset = idx - dim.start;
      targetArr = targetArr[offset];
    }
    return targetArr;
  }

  public async evaluateExpression(node: ExpressionNode): Promise<RuntimeValue> {
    if (this.isAborted) return 0;

    switch (node.type) {
      case 'Literal':
        return node.value;

      case 'VariableAccess': {
        const key = node.name.toLowerCase();
        if (key in BUILTIN_CONSTANTS) {
          return BUILTIN_CONSTANTS[key];
        }

        const variable = this.memory.get(key);
        if (!variable) {
          throw new Error(`Linha ${node.line}: Variável '${node.name}' não foi declarada.`);
        }

        if (node.indices && node.indices.length > 0) {
          return await this.getArrayValue(variable, node.indices, node.line);
        }

        return variable.value;
      }

      case 'FunctionCall': {
        const funcName = node.name.toLowerCase();
        const func = BUILTIN_FUNCTIONS[funcName];
        if (!func) {
          throw new Error(`Linha ${node.line}: Função nativa '${node.name}' não reconhecida.`);
        }

        const evaluatedArgs: RuntimeValue[] = [];
        for (const arg of node.args) {
          evaluatedArgs.push(await this.evaluateExpression(arg));
        }

        try {
          return func(...evaluatedArgs);
        } catch (e: any) {
          throw new Error(`Linha ${node.line}: Erro na execução da função '${node.name}': ${e.message}`);
        }
      }

      case 'UnaryOp': {
        const operand = await this.evaluateExpression(node.operand);
        if (node.operator === '-') {
          return -Number(operand);
        }
        if (node.operator === 'nao') {
          return !Boolean(operand);
        }
        return operand;
      }

      case 'BinaryOp': {
        const left = await this.evaluateExpression(node.left);
        const right = await this.evaluateExpression(node.right);

        switch (node.operator) {
          case '+':
            if (typeof left === 'string' || typeof right === 'string') {
              return String(left) + String(right);
            }
            return Number(left) + Number(right);

          case '-':
            return Number(left) - Number(right);

          case '*':
            return Number(left) * Number(right);

          case '/': {
            const divisor = Number(right);
            if (divisor === 0) {
              throw new Error(`Linha ${node.line}: Divisão por zero.`);
            }
            return Number(left) / divisor;
          }

          case '\\': {
            // Divisão inteira
            const divisor = Number(right);
            if (divisor === 0) {
              throw new Error(`Linha ${node.line}: Divisão por zero.`);
            }
            return Math.trunc(Number(left) / divisor);
          }

          case 'mod': {
            const divisor = Number(right);
            if (divisor === 0) {
              throw new Error(`Linha ${node.line}: Módulo por zero.`);
            }
            return Number(left) % divisor;
          }

          case '^':
            return Math.pow(Number(left), Number(right));

          case '=':
            return left === right;

          case '<>':
            return left !== right;

          case '<':
            return Number(left) < Number(right);

          case '<=':
            return Number(left) <= Number(right);

          case '>':
            return Number(left) > Number(right);

          case '>=':
            return Number(left) >= Number(right);

          case 'e':
            return Boolean(left) && Boolean(right);

          case 'ou':
            return Boolean(left) || Boolean(right);

          case 'xou':
            return Boolean(left) !== Boolean(right);

          default:
            throw new Error(`Linha ${node.line}: Operador '${node.operator}' não suportado.`);
        }
      }
    }
  }
}
