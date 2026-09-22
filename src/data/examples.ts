export interface ExampleAlgorithm {
  id: string;
  title: string;
  description: string;
  code: string;
}

export const EXAMPLES: ExampleAlgorithm[] = [
  {
    id: 'ola-mundo',
    title: 'Olá Mundo',
    description: 'O algoritmo mais clássico com exibição de mensagens simples.',
    code: `algoritmo "OlaMundo"
// Disciplina  : Lógica de Programação
// Descrição   : Primeiro programa no VisualG
var
   mensagem: caractere
inicio
   mensagem <- "Olá, Mundo! Bem-vindo ao Portugol VisualG."
   escreval(mensagem)
   escreval("Aqui você pode criar variáveis, fazer cálculos e muito mais!")
fimalgoritmo`
  },
  {
    id: 'calculadora',
    title: 'Calculadora Aritmética',
    description: 'Demonstra leitura de dados, condicionais e operações aritméticas.',
    code: `algoritmo "CalculadoraSimples"
var
   v1, v2, res: real
   op: caractere
inicio
   escreval("=== CALCULADORA VISUALG ===")
   escreva("Digite o primeiro número: ")
   leia(v1)
   escreva("Digite o segundo número: ")
   leia(v2)
   escreval("Escolha a operação (+, -, *, /): ")
   leia(op)

   escolha op
      caso "+"
         res <- v1 + v2
         escreval("Resultado: ", v1, " + ", v2, " = ", res:6:2)
      caso "-"
         res <- v1 - v2
         escreval("Resultado: ", v1, " - ", v2, " = ", res:6:2)
      caso "*"
         res <- v1 * v2
         escreval("Resultado: ", v1, " * ", v2, " = ", res:6:2)
      caso "/"
         se v2 <> 0 entao
            res <- v1 / v2
            escreval("Resultado: ", v1, " / ", v2, " = ", res:6:2)
         senao
            escreval("Erro: Não é possível dividir por zero!")
         fimse
      outrocaso
         escreval("Operação inválida!")
   fimescolha
fimalgoritmo`
  },
  {
    id: 'fibonacci',
    title: 'Sequência de Fibonacci',
    description: 'Gera os N primeiros termos da famosa sequência matemática.',
    code: `algoritmo "Fibonacci"
var
   termo1, termo2, proximo, i, n: inteiro
inicio
   escreval("=== GERADOR DE FIBONACCI ===")
   escreva("Quantos termos deseja gerar? ")
   leia(n)

   termo1 <- 0
   termo2 <- 1

   escreval("Sequência gerada:")
   se n >= 1 entao
      escreva(termo1, " ")
   fimse
   se n >= 2 entao
      escreva(termo2, " ")
   fimse

   para i de 3 ate n faca
      proximo <- termo1 + termo2
      escreva(proximo, " ")
      termo1 <- termo2
      termo2 <- proximo
   fimpara

   escreval("")
   escreval("Fim da sequência!")
fimalgoritmo`
  },
  {
    id: 'media-escolar',
    title: 'Boletim e Média Escolar',
    description: 'Cálculo de média com pesos e verificação de aprovação.',
    code: `algoritmo "BoletimEscolar"
var
   aluno: caractere
   p1, p2, p3, media: real
inicio
   escreva("Nome do Aluno: ")
   leia(aluno)
   escreva("Nota da Prova 1: ")
   leia(p1)
   escreva("Nota da Prova 2: ")
   leia(p2)
   escreva("Nota da Prova 3: ")
   leia(p3)

   media <- (p1 + p2 + p3) / 3

   escreval("--------------------------------")
   escreval("Boletim Final: ", aluno)
   escreval("Média calculada: ", media:4:1)

   se media >= 7.0 entao
      escreval("Status: APROVADO(A)! Parabéns!")
   senao
      se media >= 5.0 entao
         escreval("Status: EM RECUPERAÇÃO.")
      senao
         escreval("Status: REPROVADO(A).")
      fimse
   fimse
   escreval("--------------------------------")
fimalgoritmo`
  },
  {
    id: 'vetores-pesquisa',
    title: 'Vetores e Pesquisa',
    description: 'Preenchimento de vetor numérico e pesquisa linear de um elemento.',
    code: `algoritmo "PesquisaVetor"
var
   numeros: vetor [1..5] de inteiro
   i, procurado, posicao: inteiro
   encontrado: logico
inicio
   escreval("Preenchendo o vetor com 5 números:")
   para i de 1 ate 5 faca
      escreva("Digite o valor para a posição ", i, ": ")
      leia(numeros[i])
   fimpara

   escreval("")
   escreva("Qual número você deseja procurar no vetor? ")
   leia(procurado)

   encontrado <- falso
   posicao <- 0

   para i de 1 ate 5 faca
      se numeros[i] = procurado entao
         encontrado <- verdadeiro
         posicao <- i
         interrompa
      fimse
   fimpara

   se encontrado entao
      escreval("Sucesso! O número ", procurado, " foi encontrado na posição ", posicao, " do vetor.")
   senao
      escreval("O número ", procurado, " não está presente no vetor.")
   fimse
fimalgoritmo`
  },
  {
    id: 'funcoes-matematicas',
    title: 'Funções Matemáticas e Strings',
    description: 'Demonstração de raiz quadrada, potências e funções de texto.',
    code: `algoritmo "MatematicaETexto"
var
   x: real
   palavra: caractere
inicio
   x <- 25.0
   escreval("Raiz quadrada de ", x, " = ", raizq(x))
   escreval("Potência 2^5 = ", 2 ^ 5)
   escreval("Valor de PI aproximado: ", pi:6:4)

   palavra <- "visualg brasil"
   escreval("Tamanho de '", palavra, "': ", compr(palavra), " letras")
   escreval("Em maiúsculas: ", maiusc(palavra))
   escreval("Primeiras 7 letras: ", copia(palavra, 1, 7))
fimalgoritmo`
  }
];
