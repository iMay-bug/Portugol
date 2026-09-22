# Portugol VisualG 3.0 Web • Aplicativo de Estudo Interativo

[![Deploy with Vercel](https://vercel.com/button)](https://portugol-nine.vercel.app)
[![Vercel Live](https://img.shields.io/badge/Vercel-Online-success?logo=vercel)](https://portugol-nine.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/iMay-bug/Portugol)

🌐 **Acesse a versão ao vivo:** [https://portugol-nine.vercel.app](https://portugol-nine.vercel.app)

---

## 🚀 Funcionalidades Principais

1. **Interpretador Próprio em TypeScript / Navegador**:
   - Executa algoritmos diretamente no navegador sem precisar de instalação de softwares externos.
   - Suporta todo o dialeto tradicional do VisualG:
     - Estrutura `algoritmo`, `var`, `inicio`, `fimalgoritmo`.
     - Tipos primitivos: `inteiro`, `real`, `caractere`, `logico` e `vetor [1..N] de tipo`.
     - Operadores aritméticos (`+`, `-`, `*`, `/`, `\`, `mod`, `^`), relacionais (`=`, `<>`, `<`, `>`, `<=`, `>=`) e lógicos (`e`, `ou`, `nao`, `xou`).
     - Comandos de E/S: `escreva`, `escreval` (com formatação `:largura:decimais`), `leia` interativo assíncrono e `limpatela`.
     - Estruturas de decisão: `se ... entao ... senao ... fimse` e `escolha ... caso ... outrocaso ... fimescolha`.
     - Estruturas de repetição: `para ... de ... ate ... [passo] faca ... fimpara`, `enquanto ... faca ... fimenquanto`, `repita ... ate` e `interrompa`.
     - Funções nativas: `raizq`, `abs`, `int`, `randi`, `pi`, `compr`, `copia`, `maiusc`, `minusc`, `asc`, `carac`.

2. **Playground & Editor com Destaque de Sintaxe ("Letrinhas Coloridas") e Atalho F9**:
   - Destaque de sintaxe em tempo real (palavras reservadas, comandos, tipos, textos, números e operadores coloridos).
   - Editor de código com contagem de linhas e indentação inteligente com Tab.
   - Terminal interativo com prompt dinâmico para comandos `leia()`.
   - **Área das Variáveis (Tabela de Memória)** em tempo real exibindo nome, tipo e valores das variáveis atualizadas passo a passo (como no VisualG clássico).
   - Exemplos prontos para carregar com um clique (Calculadora, Fibonacci, Boletim, Vetor, etc.).
   - Exportação direta para arquivo `.alg` e cópia para a área de transferência.

3. **Documentação Completa Passo a Passo (8 Módulos)**:
   - Dividida em aulas do básico ao avançado com tabelas, regras de sintaxe, alertas de erros comuns.
   - Botão **"Carregar no Editor"** em cada exemplo para testar imediatamente.

4. **🥋 Dojo de Katas (Estilo Codewars)**:
   - 14 desafios ranqueados de **8 Kyu** a **4 Kyu**.
   - Pontuação de Honra (XP) e promoção de graduação.
   - Testes de amostra públicos (`Test`) e submissão completa com casos ocultos (`Attempt`).
   - Dicas do Sensei e gabarito comentado com código colorido.

5. **Guia Rápido (Cheat Sheet)**:
   - Consulta rápida de sintaxe, operadores e palavras-chave.

6. **🌗 Modo Claro e Modo Escuro**:
   - Alternância imediata com tema salvo em `localStorage`.

---

## 🛠️ Como Executar

### Pré-requisitos
- Node.js instalado (v18+)

### Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

Abra o navegador no endereço indicado (geralmente `http://localhost:5173`).

### Gerar versão de produção
```bash
npm run build
```
Os arquivos estáticos otimizados serão gerados na pasta `dist/`.
