export interface TestCase {
  input: string[];
  expectedOutputContains: string[];
  label: string;
  isSecret?: boolean;
}

export type ExerciseTrack = 'beta' | 'kata';

export interface Exercise {
  id: string;
  title: string;
  track: ExerciseTrack;
  betaStep?: number;
  kyu: 8 | 7 | 6 | 5 | 4;
  honor: number;
  tags: string[];
  level: 'iniciante' | 'intermediario' | 'avancado';
  category: string;
  classification: string;
  description: string;
  starterCode: string;
  hints: string[];
  solutionCode: string;
  testCases: TestCase[];
}

export const EXERCISES: Exercise[] = [
  // =========================================================================
  // 🐣 TRILHA BETA (ULTRABÁSICO / BEM FÁCIL / NÍVEL ZERO)
  // =========================================================================
  {
    id: 'beta-1-ola-mundo',
    title: '🐣 Beta 1: Diga Olá ao Mundo!',
    track: 'beta',
    betaStep: 1,
    kyu: 8,
    honor: 10,
    tags: ['Beta', 'Super Fácil', 'Primeiros Passos'],
    level: 'iniciante',
    category: 'Comece Aqui',
    classification: 'Nível Beta • Passo 1',
    description: `
### 🌟 Seja muito bem-vindo ao Nível Beta!
Este é o nível mais fácil e amigável possível, feito especialmente para quem está começando do **absoluto zero**!

### O que você vai aprender?
O comando **\`escreval\`** é a forma como o computador "conversa" com a gente, mostrando frases na tela.

### Sua Missão
Faça o computador exibir exatamente a mensagem:
\`\`\`text
Olá, Mundo!
\`\`\`

### Como Resolver
No código ao lado, dentro do bloco **\`inicio\`**, digite:
\`escreval("Olá, Mundo!")\`
    `,
    starterCode: `algoritmo "Beta01_OlaMundo"
var
   // Nenhuma variável necessária neste primeiro passo!
inicio
   // Digite exatamente na linha abaixo: escreval("Olá, Mundo!")

fimalgoritmo`,
    hints: [
      'Basta digitar: escreval("Olá, Mundo!") entre inicio e fimalgoritmo.',
      'Não se esqueça das aspas duplas ("...") em volta do texto!'
    ],
    solutionCode: `algoritmo "Beta01_OlaMundo"
var

inicio
   escreval("Olá, Mundo!")
fimalgoritmo`,
    testCases: [
      {
        input: [],
        expectedOutputContains: ['Olá, Mundo!'],
        label: 'Apenas exibir "Olá, Mundo!"'
      }
    ]
  },
  {
    id: 'beta-2-meu-primeiro-nome',
    title: '🐣 Beta 2: Lendo seu Primeiro Nome',
    track: 'beta',
    betaStep: 2,
    kyu: 8,
    honor: 10,
    tags: ['Beta', 'Super Fácil', 'Entrada de Dados'],
    level: 'iniciante',
    category: 'Comece Aqui',
    classification: 'Nível Beta • Passo 2',
    description: `
### 🌟 Aprendendo a Ouvir o Usuário
No passo anterior você exibiu uma mensagem. Agora, o computador vai **ler** uma informação digitada por você!

### O que é o comando \`leia\`?
O comando \`leia(nome)\` pausa o programa e guarda na memória o que for digitado no teclado.

### Sua Missão
1. Leia o nome da pessoa com \`leia(nome)\`.
2. Exiba a saudação:
\`\`\`text
Olá, <nome>
\`\`\`

### Exemplo
- Se você digitar: \`Maria\`
- O computador deve responder: \`Olá, Maria\`
    `,
    starterCode: `algoritmo "Beta02_LendoNome"
var
   nome: caractere
inicio
   // 1. Leia o nome digitado:
   leia(nome)

   // 2. Exiba a mensagem de boas-vindas:
   // escreval("Olá, ", nome)

fimalgoritmo`,
    hints: [
      'Use: escreval("Olá, ", nome)',
      'Lembre-se da vírgula separando o texto entre aspas da variável nome.'
    ],
    solutionCode: `algoritmo "Beta02_LendoNome"
var
   nome: caractere
inicio
   leia(nome)
   escreval("Olá, ", nome)
fimalgoritmo`,
    testCases: [
      {
        input: ['Maria'],
        expectedOutputContains: ['Olá, Maria'],
        label: 'Nome: Maria'
      },
      {
        input: ['Carlos'],
        expectedOutputContains: ['Olá, Carlos'],
        label: 'Nome: Carlos'
      }
    ]
  },
  {
    id: 'beta-3-soma-facil',
    title: '🐣 Beta 3: Minha Primeira Soma (A + B)',
    track: 'beta',
    betaStep: 3,
    kyu: 8,
    honor: 10,
    tags: ['Beta', 'Super Fácil', 'Aritmética'],
    level: 'iniciante',
    category: 'Comece Aqui',
    classification: 'Nível Beta • Passo 3',
    description: `
### 🌟 O Computador como Calculadora
Computadores são super velozes fazendo contas matemáticas! Vamos somar dois números simples.

### Sua Missão
1. O programa vai ler dois números inteiros: \`a\` e \`b\`.
2. Calcule a soma: \`resultado <- a + b\`.
3. Exiba o resultado final com \`escreval(resultado)\`.

### Exemplo
- Se a entrada for \`5\` e \`3\`, o programa deve exibir \`8\`.
    `,
    starterCode: `algoritmo "Beta03_SomaFacil"
var
   a, b, resultado: inteiro
inicio
   leia(a)
   leia(b)

   // Calcule a soma abaixo:
   resultado <- a + b

   // Agora exiba o resultado:

fimalgoritmo`,
    hints: [
      'Basta adicionar: escreval(resultado)',
      'Você também pode escrever direto: escreval(a + b)'
    ],
    solutionCode: `algoritmo "Beta03_SomaFacil"
var
   a, b, resultado: inteiro
inicio
   leia(a)
   leia(b)
   resultado <- a + b
   escreval(resultado)
fimalgoritmo`,
    testCases: [
      {
        input: ['5', '3'],
        expectedOutputContains: ['8'],
        label: '5 + 3 = 8'
      },
      {
        input: ['10', '20'],
        expectedOutputContains: ['30'],
        label: '10 + 20 = 30'
      }
    ]
  },
  {
    id: 'beta-4-dobro-de-um-numero',
    title: '🐣 Beta 4: O Dobro de um Número',
    track: 'beta',
    betaStep: 4,
    kyu: 8,
    honor: 10,
    tags: ['Beta', 'Super Fácil', 'Multiplicação'],
    level: 'iniciante',
    category: 'Comece Aqui',
    classification: 'Nível Beta • Passo 4',
    description: `
### 🌟 Multiplicando com o Asterisco (*)
Na programação de computadores, a multiplicação é feita com o símbolo de asterisco (\`*\`).
O dobro de qualquer número é ele vezes 2 (\`n * 2\`).

### Sua Missão
Leia um número inteiro \`n\` e exiba:
\`\`\`text
Dobro: <valor>
\`\`\`

### Exemplo
- Se a entrada for \`7\`, a saída deve ser \`Dobro: 14\`.
- Se a entrada for \`20\`, a saída deve ser \`Dobro: 40\`.
    `,
    starterCode: `algoritmo "Beta04_Dobro"
var
   n, dobro: inteiro
inicio
   leia(n)

   // 1. Calcule o dobro:
   dobro <- n * 2

   // 2. Exiba o dobro no formato pedido:
   // escreval("Dobro: ", dobro)

fimalgoritmo`,
    hints: [
      'Use: escreval("Dobro: ", dobro)',
      'Lembre-se do espaço depois dos dois pontos dentro das aspas: "Dobro: "'
    ],
    solutionCode: `algoritmo "Beta04_Dobro"
var
   n, dobro: inteiro
inicio
   leia(n)
   dobro <- n * 2
   escreval("Dobro: ", dobro)
fimalgoritmo`,
    testCases: [
      {
        input: ['7'],
        expectedOutputContains: ['Dobro: 14'],
        label: 'Dobro de 7 é 14'
      },
      {
        input: ['20'],
        expectedOutputContains: ['Dobro: 40'],
        label: 'Dobro de 20 é 40'
      }
    ]
  },
  {
    id: 'beta-5-antecessor',
    title: '🐣 Beta 5: Antecessor (Quem vem antes?)',
    track: 'beta',
    betaStep: 5,
    kyu: 8,
    honor: 10,
    tags: ['Beta', 'Super Fácil', 'Subtração'],
    level: 'iniciante',
    category: 'Comece Aqui',
    classification: 'Nível Beta • Passo 5',
    description: `
### 🌟 Subtraindo com o Menos (-)
O antecessor de qualquer número inteiro é o valor que vem imediatamente antes dele na reta numérica, ou seja, \`n - 1\`.

### Sua Missão
Leia um número inteiro \`n\` e exiba o seu antecessor no formato:
\`\`\`text
Antecessor: <valor>
\`\`\`

### Exemplo
- Entrada: \`10\` &rarr; Saída: \`Antecessor: 9\`
- Entrada: \`1\` &rarr; Saída: \`Antecessor: 0\`
    `,
    starterCode: `algoritmo "Beta05_Antecessor"
var
   n, antes: inteiro
inicio
   leia(n)

   // Calcule quem vem antes:
   antes <- n - 1

   // Exiba com escreval:

fimalgoritmo`,
    hints: [
      'escreval("Antecessor: ", antes)'
    ],
    solutionCode: `algoritmo "Beta05_Antecessor"
var
   n, antes: inteiro
inicio
   leia(n)
   antes <- n - 1
   escreval("Antecessor: ", antes)
fimalgoritmo`,
    testCases: [
      {
        input: ['10'],
        expectedOutputContains: ['Antecessor: 9'],
        label: 'Antecessor de 10 é 9'
      },
      {
        input: ['1'],
        expectedOutputContains: ['Antecessor: 0'],
        label: 'Antecessor de 1 é 0'
      }
    ]
  },
  {
    id: 'beta-6-media-duas-notas',
    title: '🐣 Beta 6: Média Simples de 2 Provas',
    track: 'beta',
    betaStep: 6,
    kyu: 8,
    honor: 10,
    tags: ['Beta', 'Super Fácil', 'Divisão Real'],
    level: 'iniciante',
    category: 'Comece Aqui',
    classification: 'Nível Beta • Passo 6',
    description: `
### 🌟 Divisão e Números Reais
Quando tiramos notas escolares (como 7.5 ou 8.0), usamos variáveis do tipo **\`real\`** (que aceitam casas decimais).
Para achar a média de 2 notas: somamos as duas e dividimos por 2:
\`media <- (nota1 + nota2) / 2\`

> ⚠️ **Dica de Ouro:** Não esqueça dos parênteses em volta da soma! Se você fizer \`nota1 + nota2 / 2\`, o computador dividirá apenas a segunda nota.

### Sua Missão
Leia \`nota1\` e \`nota2\` e exiba:
\`\`\`text
Média: <valor>
\`\`\`

### Exemplo
- Entrada: \`8.0\` e \`6.0\`
- Saída deve conter: \`7\`
    `,
    starterCode: `algoritmo "Beta06_Media"
var
   nota1, nota2, media: real
inicio
   leia(nota1)
   leia(nota2)

   // Calcule a média com parênteses:
   media <- (nota1 + nota2) / 2

   // Exiba a média:
   escreval("Média: ", media)
fimalgoritmo`,
    hints: [
      'O código já está quase pronto! Apenas rode o teste para verificar se acertou.'
    ],
    solutionCode: `algoritmo "Beta06_Media"
var
   nota1, nota2, media: real
inicio
   leia(nota1)
   leia(nota2)
   media <- (nota1 + nota2) / 2
   escreval("Média: ", media)
fimalgoritmo`,
    testCases: [
      {
        input: ['8.0', '6.0'],
        expectedOutputContains: ['Média: 7'],
        label: 'Média de 8.0 e 6.0 é 7.0'
      },
      {
        input: ['10.0', '10.0'],
        expectedOutputContains: ['Média: 10'],
        label: 'Média de notas máximas é 10.0'
      }
    ]
  },

  // =========================================================================
  // 🥋 DOJO DE KATAS RANQUEADOS (ESTILO CODEWARS: 8 KYU A 4 KYU)
  // =========================================================================
  {
    id: '8-kyu-par-ou-impar',
    title: 'Par ou Ímpar? (Even or Odd)',
    track: 'kata',
    kyu: 8,
    honor: 10,
    tags: ['Fundamentos', 'Matemática', 'Condicionais'],
    level: 'iniciante',
    category: 'Fundamentos',
    classification: '8 Kyu • Fundamentos',
    description: `
### Enunciado (Kata 8 Kyu)
Crie um algoritmo que leia um número inteiro \`n\` e exiba:
- **\`PAR\`** se o número for par;
- **\`IMPAR\`** se o número for ímpar.

### Exemplos
- **Entrada:** \`2\` &rarr; **Saída:** \`PAR\`
- **Entrada:** \`7\` &rarr; **Saída:** \`IMPAR\`
- **Entrada:** \`0\` &rarr; **Saída:** \`PAR\`
- **Entrada:** \`-3\` &rarr; **Saída:** \`IMPAR\`

### Restrições
- Utilize o operador \`mod\` (ou \`%\`) para verificar o resto da divisão por 2.
    `,
    starterCode: `algoritmo "ParOuImpar"
var
   n: inteiro
inicio
   leia(n)
   // Escreva sua lógica aqui

fimalgoritmo`,
    hints: [
      'Um número é par se: (n mod 2 = 0).',
      'Use se ... entao ... senao ... fimse.'
    ],
    solutionCode: `algoritmo "ParOuImpar"
var
   n: inteiro
inicio
   leia(n)
   se n mod 2 = 0 entao
      escreval("PAR")
   senao
      escreval("IMPAR")
   fimse
fimalgoritmo`,
    testCases: [
      {
        input: ['2'],
        expectedOutputContains: ['PAR'],
        label: 'Amostra: Número 2 é Par'
      },
      {
        input: ['7'],
        expectedOutputContains: ['IMPAR'],
        label: 'Amostra: Número 7 é Ímpar'
      },
      {
        input: ['0'],
        expectedOutputContains: ['PAR'],
        label: 'Caso Limite: Zero é Par',
        isSecret: true
      },
      {
        input: ['-4'],
        expectedOutputContains: ['PAR'],
        label: 'Caso Negativo: -4 é Par',
        isSecret: true
      }
    ]
  },
  {
    id: '8-kyu-retorne-negativo',
    title: 'Retorne Negativo (Return Negative)',
    track: 'kata',
    kyu: 8,
    honor: 10,
    tags: ['Aritmética', 'Fundamentos'],
    level: 'iniciante',
    category: 'Fundamentos',
    classification: '8 Kyu • Fundamentos',
    description: `
### Enunciado (Kata 8 Kyu)
Dado um número inteiro qualquer \`n\`, seu objetivo é torná-lo negativo.
- Se o número já for negativo, mantenha-o como está.
- Se for zero (\`0\`), exiba \`0\`.
- Se for positivo, inverta o sinal para torná-lo negativo.

### Exemplos
- \`1\` &rarr; \`-1\`
- \`-5\` &rarr; \`-5\`
- \`0\` &rarr; \`0\`
    `,
    starterCode: `algoritmo "RetorneNegativo"
var
   n: inteiro
inicio
   leia(n)
   // Exiba o número negativo correspondente

fimalgoritmo`,
    hints: [
      'Se n > 0 entao n <- -n fimse',
      'Exiba com escreval(n)'
    ],
    solutionCode: `algoritmo "RetorneNegativo"
var
   n: inteiro
inicio
   leia(n)
   se n > 0 entao
      n <- -n
   fimse
   escreval(n)
fimalgoritmo`,
    testCases: [
      {
        input: ['1'],
        expectedOutputContains: ['-1'],
        label: 'Amostra: 1 vira -1'
      },
      {
        input: ['-5'],
        expectedOutputContains: ['-5'],
        label: 'Amostra: -5 permanece -5'
      },
      {
        input: ['0'],
        expectedOutputContains: ['0'],
        label: 'Caso Limite: 0 permanece 0',
        isSecret: true
      },
      {
        input: ['42'],
        expectedOutputContains: ['-42'],
        label: 'Número grande positivo',
        isSecret: true
      }
    ]
  },
  {
    id: '8-kyu-soma-1-a-n',
    title: 'Somatório de 1 a N (Grasshopper - Summation)',
    track: 'kata',
    kyu: 8,
    honor: 10,
    tags: ['Laços', 'Matemática'],
    level: 'iniciante',
    category: 'Laços',
    classification: '8 Kyu • Laços',
    description: `
### Enunciado (Kata 8 Kyu)
Crie um programa que encontre o somatório de todos os números inteiros de \`1\` até \`n\` (inclusive).
O número \`n\` sempre será um número inteiro positivo maior que 0.

### Exemplos
- \`n = 2\` &rarr; \(1 + 2 = 3\)
- \`n = 8\` &rarr; \(1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 36\)

Saída formatada:
\`\`\`text
Soma: <resultado>
\`\`\`
    `,
    starterCode: `algoritmo "Somatorio"
var
   n, i, total: inteiro
inicio
   leia(n)
   total <- 0
   // Use um laço para ou a fórmula de Gauss

fimalgoritmo`,
    hints: [
      'Você pode usar: para i de 1 ate n faca total <- total + i fimpara',
      'Ao final exiba: escreval("Soma: ", total)'
    ],
    solutionCode: `algoritmo "Somatorio"
var
   n, i, total: inteiro
inicio
   leia(n)
   total <- 0
   para i de 1 ate n faca
      total <- total + i
   fimpara
   escreval("Soma: ", total)
fimalgoritmo`,
    testCases: [
      {
        input: ['2'],
        expectedOutputContains: ['Soma: 3'],
        label: 'Amostra: N = 2 (resultado 3)'
      },
      {
        input: ['8'],
        expectedOutputContains: ['Soma: 36'],
        label: 'Amostra: N = 8 (resultado 36)'
      },
      {
        input: ['1'],
        expectedOutputContains: ['Soma: 1'],
        label: 'Caso Limite: N = 1',
        isSecret: true
      },
      {
        input: ['10'],
        expectedOutputContains: ['Soma: 55'],
        label: 'Caso Extensivo: N = 10',
        isSecret: true
      }
    ]
  },
  {
    id: '7-kyu-multiplos-3-ou-5',
    title: 'Múltiplos de 3 ou 5 (Multiples of 3 or 5)',
    track: 'kata',
    kyu: 7,
    honor: 20,
    tags: ['Aritmética', 'Laços', 'Lógica'],
    level: 'iniciante',
    category: 'Lógica',
    classification: '7 Kyu • Lógica',
    description: `
### Enunciado (Kata 7 Kyu)
Se listarmos todos os números naturais abaixo de 10 que são múltiplos de 3 ou 5, obtemos 3, 5, 6 e 9. A soma destes múltiplos é 23.

Crie um algoritmo que leia um número inteiro positivo \`n\` e calcule a soma de todos os múltiplos de **3** ou **5** que sejam **estritamente menores que \`n\`** (ou seja, de 1 até \(n - 1\)).

Saída:
\`\`\`text
Total: <resultado>
\`\`\`
    `,
    starterCode: `algoritmo "Multiplos3ou5"
var
   n, i, soma: inteiro
inicio
   leia(n)
   soma <- 0
   // Itere de 1 até n - 1

fimalgoritmo`,
    hints: [
      'Percorra: para i de 1 ate n - 1 faca',
      'Verifique: se (i mod 3 = 0) ou (i mod 5 = 0) entao soma <- soma + i fimse'
    ],
    solutionCode: `algoritmo "Multiplos3ou5"
var
   n, i, soma: inteiro
inicio
   leia(n)
   soma <- 0
   para i de 1 ate n - 1 faca
      se (i mod 3 = 0) ou (i mod 5 = 0) entao
         soma <- soma + i
      fimse
   fimpara
   escreval("Total: ", soma)
fimalgoritmo`,
    testCases: [
      {
        input: ['10'],
        expectedOutputContains: ['Total: 23'],
        label: 'Amostra: N = 10 (Soma = 23)'
      },
      {
        input: ['16'],
        expectedOutputContains: ['Total: 60'],
        label: 'Amostra: N = 16 (Soma = 60)'
      },
      {
        input: ['4'],
        expectedOutputContains: ['Total: 3'],
        label: 'Caso Limite: N = 4 (apenas 3)',
        isSecret: true
      }
    ]
  },
  {
    id: '7-kyu-ano-bissexto',
    title: 'Ano Bissexto (Leap Year Validator)',
    track: 'kata',
    kyu: 7,
    honor: 20,
    tags: ['Condicionais', 'Lógica'],
    level: 'intermediario',
    category: 'Condicionais',
    classification: '7 Kyu • Condicionais',
    description: `
### Enunciado (Kata 7 Kyu)
Na lógica do calendário gregoriano, um ano é bissexto se:
1. For divisível por 4 (\`ano mod 4 = 0\`);
2. **Exceto** se for divisível por 100 (\`ano mod 100 = 0\`), a menos que também seja divisível por 400 (\`ano mod 400 = 0\`).

Exiba exatamente **\`BISSEXTO\`** ou **\`NAO BISSEXTO\`**.

### Exemplos
- \`2020\` &rarr; \`BISSEXTO\`
- \`2000\` &rarr; \`BISSEXTO\` (divisível por 400)
- \`1900\` &rarr; \`NAO BISSEXTO\` (divisível por 100 mas não por 400)
- \`2023\` &rarr; \`NAO BISSEXTO\`
    `,
    starterCode: `algoritmo "AnoBissexto"
var
   ano: inteiro
inicio
   leia(ano)
   // Aplique as regras de divisibilidade

fimalgoritmo`,
    hints: [
      'Condição: ((ano mod 4 = 0) e (ano mod 100 <> 0)) ou (ano mod 400 = 0)'
    ],
    solutionCode: `algoritmo "AnoBissexto"
var
   ano: inteiro
   ehBissexto: logico
inicio
   leia(ano)
   ehBissexto <- ((ano mod 4 = 0) e (ano mod 100 <> 0)) ou (ano mod 400 = 0)

   se ehBissexto entao
      escreval("BISSEXTO")
   senao
      escreval("NAO BISSEXTO")
   fimse
fimalgoritmo`,
    testCases: [
      {
        input: ['2020'],
        expectedOutputContains: ['BISSEXTO'],
        label: 'Amostra: 2020 é bissexto'
      },
      {
        input: ['1900'],
        expectedOutputContains: ['NAO BISSEXTO'],
        label: 'Secular não divisível por 400: 1900'
      },
      {
        input: ['2000'],
        expectedOutputContains: ['BISSEXTO'],
        label: 'Secular divisível por 400: 2000',
        isSecret: true
      },
      {
        input: ['2023'],
        expectedOutputContains: ['NAO BISSEXTO'],
        label: 'Ano comum: 2023',
        isSecret: true
      }
    ]
  },
  {
    id: '7-kyu-desigualdade-triangular',
    title: 'Desigualdade Triangular (Is this a triangle?)',
    track: 'kata',
    kyu: 7,
    honor: 20,
    tags: ['Geometria', 'Condicionais'],
    level: 'intermediario',
    category: 'Condicionais',
    classification: '7 Kyu • Geometria',
    description: `
### Enunciado (Kata 7 Kyu)
Três segmentos de reta de comprimentos positivos \(a\), \(b\) e \(c\) podem formar um triângulo se, e somente se, cada lado for estritamente menor que a soma dos outros dois:
- \(a < b + c\)
- \(b < a + c\)
- \(c < a + b\)

Leia 3 números inteiros correspondentes aos lados e exiba:
- **\`VALIDO\`** se puder formar um triângulo;
- **\`INVALIDO\`** se não puder formar um triângulo.
    `,
    starterCode: `algoritmo "Triangulo"
var
   a, b, c: inteiro
inicio
   leia(a)
   leia(b)
   leia(c)
   // Verifique a desigualdade triangular

fimalgoritmo`,
    hints: [
      'se (a < b + c) e (b < a + c) e (c < a + b) e (a > 0) e (b > 0) e (c > 0) entao'
    ],
    solutionCode: `algoritmo "Triangulo"
var
   a, b, c: inteiro
inicio
   leia(a)
   leia(b)
   leia(c)

   se (a < b + c) e (b < a + c) e (c < a + b) e (a > 0) e (b > 0) e (c > 0) entao
      escreval("VALIDO")
   senao
      escreval("INVALIDO")
   fimse
fimalgoritmo`,
    testCases: [
      {
        input: ['3', '4', '5'],
        expectedOutputContains: ['VALIDO'],
        label: 'Triângulo clássico (3, 4, 5)'
      },
      {
        input: ['1', '2', '5'],
        expectedOutputContains: ['INVALIDO'],
        label: 'Lados incompatíveis (1, 2, 5)'
      },
      {
        input: ['7', '2', '2'],
        expectedOutputContains: ['INVALIDO'],
        label: 'Caso Limite: (7, 2, 2)',
        isSecret: true
      },
      {
        input: ['5', '5', '5'],
        expectedOutputContains: ['VALIDO'],
        label: 'Triângulo Equilátero (5, 5, 5)',
        isSecret: true
      }
    ]
  },
  {
    id: '7-kyu-contador-vogais',
    title: 'Contador de Vogais (Vowel Count)',
    track: 'kata',
    kyu: 7,
    honor: 20,
    tags: ['Strings', 'Laços'],
    level: 'intermediario',
    category: 'Strings',
    classification: '7 Kyu • Strings',
    description: `
### Enunciado (Kata 7 Kyu)
Faça um programa que leia uma palavra e retorne o número total de vogais presentes nela (\`a\`, \`e\`, \`i\`, \`o\`, \`u\`).

Formato de Saída:
\`\`\`text
Vogais: <total>
\`\`\`

> 💡 **Dica VisualG:** Utilize a função nativa \`compr(texto)\` para o tamanho da palavra e \`copia(texto, pos, 1)\` para extrair cada letra individualmente. Lembre-se que no VisualG a contagem de posições começa em 1!
    `,
    starterCode: `algoritmo "ContadorVogais"
var
   palavra, letra: caractere
   i, total: inteiro
inicio
   leia(palavra)
   total <- 0
   // Use compr() e copia()

fimalgoritmo`,
    hints: [
      'palavra <- minusc(palavra)',
      'para i de 1 ate compr(palavra) faca letra <- copia(palavra, i, 1) ... fimpara'
    ],
    solutionCode: `algoritmo "ContadorVogais"
var
   palavra, letra: caractere
   i, total, tam: inteiro
inicio
   leia(palavra)
   palavra <- minusc(palavra)
   total <- 0
   tam <- compr(palavra)

   para i de 1 ate tam faca
      letra <- copia(palavra, i, 1)
      se (letra = "a") ou (letra = "e") ou (letra = "i") ou (letra = "o") ou (letra = "u") entao
         total <- total + 1
      fimse
   fimpara

   escreval("Vogais: ", total)
fimalgoritmo`,
    testCases: [
      {
        input: ['visualg'],
        expectedOutputContains: ['Vogais: 3'],
        label: 'Amostra: "visualg" tem 3 vogais (i, u, a)'
      },
      {
        input: ['programacao'],
        expectedOutputContains: ['Vogais: 5'],
        label: 'Amostra: "programacao" tem 5 vogais'
      },
      {
        input: ['xyz'],
        expectedOutputContains: ['Vogais: 0'],
        label: 'Caso sem vogais: "xyz"',
        isSecret: true
      }
    ]
  },
  {
    id: '6-kyu-palindromo',
    title: 'Verificador de Palíndromo (Palindrome Checker)',
    track: 'kata',
    kyu: 6,
    honor: 30,
    tags: ['Strings', 'Algoritmos'],
    level: 'intermediario',
    category: 'Strings',
    classification: '6 Kyu • Strings',
    description: `
### Enunciado (Kata 6 Kyu)
Um palíndromo é uma palavra que se lê da mesma forma de trás para frente, como "radar" ou "ovo".

Leia uma palavra e exiba:
- **\`SIM\`** se for um palíndromo;
- **\`NAO\`** se não for.

A verificação deve ser insensível a maiúsculas (ex: "Arara" deve ser reconhecida como palíndromo).
    `,
    starterCode: `algoritmo "Palindromo"
var
   texto, invertida: caractere
   i, tam: inteiro
inicio
   leia(texto)
   // Inverta a palavra e compare

fimalgoritmo`,
    hints: [
      'texto <- minusc(texto)',
      'Inverta percorrendo: para i de tam ate 1 passo -1 faca invertida <- invertida + copia(texto, i, 1) fimpara'
    ],
    solutionCode: `algoritmo "Palindromo"
var
   texto, invertida, letra: caractere
   i, tam: inteiro
inicio
   leia(texto)
   texto <- minusc(texto)
   tam <- compr(texto)
   invertida <- ""

   para i de tam ate 1 passo -1 faca
      letra <- copia(texto, i, 1)
      invertida <- invertida + letra
   fimpara

   se texto = invertida entao
      escreval("SIM")
   senao
      escreval("NAO")
   fimse
fimalgoritmo`,
    testCases: [
      {
        input: ['radar'],
        expectedOutputContains: ['SIM'],
        label: 'Amostra: "radar" é palíndromo'
      },
      {
        input: ['portugol'],
        expectedOutputContains: ['NAO'],
        label: 'Amostra: "portugol" não é palíndromo'
      },
      {
        input: ['Arara'],
        expectedOutputContains: ['SIM'],
        label: 'Maiúsculas/Minúsculas: "Arara"',
        isSecret: true
      },
      {
        input: ['a'],
        expectedOutputContains: ['SIM'],
        label: 'Único caractere: "a"',
        isSecret: true
      }
    ]
  },
  {
    id: '6-kyu-pedra-papel-tesoura',
    title: 'Árbitro de Pedra, Papel e Tesoura (RPS Referee)',
    track: 'kata',
    kyu: 6,
    honor: 30,
    tags: ['Lógica', 'Jogos'],
    level: 'intermediario',
    category: 'Lógica',
    classification: '6 Kyu • Jogos',
    description: `
### Enunciado (Kata 6 Kyu)
Crie um árbitro para o jogo de "Pedra, Papel e Tesoura".
O programa deve ler:
1. A jogada do Jogador 1 (ex: \`pedra\`, \`papel\` ou \`tesoura\`)
2. A jogada do Jogador 2 (ex: \`pedra\`, \`papel\` ou \`tesoura\`)

Regras:
- Pedra vence Tesoura
- Tesoura vence Papel
- Papel vence Pedra
- Jogadas iguais resultam em empate

Saídas possíveis:
- **\`JOGADOR 1\`**
- **\`JOGADOR 2\`**
- **\`EMPATE\`**
    `,
    starterCode: `algoritmo "PedraPapelTesoura"
var
   j1, j2: caractere
inicio
   leia(j1)
   leia(j2)
   // Determine o vencedor

fimalgoritmo`,
    hints: [
      'j1 <- minusc(j1)',
      'j2 <- minusc(j2)',
      'se j1 = j2 entao escreval("EMPATE") senao ...'
    ],
    solutionCode: `algoritmo "PedraPapelTesoura"
var
   j1, j2: caractere
inicio
   leia(j1)
   leia(j2)
   j1 <- minusc(j1)
   j2 <- minusc(j2)

   se j1 = j2 entao
      escreval("EMPATE")
   senao
      se ((j1 = "pedra") e (j2 = "tesoura")) ou ((j1 = "tesoura") e (j2 = "papel")) ou ((j1 = "papel") e (j2 = "pedra")) entao
         escreval("JOGADOR 1")
      senao
         escreval("JOGADOR 2")
      fimse
   fimse
fimalgoritmo`,
    testCases: [
      {
        input: ['pedra', 'tesoura'],
        expectedOutputContains: ['JOGADOR 1'],
        label: 'Amostra: Pedra bate Tesoura'
      },
      {
        input: ['papel', 'tesoura'],
        expectedOutputContains: ['JOGADOR 2'],
        label: 'Amostra: Tesoura bate Papel'
      },
      {
        input: ['pedra', 'pedra'],
        expectedOutputContains: ['EMPATE'],
        label: 'Amostra: Empate'
      },
      {
        input: ['tesoura', 'pedra'],
        expectedOutputContains: ['JOGADOR 2'],
        label: 'Pedra do Jogador 2 bate Tesoura',
        isSecret: true
      }
    ]
  },
  {
    id: '6-kyu-collatz',
    title: 'Conjectura de Collatz (3n + 1 Problem)',
    track: 'kata',
    kyu: 6,
    honor: 30,
    tags: ['Matemática', 'Laços', 'Algoritmos'],
    level: 'intermediario',
    category: 'Algoritmos',
    classification: '6 Kyu • Algoritmos',
    description: `
### Enunciado (Kata 6 Kyu)
A Conjectura de Collatz é uma das mais famosas incógnitas da matemática. A regra é:
Dado um número inteiro positivo \(n\):
- Se for **par**: divida por 2 (\(n = n / 2\));
- Se for **ímpar**: multiplique por 3 e some 1 (\(n = 3n + 1\)).

Repita este processo até que \(n\) se torne igual a 1.
Seu objetivo é contar **quantas etapas/passos** foram necessários para atingir o número 1.

Formato de Saída:
\`\`\`text
Passos: <total>
\`\`\`

### Exemplo
Para \(n = 6\):
1. \(6 / 2 = 3\)
2. \(3 \times 3 + 1 = 10\)
3. \(10 / 2 = 5\)
4. \(5 \times 3 + 1 = 16\)
5. \(16 / 2 = 8\)
6. \(8 / 2 = 4\)
7. \(4 / 2 = 2\)
8. \(2 / 2 = 1\) (Fim: 8 passos)
    `,
    starterCode: `algoritmo "Collatz"
var
   n, passos: inteiro
inicio
   leia(n)
   passos <- 0
   // Use um laço enquanto n > 1 faca ...

fimalgoritmo`,
    hints: [
      'enquanto n > 1 faca',
      'se n mod 2 = 0 entao n <- n \\ 2 senao n <- (3 * n) + 1 fimse',
      'passos <- passos + 1'
    ],
    solutionCode: `algoritmo "Collatz"
var
   n, passos: inteiro
inicio
   leia(n)
   passos <- 0

   enquanto n > 1 faca
      se n mod 2 = 0 entao
         n <- n \\ 2
      senao
         n <- (3 * n) + 1
      fimse
      passos <- passos + 1
   fimenquanto

   escreval("Passos: ", passos)
fimalgoritmo`,
    testCases: [
      {
        input: ['6'],
        expectedOutputContains: ['Passos: 8'],
        label: 'Amostra: n = 6 requer 8 passos'
      },
      {
        input: ['1'],
        expectedOutputContains: ['Passos: 0'],
        label: 'Caso Limite: n = 1 já está no 1 (0 passos)'
      },
      {
        input: ['12'],
        expectedOutputContains: ['Passos: 9'],
        label: 'Amostra: n = 12 requer 9 passos',
        isSecret: true
      }
    ]
  },
  {
    id: '5-kyu-amplitude-vetor',
    title: 'Amplitude Térmica do Vetor (High and Low Range)',
    track: 'kata',
    kyu: 5,
    honor: 50,
    tags: ['Vetores', 'Aritmética', 'Estatística'],
    level: 'avancado',
    category: 'Vetores',
    classification: '5 Kyu • Vetores',
    description: `
### Enunciado (Kata 5 Kyu)
Na estatística, a **amplitude** é a diferença entre o maior e o menor valor de um conjunto de dados.

Construa um algoritmo que leia **5 números inteiros** para um vetor \`v[1..5]\`.
Em seguida, calcule e exiba:
1. O maior valor (\`Maior: <valor>\`)
2. O menor valor (\`Menor: <valor>\`)
3. A amplitude (\`Amplitude: <valor>\`)
    `,
    starterCode: `algoritmo "Amplitude"
var
   v: vetor [1..5] de inteiro
   i, maior, menor, amp: inteiro
inicio
   // Leia os 5 valores
   // Encontre o maior e menor e subtraia

fimalgoritmo`,
    hints: [
      'Após ler, inicialize: maior <- v[1] e menor <- v[1]',
      'Percorra de 2 até 5 atualizando maior e menor',
      'amp <- maior - menor'
    ],
    solutionCode: `algoritmo "Amplitude"
var
   v: vetor [1..5] de inteiro
   i, maior, menor, amp: inteiro
inicio
   para i de 1 ate 5 faca
      leia(v[i])
   fimpara

   maior <- v[1]
   menor <- v[1]

   para i de 2 ate 5 faca
      se v[i] > maior entao
         maior <- v[i]
      fimse
      se v[i] < menor entao
         menor <- v[i]
      fimse
   fimpara

   amp <- maior - menor

   escreval("Maior: ", maior)
   escreval("Menor: ", menor)
   escreval("Amplitude: ", amp)
fimalgoritmo`,
    testCases: [
      {
        input: ['10', '2', '35', '8', '14'],
        expectedOutputContains: ['Maior: 35', 'Menor: 2', 'Amplitude: 33'],
        label: 'Amostra: Valores mistos (Amplitude 33)'
      },
      {
        input: ['-10', '-50', '-5', '-20', '-1'],
        expectedOutputContains: ['Maior: -1', 'Menor: -50', 'Amplitude: 49'],
        label: 'Todos Negativos: Amplitude (-1 - (-50)) = 49',
        isSecret: true
      }
    ]
  },
  {
    id: '5-kyu-bubble-sort',
    title: 'Ordenação Crescente (Bubble Sort)',
    track: 'kata',
    kyu: 5,
    honor: 50,
    tags: ['Algoritmos', 'Ordenação', 'Vetores'],
    level: 'avancado',
    category: 'Algoritmos',
    classification: '5 Kyu • Algoritmos',
    description: `
### Enunciado (Kata 5 Kyu)
Implemente o clássico algoritmo de ordenação **Bubble Sort** (Método da Bolha).

O programa deve:
1. Ler **5 números inteiros** para um vetor \`v[1..5]\`.
2. Ordenar o vetor em **ordem crescente**.
3. Exibir os elementos ordenados, um por linha.

### Dica de Troca
Para trocar dois valores de posição:
\`\`\`portugol
aux <- v[j]
v[j] <- v[j + 1]
v[j + 1] <- aux
\`\`\`
    `,
    starterCode: `algoritmo "OrdenacaoBolha"
var
   v: vetor [1..5] de inteiro
   i, j, aux: inteiro
inicio
   // Leitura
   para i de 1 ate 5 faca
      leia(v[i])
   fimpara

   // Aplique o laço duplo de ordenação

   // Exibição ordenada
fimalgoritmo`,
    hints: [
      'Use dois laços: para i de 1 ate 4 faca para j de 1 ate 5 - i faca',
      'Se v[j] > v[j+1] faça a troca usando variável auxiliar aux.'
    ],
    solutionCode: `algoritmo "OrdenacaoBolha"
var
   v: vetor [1..5] de inteiro
   i, j, aux: inteiro
inicio
   para i de 1 ate 5 faca
      leia(v[i])
   fimpara

   para i de 1 ate 4 faca
      para j de 1 ate 5 - i faca
         se v[j] > v[j + 1] entao
            aux <- v[j]
            v[j] <- v[j + 1]
            v[j + 1] <- aux
         fimse
      fimpara
   fimpara

   para i de 1 ate 5 faca
      escreval(v[i])
   fimpara
fimalgoritmo`,
    testCases: [
      {
        input: ['50', '40', '30', '20', '10'],
        expectedOutputContains: ['10', '20', '30', '40', '50'],
        label: 'Amostra: Vetor Invertido'
      },
      {
        input: ['7', '2', '9', '1', '5'],
        expectedOutputContains: ['1', '2', '5', '7', '9'],
        label: 'Amostra: Elementos Aleatórios',
        isSecret: true
      }
    ]
  },
  {
    id: '4-kyu-numero-primo',
    title: 'Verificador de Números Primos (Prime Number Test)',
    track: 'kata',
    kyu: 4,
    honor: 80,
    tags: ['Matemática', 'Algoritmos', 'Otimização'],
    level: 'avancado',
    category: 'Matemática',
    classification: '4 Kyu • Algoritmos',
    description: `
### Enunciado (Kata 4 Kyu)
Um número primo é um número natural maior que 1 que possui apenas dois divisores positivos distintos: o número 1 e ele mesmo.

Crie um algoritmo que leia um número inteiro \`n\`.
- Se \(n \le 1\), exiba **\`NAO PRIMO\`**;
- Se for primo, exiba **\`PRIMO\`**;
- Se for composto (não primo e maior que 1), exiba **\`COMPOSTO\`** e na linha seguinte exiba o seu menor divisor primo maior que 1 no formato: \`Menor Divisor: <d>\`.

### Exemplos
- \`7\` &rarr; \`PRIMO\`
- \`1\` &rarr; \`NAO PRIMO\`
- \`15\` &rarr; \`COMPOSTO\` (e \`Menor Divisor: 3\`)
- \`49\` &rarr; \`COMPOSTO\` (e \`Menor Divisor: 7\`)
    `,
    starterCode: `algoritmo "VerificadorPrimos"
var
   n, d, menorDiv: inteiro
   ehPrimo: logico
inicio
   leia(n)
   // Lógica de verificação de número primo

fimalgoritmo`,
    hints: [
      'Se n <= 1 entao exiba "NAO PRIMO".',
      'Caso contrário, faça um laço com d de 2 ate raizq(n) ou até n - 1 procurando o primeiro divisor com (n mod d = 0).'
    ],
    solutionCode: `algoritmo "VerificadorPrimos"
var
   n, d, menorDiv: inteiro
   ehPrimo: logico
inicio
   leia(n)

   se n <= 1 entao
      escreval("NAO PRIMO")
   senao
      ehPrimo <- verdadeiro
      menorDiv <- 0
      d <- 2

      enquanto (d * d <= n) e ehPrimo faca
         se n mod d = 0 entao
            ehPrimo <- falso
            menorDiv <- d
         fimse
         d <- d + 1
      fimenquanto

      se ehPrimo entao
         escreval("PRIMO")
      senao
         escreval("COMPOSTO")
         escreval("Menor Divisor: ", menorDiv)
      fimse
   fimse
fimalgoritmo`,
    testCases: [
      {
        input: ['7'],
        expectedOutputContains: ['PRIMO'],
        label: 'Amostra: 7 é Primo'
      },
      {
        input: ['15'],
        expectedOutputContains: ['COMPOSTO', 'Menor Divisor: 3'],
        label: 'Amostra: 15 é Composto (Menor Divisor: 3)'
      },
      {
        input: ['1'],
        expectedOutputContains: ['NAO PRIMO'],
        label: 'Caso Especial: 1 Não é Primo',
        isSecret: true
      },
      {
        input: ['97'],
        expectedOutputContains: ['PRIMO'],
        label: 'Primo Maior: 97 é Primo',
        isSecret: true
      },
      {
        input: ['49'],
        expectedOutputContains: ['COMPOSTO', 'Menor Divisor: 7'],
        label: 'Quadrado de primo: 49',
        isSecret: true
      }
    ]
  },
  {
    id: '4-kyu-validador-cpf',
    title: 'Dígito Verificador Módulo 11 (CPF Checksum)',
    track: 'kata',
    kyu: 4,
    honor: 80,
    tags: ['Criptografia', 'Vetores', 'Algoritmos'],
    level: 'avancado',
    category: 'Algoritmos',
    classification: '4 Kyu • Criptografia',
    description: `
### Enunciado (Kata 4 Kyu)
No algoritmo oficial de validação de CPF brasileiro, o cálculo do **primeiro dígito verificador** funciona assim:
1. São fornecidos os **9 primeiros dígitos** da base.
2. Cada dígito é multiplicado por um peso decrescente iniciando em 10 até 2:
   \(\text{Soma} = d_1 \times 10 + d_2 \times 9 + \dots + d_9 \times 2\)
3. Calcula-se o resto da divisão por 11 (\(\text{Resto} = \text{Soma} \pmod{11}\)).
4. Se o resto for menor que 2, o dígito verificador é **0**; caso contrário, o dígito é \(11 - \text{Resto}\).

Seu algoritmo deve ler os 9 dígitos sequencialmente para um vetor \`digitos[1..9]\` e exibir:
\`\`\`text
Digito Verificador: <digito>
\`\`\`

### Exemplo
Para os 9 primeiros dígitos: \`1, 2, 3, 4, 5, 6, 7, 8, 9\`
- A soma ponderada é \(210\).
- \(210 \pmod{11} = 1\). Como é menor que 2, o dígito é \`0\`.
- Saída: \`Digito Verificador: 0\`
    `,
    starterCode: `algoritmo "PrimeiroDigitoCPF"
var
   d: vetor [1..9] de inteiro
   i, peso, soma, resto, dv: inteiro
inicio
   // Leia os 9 dígitos
   // Calcule a soma ponderada de pesos 10 a 2
   // Calcule o módulo 11

fimalgoritmo`,
    hints: [
      'soma <- 0',
      'para i de 1 ate 9 faca peso <- 11 - i; soma <- soma + (d[i] * peso) fimpara',
      'resto <- soma mod 11',
      'se resto < 2 entao dv <- 0 senao dv <- 11 - resto fimse'
    ],
    solutionCode: `algoritmo "PrimeiroDigitoCPF"
var
   d: vetor [1..9] de inteiro
   i, peso, soma, resto, dv: inteiro
inicio
   para i de 1 ate 9 faca
      leia(d[i])
   fimpara

   soma <- 0
   para i de 1 ate 9 faca
      peso <- 11 - i
      soma <- soma + (d[i] * peso)
   fimpara

   resto <- soma mod 11

   se resto < 2 entao
      dv <- 0
   senao
      dv <- 11 - resto
   fimse

   escreval("Digito Verificador: ", dv)
fimalgoritmo`,
    testCases: [
      {
        input: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        expectedOutputContains: ['Digito Verificador: 0'],
        label: 'Amostra: 123456789 (Dígito 0)'
      },
      {
        input: ['1', '1', '1', '4', '4', '4', '7', '7', '7'],
        expectedOutputContains: ['Digito Verificador: 3'],
        label: 'Amostra: 111444777 (Dígito 3)',
        isSecret: true
      },
      {
        input: ['0', '0', '0', '0', '0', '0', '0', '0', '1'],
        expectedOutputContains: ['Digito Verificador: 9'],
        label: 'Caso Especial: Dígito 9',
        isSecret: true
      }
    ]
  }
];
