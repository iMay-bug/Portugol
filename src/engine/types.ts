export type DataType = 'inteiro' | 'real' | 'caractere' | 'logico' | 'vetor';

export interface ArrayDimension {
  start: number;
  end: number;
}

export interface VariableDecl {
  names: string[];
  type: DataType;
  dimensions?: ArrayDimension[]; // e.g. [1..10]
  elementType?: DataType;       // for vectors
  line: number;
}

export type RuntimeValue = number | string | boolean | RuntimeValue[];

export interface VariableInfo {
  name: string;
  type: string;
  value: RuntimeValue;
  displayValue: string;
  isVector?: boolean;
}

export type TokenType =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'STRING'
  | 'BOOLEAN'
  | 'OPERATOR'
  | 'PUNCTUATION'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

// AST Nodes
export type ASTNode =
  | ProgramNode
  | VarBlockNode
  | AssignNode
  | WriteNode
  | ReadNode
  | IfNode
  | ChooseNode
  | ForNode
  | WhileNode
  | RepeatNode
  | BreakNode
  | ClearScreenNode
  | ExpressionNode;

export interface ProgramNode {
  type: 'Program';
  name: string;
  varBlock?: VarBlockNode;
  body: StatementNode[];
  line: number;
}

export interface VarBlockNode {
  type: 'VarBlock';
  declarations: VariableDecl[];
  line: number;
}

export type StatementNode =
  | AssignNode
  | WriteNode
  | ReadNode
  | IfNode
  | ChooseNode
  | ForNode
  | WhileNode
  | RepeatNode
  | BreakNode
  | ClearScreenNode
  | ExpressionStatementNode;

export interface ExpressionStatementNode {
  type: 'ExpressionStatement';
  expression: ExpressionNode;
  line: number;
}

export interface AssignNode {
  type: 'Assign';
  target: VariableAccessNode;
  value: ExpressionNode;
  line: number;
}

export interface VariableAccessNode {
  type: 'VariableAccess';
  name: string;
  indices?: ExpressionNode[]; // for v[i] or mat[i, j]
  line: number;
}

export interface WriteArgument {
  expression: ExpressionNode;
  width?: ExpressionNode;       // for e.g. x:10:2 -> width is 10
  decimals?: ExpressionNode;    // for e.g. x:10:2 -> decimals is 2
}

export interface WriteNode {
  type: 'Write';
  isNewLine: boolean; // true for escreval, false for escreva
  args: WriteArgument[];
  line: number;
}

export interface ReadNode {
  type: 'Read';
  targets: VariableAccessNode[];
  line: number;
}

export interface IfNode {
  type: 'If';
  condition: ExpressionNode;
  thenBranch: StatementNode[];
  elseBranch?: StatementNode[];
  line: number;
}

export interface CaseClause {
  values: ExpressionNode[];
  body: StatementNode[];
  line: number;
}

export interface ChooseNode {
  type: 'Choose';
  discriminant: ExpressionNode;
  cases: CaseClause[];
  defaultBranch?: StatementNode[];
  line: number;
}

export interface ForNode {
  type: 'For';
  variable: string;
  from: ExpressionNode;
  to: ExpressionNode;
  step?: ExpressionNode;
  body: StatementNode[];
  line: number;
}

export interface WhileNode {
  type: 'While';
  condition: ExpressionNode;
  body: StatementNode[];
  line: number;
}

export interface RepeatNode {
  type: 'Repeat';
  condition: ExpressionNode;
  body: StatementNode[];
  line: number;
}

export interface BreakNode {
  type: 'Break';
  line: number;
}

export interface ClearScreenNode {
  type: 'ClearScreen';
  line: number;
}

// Expression Nodes
export type ExpressionNode =
  | LiteralNode
  | VariableAccessNode
  | BinaryOpNode
  | UnaryOpNode
  | FunctionCallNode;

export interface LiteralNode {
  type: 'Literal';
  value: RuntimeValue;
  dataType: DataType;
  line: number;
}

export interface BinaryOpNode {
  type: 'BinaryOp';
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
  line: number;
}

export interface UnaryOpNode {
  type: 'UnaryOp';
  operator: string;
  operand: ExpressionNode;
  line: number;
}

export interface FunctionCallNode {
  type: 'FunctionCall';
  name: string;
  args: ExpressionNode[];
  line: number;
}

// Runtime Execution Interface
export interface InterpreterCallbacks {
  onOutput: (text: string, isNewLine: boolean) => void;
  onInput: (promptVarName?: string) => Promise<string>;
  onMemoryUpdate: (memory: Record<string, VariableInfo>) => void;
  onError: (error: string, line?: number) => void;
  onClearScreen: () => void;
  onStep?: (line: number) => void;
}

export interface ExecutionStatus {
  isRunning: boolean;
  isWaitingInput: boolean;
  isPaused: boolean;
  currentLine?: number;
}
