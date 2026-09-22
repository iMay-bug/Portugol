import { Lexer } from './lexer';
import { Parser } from './parser';
import { Interpreter } from './interpreter';
import { InterpreterCallbacks, VariableInfo } from './types';

export class VisualGRunner {
  private interpreter: Interpreter | null = null;
  private inputResolver: ((val: string) => void) | null = null;
  private isRunning: boolean = false;

  public get active(): boolean {
    return this.isRunning;
  }

  public async execute(code: string, callbacks: InterpreterCallbacks): Promise<void> {
    this.stop();
    this.isRunning = true;

    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();

      const parser = new Parser(tokens);
      const program = parser.parse();

      this.interpreter = new Interpreter(program, {
        ...callbacks,
        onInput: async (varName) => {
          return new Promise<string>((resolve) => {
            this.inputResolver = resolve;
            callbacks.onInput(varName);
          });
        }
      });

      await this.interpreter.run();
    } catch (err: any) {
      callbacks.onError(err.message || String(err));
    } finally {
      this.isRunning = false;
      this.interpreter = null;
      this.inputResolver = null;
    }
  }

  public provideInput(value: string): void {
    if (this.inputResolver) {
      const resolver = this.inputResolver;
      this.inputResolver = null;
      resolver(value);
    }
  }

  public stop(): void {
    if (this.interpreter) {
      this.interpreter.abort();
      this.interpreter = null;
    }
    if (this.inputResolver) {
      this.inputResolver('');
      this.inputResolver = null;
    }
    this.isRunning = false;
  }

  /**
   * Run code with predetermined inputs (for automated testing in exercises)
   */
  public static async runHeadless(
    code: string,
    inputs: string[] = []
  ): Promise<{ output: string; memory: Record<string, VariableInfo>; error?: string }> {
    let outputAccumulator = '';
    let memorySnapshot: Record<string, VariableInfo> = {};
    let errorMsg: string | undefined;
    let inputIndex = 0;

    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const program = parser.parse();

      const interpreter = new Interpreter(program, {
        onOutput: (text, isNewLine) => {
          outputAccumulator += text + (isNewLine ? '\n' : '');
        },
        onInput: async () => {
          const val = inputs[inputIndex++] ?? '';
          return val;
        },
        onMemoryUpdate: (mem) => {
          memorySnapshot = mem;
        },
        onError: (err) => {
          errorMsg = err;
        },
        onClearScreen: () => {
          outputAccumulator = '';
        }
      });

      await interpreter.run();
    } catch (err: any) {
      errorMsg = err.message || String(err);
    }

    return {
      output: outputAccumulator,
      memory: memorySnapshot,
      error: errorMsg
    };
  }
}
