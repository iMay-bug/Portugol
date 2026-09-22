export interface DocSection {
  id: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  content: string;
  codeSnippet: string;
  tips?: string[];
}

export const DOCUMENTATION: DocSection[] = [
  {
    id: 'estrutura-basica',
    title: '1. Estrutura Básica do Algoritmo',
    category: 'Fundamentos',
    badge: 'Iniciante',
    summary: 'Conheça o esqueleto fundamental de qualquer programa escrito no VisualG.',
    content: `
No VisualG, todo algoritmo possui uma estrutura rígida e bem definida dividida em três blocos principais:

1. **Cabeçalho:** A palavra reservada \`algoritmo\` seguida pelo nome do programa entre aspas duplas.
2. **Área de Declarações (\`var\`):** Onde todas as variáveis utilizadas no programa devem ser obrigatoriamente declaradas antes de serem usadas.
3. **Corpo Principal (\`inicio\` ... \`fimalgoritmo\`):** Onde ficam os comandos executáveis, como cálculos, leitura e escrita.

### Comentários
Linhas que começam com duas barras \`//\` são comentários. O computador as ignora completamente, servindo para documentar e explicar o código.

### Sensibilidade a Maiúsculas
O VisualG é **case-insensitive**, ou seja, não diferencia maiúsculas de minúsculas (\`inicio\`, \`INICIO\` e \`Inicio\` são interpretados de forma idêntica).
    `,
    codeSnippet: `algoritmo "MeuPrimeiroAlgoritmo"
// Disciplina  : [Linguagem e Lógica de Programação]
// Professor   : VisualG
// Descrição   : Estrutura padrão de um programa no VisualG
// Autor(a)    : Estudante de Tecnologia
var
   // Declaração de variáveis aqui
   mensagem: caractere
inicio
   // Comandos executáveis aqui
   mensagem <- "Bem-vindo ao estudo de Portugol no VisualG!"
   escreval(mensagem)
fimalgoritmo`,
    tips: [
      'Todo algoritmo precisa terminar com "fimalgoritmo" sem espaços entre as palavras.',
      'Dê nomes significativos às variáveis para facilitar a leitura do algoritmo.'
    ]
  },
  {
    id: 'variaveis-e-tipos',
    title: '2. Variáveis e Tipos de Dados',
    category: 'Fundamentos',
    badge: 'Iniciante',
    summary: 'Aprenda como armazenar dados na memória do computador utilizando os 4 tipos primitivos.',
    content: `
Variáveis são espaços reservados na memória do computador para guardar informações temporárias durante a execução do programa.

No VisualG, temos 4 tipos primitivos fundamentais:

| Tipo | Descrição | Exemplo de Valores |
| :--- | :--- | :--- |
| **\`inteiro\`** | Números inteiros positivos ou negativos sem casas decimais | \`-5\`, \`0\`, \`42\`, \`2024\` |
| **\`real\`** | Números com casas decimais (ponto flutuante) | \`3.14\`, \`0.5\`, \`-12.80\` |
| **\`caractere\`** | Cadeia de caracteres, textos ou letras entre aspas duplas | \`"Maria"\`, \`"A"\`, \`"Rua 10"\` |
| **\`logico\`** | Valores booleanos de verdade ou falsidade | \`verdadeiro\`, \`falso\` |

### Declaração na seção \`var\`
A sintaxe é: \`nome_da_variavel : tipo\`. É possível declarar múltiplas variáveis do mesmo tipo separando-as por vírgula: \`x, y, z : inteiro\`.

### Atribuição de Valor
Para guardar um valor em uma variável, usamos o operador de atribuição **\`<-\`** (ou **\`:=\`**).
    `,
    codeSnippet: `algoritmo "DemonstracaoVariaveis"
var
   idade: inteiro
   altura, peso, imc: real
   nome: caractere
   estudante: logico
inicio
   nome <- "Ana Clara"
   idade <- 20
   altura <- 1.68
   peso <- 58.5
   estudante <- verdadeiro

   imc <- peso / (altura * altura)

   escreval("Nome: ", nome)
   escreval("Idade: ", idade, " anos")
   escreval("IMC Calculado: ", imc:5:2)
   escreval("É estudante? ", estudante)
fimalgoritmo`,
    tips: [
      'Em números reais, utilize ponto (.) e não vírgula (,) para separar as casas decimais no código (ex: 7.5).',
      'Textos devem sempre estar entre aspas duplas ("Exemplo").'
    ]
  },
  {
    id: 'operadores',
    title: '3. Operadores e Expressões',
    category: 'Lógica',
    badge: 'Iniciante',
    summary: 'Operadores aritméticos para contas, relacionais para comparações e lógicos para condições compostas.',
    content: `
### 1. Operadores Aritméticos
* **\`+\`** : Adição (ou concatenação de textos)
* **\`-\`** : Subtração
* **\`*\`** : Multiplicação
* **\`/\`** : Divisão real (ex: \`7 / 2 = 3.5\`)
* **\`\\\`** : Divisão inteira (ex: \`7 \\ 2 = 3\`)
* **\`mod\`** (ou **\`%\`**) : Resto da divisão inteira (ex: \`7 mod 2 = 1\`)
* **\`^\`** : Exponenciação / Potência (ex: \`2 ^ 3 = 8\`)

### 2. Operadores Relacionais (Comparações)
* **\`=\`** : Igual a
* **\`<>\`** : Diferente de
* **\`>\`** : Maior que
* **\`<\`** : Menor que
* **\`>=\`** : Maior ou igual a
* **\`<=\`** : Menor ou igual a

### 3. Operadores Lógicos
* **\`e\`** : Conjunção (verdadeiro somente se ambas forem verdadeiras)
* **\`ou\`** : Disjunção (verdadeiro se pelo menos uma for verdadeira)
* **\`nao\`** : Negação / Inversão lógica (\`nao verdadeiro = falso\`)
* **\`xou\`** : Ou exclusivo (verdadeiro se uma for verdadeira e a outra falsa)
    `,
    codeSnippet: `algoritmo "OperadoresExemplo"
var
   n1, n2, resto, divInteira: inteiro
   ehPar, ehPositivo: logico
inicio
   n1 <- 15
   n2 <- 4

   divInteira <- n1 \\ n2
   resto <- n1 mod n2

   escreval("15 \\ 4 (divisão inteira) = ", divInteira)
   escreval("15 mod 4 (resto da divisão) = ", resto)

   ehPar <- (n1 mod 2 = 0)
   ehPositivo <- (n1 > 0)

   escreval("15 é par? ", ehPar)
   escreval("15 é positivo e ímpar? ", (ehPositivo e nao ehPar))
fimalgoritmo`,
    tips: [
      'Lembre-se da ordem de precedência matemática: primeiro potências e raízes, depois multiplicação/divisão, e por último soma/subtração. Use parênteses para forçar a ordem desejada.'
    ]
  },
  {
    id: 'entrada-e-saida',
    title: '4. Entrada e Saída (leia, escreva, escreval)',
    category: 'Fundamentos',
    badge: 'Iniciante',
    summary: 'Interaja com o usuário através do console com entrada de dados e saídas formatadas.',
    content: `
Para interagir com quem está usando o programa, o VisualG oferece três comandos principais:

### 1. \`escreva(...)\`
Exibe mensagens e valores no console **sem pular linha** ao final. O próximo \`escreva\` continuará exatamente na mesma linha.

### 2. \`escreval(...)\`
O nome vem de "escreva linha" (*write line*). Exibe o conteúdo e **automaticamente pula para a próxima linha**.

### Formatação Numérica (\`valor:largura:decimais\`)
No VisualG, podemos formatar números reais adicionando \`:largura:decimais\` após a variável:
\`escreval("Preço: R$ ", preco:6:2)\` -> exibe com 2 casas decimais ocupando 6 espaços.

### 3. \`leia(variavel)\`
Pausa a execução do algoritmo e aguarda o usuário digitar um valor no console e pressionar **Enter**. O valor digitado é convertido e armazenado na variável indicada.
    `,
    codeSnippet: `algoritmo "InteracaoUsuario"
var
   nome: caractere
   salario, novoSalario: real
inicio
   escreva("Digite seu nome completo: ")
   leia(nome)

   escreva("Digite seu salário atual: ")
   leia(salario)

   // Aumento de 15%
   novoSalario <- salario * 1.15

   escreval("------------------------------------")
   escreval("Holerite de: ", nome)
   escreval("Salário Anterior: R$ ", salario:8:2)
   escreval("Novo Salário (+15%): R$ ", novoSalario:8:2)
   escreval("------------------------------------")
fimalgoritmo`,
    tips: [
      'Você pode ler mais de uma variável no mesmo leia: leia(a, b).',
      'Use escreva() para a mensagem de prompt e o leia() na mesma linha para um visual mais agradável.'
    ]
  },
  {
    id: 'estruturas-condicionais',
    title: '5. Estruturas Condicionais (se / escolha)',
    category: 'Controle de Fluxo',
    badge: 'Intermediário',
    summary: 'Tome decisões no algoritmo dependendo de condições verdadeiras ou falsas.',
    content: `
### 1. Estrutura \`se ... entao ... senao ... fimse\`
Permite executar um bloco de código apenas se uma condição lógica for verdadeira.

\`\`\`portugol
se <condicao> entao
   // comandos executados se verdadeiro
senao
   // comandos executados se falso (opcional)
fimse
\`\`\`

### 2. Estrutura \`escolha ... caso ... outrocaso ... fimescolha\`
Ideal para menus e seleção múltipla quando comparamos uma mesma variável contra valores discretos.

\`\`\`portugol
escolha <variavel>
   caso <valor1>
      // comandos
   caso <valor2>, <valor3>
      // comandos
   outrocaso
      // comandos padrão
fimescolha
\`\`\`
    `,
    codeSnippet: `algoritmo "ClassificacaoNota"
var
   nota: real
   conceito: caractere
inicio
   escreva("Digite a nota do aluno (0 a 10): ")
   leia(nota)

   se nota >= 9.0 entao
      conceito <- "A"
   senao
      se nota >= 7.0 entao
         conceito <- "B"
      senao
         se nota >= 5.0 entao
            conceito <- "C"
         senao
            conceito <- "D"
         fimse
      fimse
   fimse

   escreval("Conceito obtido: ", conceito)

   escolha conceito
      caso "A"
         escreval("Parabéns! Desempenho excelente!")
      caso "B", "C"
         escreval("Aprovado!")
      outrocaso
         escreval("Necessita recuperação.")
   fimescolha
fimalgoritmo`,
    tips: [
      'Nunca se esqueça de fechar cada "se" com o respectivo "fimse".',
      'O "senao" é opcional quando você só deseja agir caso a condição seja verdadeira.'
    ]
  },
  {
    id: 'lacos-de-repeticao',
    title: '6. Laços de Repetição (para, enquanto, repita)',
    category: 'Controle de Fluxo',
    badge: 'Intermediário',
    summary: 'Repita blocos de código com controle de contador, pré-teste ou pós-teste.',
    content: `
O VisualG suporta três laços de repetição tradicionais:

### 1. \`para ... de ... ate ... [passo] faca ... fimpara\`
Usado quando sabemos antecipadamente a quantidade exata de repetições. A variável de controle é incrementada a cada passo (o padrão é \`passo 1\`).

\`\`\`portugol
para i de 1 ate 10 passo 2 faca
   escreval("Valor: ", i)
fimpara
\`\`\`

### 2. \`enquanto <condicao> faca ... fimenquanto\`
**Pré-testado**: testa a condição **antes** de entrar no laço. Se a condição for falsa logo no início, os comandos não rodam nenhuma vez.

### 3. \`repita ... ate <condicao>\`
**Pós-testado**: executa o bloco pelo menos uma vez e repete **enquanto a condição for falsa**, encerrando assim que a condição se tornar verdadeira (*repita até que seja verdadeiro*).

### Comando \`interrompa\`
Pode ser usado dentro de qualquer laço para abortar e sair imediatamente da repetição.
    `,
    codeSnippet: `algoritmo "ExemplosLacos"
var
   i, contador: inteiro
   opcao: caractere
inicio
   escreval("--- 1. Laço PARA (Tabuada do 7) ---")
   para i de 1 ate 10 faca
      escreval("7 x ", i, " = ", (7 * i))
   fimpara

   escreval("")
   escreval("--- 2. Laço ENQUANTO (Contagem regressiva) ---")
   contador <- 5
   enquanto contador > 0 faca
      escreval(contador, "...")
      contador <- contador - 1
   fimenquanto
   escreval("Fogo!")

   escreval("")
   escreval("--- 3. Laço REPITA ATE (Validação) ---")
   repita
      escreva("Deseja sair do programa? (S/N): ")
      leia(opcao)
   ate (opcao = "S") ou (opcao = "s")

   escreval("Programa encerrado com sucesso!")
fimalgoritmo`,
    tips: [
      'No "repita ... ate", o laço continua ENQUANTO a condição for FALSA e para quando ficar VERDADEIRA.',
      'Certifique-se sempre de alterar a variável de controle no "enquanto" para evitar loop infinito!'
    ]
  },
  {
    id: 'vetores-e-matrizes',
    title: '7. Vetores (Arrays)',
    category: 'Estruturas de Dados',
    badge: 'Avançado',
    summary: 'Armazene coleções homogêneas de dados indexados por uma ou mais dimensões.',
    content: `
Um **vetor** (ou *array*) é uma sequência contínua de variáveis do mesmo tipo, acessíveis através de um índice numérico.

### Declaração de Vetor no VisualG
No VisualG, você especifica os limites inferior e superior entre colchetes utilizando \`..\`:

\`\`\`portugol
var
   nomes: vetor [1..5] de caractere
   notas: vetor [1..10] de real
   matriz: vetor [1..3, 1..3] de inteiro
\`\`\`

> 💡 **Nota Importante:** No VisualG, por convenção quase universal dos cursos, os vetores são declarados iniciando em \`1\` (ex: \`[1..10]\`), diferentemente de C ou JavaScript que iniciam em 0.

### Acesso aos Elementos
Para ler ou atribuir um valor em uma posição específica, informamos o índice entre colchetes:
\`notas[1] <- 8.5\`
\`escreval("Nota do primeiro aluno: ", notas[1])\`
    `,
    codeSnippet: `algoritmo "DemonstracaoVetores"
var
   nomes: vetor [1..4] de caractere
   notas: vetor [1..4] de real
   i: inteiro
   soma, media: real
inicio
   // Leitura dos dados no vetor
   para i de 1 ate 4 faca
      escreva("Digite o nome do aluno ", i, ": ")
      leia(nomes[i])
      escreva("Digite a nota de ", nomes[i], ": ")
      leia(notas[i])
   fimpara

   // Cálculo da média geral
   soma <- 0
   para i de 1 ate 4 faca
      soma <- soma + notas[i]
   fimpara
   media <- soma / 4

   escreval("=========================")
   escreval("Boletim da Turma:")
   para i de 1 ate 4 faca
      escreval(i, " - ", nomes[i], " | Nota: ", notas[i]:4:1)
   fimpara
   escreval("-------------------------")
   escreval("Média Geral da Turma: ", media:4:2)
fimalgoritmo`,
    tips: [
      'Acessar um índice fora do intervalo declarado (ex: tentar acessar v[5] quando foi declarado v[1..4]) gera erro de execução "índice fora dos limites".',
      'Use o laço "para" para percorrer facilmente todos os elementos do vetor.'
    ]
  },
  {
    id: 'funcoes-nativas',
    title: '8. Funções Nativas do VisualG',
    category: 'Recursos Avançados',
    badge: 'Avançado',
    summary: 'Utilize as funções matemáticas e de manipulação de texto prontas do VisualG.',
    content: `
O VisualG oferece dezenas de funções integradas para cálculos matemáticos e manipulação de textos (strings):

### Funções Matemáticas
* **\`raizq(x)\`** : Retorna a raiz quadrada de x (ex: \`raizq(49) = 7\`).
* **\`abs(x)\`** : Retorna o valor absoluto/módulo de x (ex: \`abs(-12) = 12\`).
* **\`int(x)\`** : Retorna apenas a parte inteira do número (ex: \`int(8.95) = 8\`).
* **\`quad(x)\`** : Retorna o quadrado do número (\`x ^ 2\`).
* **\`rand\`** : Gera um número real aleatório entre 0 e 1.
* **\`randi(limite)\`** : Gera um número inteiro aleatório entre 0 e (limite - 1).
* **\`pi\`** : Retorna a constante Pi (3.14159265...).

### Funções de Caractere (Texto)
* **\`compr(texto)\`** : Retorna a quantidade de caracteres (tamanho) do texto.
* **\`copia(texto, pos, qtd)\`** : Extrai uma fatia do texto começando na posição \`pos\` (baseada em 1) com comprimento \`qtd\`.
* **\`maiusc(texto)\`** : Converte todas as letras para MAIÚSCULAS.
* **\`minusc(texto)\`** : Converte todas as letras para minúsculas.
* **\`pos(sub, texto)\`** : Retorna a posição onde a palavra \`sub\` aparece em \`texto\` (ou 0 se não existir).
* **\`asc(c)\`** : Retorna o código ASCII do caractere.
* **\`carac(codigo)\`** : Retorna o caractere correspondente ao código ASCII.
    `,
    codeSnippet: `algoritmo "FuncoesProntas"
var
   palavra, maiuscula, trecho: caractere
   tamanho, sorteado: inteiro
   raiz: real
inicio
   palavra <- "VisualG Portugol"

   tamanho <- compr(palavra)
   maiuscula <- maiusc(palavra)
   trecho <- copia(palavra, 1, 7) // Pega os primeiros 7 caracteres

   escreval("Texto original: ", palavra)
   escreval("Número de letras: ", tamanho)
   escreval("Em maiúsculas: ", maiuscula)
   escreval("Fatia extraída: ", trecho)

   // Matemática
   raiz <- raizq(144)
   sorteado <- randi(100) + 1 // número entre 1 e 100

   escreval("Raiz de 144: ", raiz)
   escreval("Número sorteado entre 1 e 100: ", sorteado)
fimalgoritmo`,
    tips: [
      'Na função copia(), a contagem começa no caractere 1, não no 0.',
      'A constante pi pode ser usada diretamente em fórmulas, ex: area <- pi * raio ^ 2.'
    ]
  }
];
