class Aluno {
  #nome;
  #idade;
  #curso;
  #notaFinal;

  constructor(nome, idade, curso, notaFinal) {
    this.#nome = nome;
    this.#idade = idade;
    this.#curso = curso;
    this.#notaFinal = notaFinal;
  }

  get nome() { return this.#nome; }
  set nome(valor) { this.#nome = valor; }

  get idade() { return this.#idade; }
  set idade(valor) { this.#idade = valor; }

  get curso() { return this.#curso; }
  set curso(valor) { this.#curso = valor; }

  get notaFinal() { return this.#notaFinal; }
  set notaFinal(valor) { this.#notaFinal = valor; }

  // Retorna true se a nota final for maior ou igual a 7
  isAprovado() {
    return this.#notaFinal >= 7;
  }

  toString() {
    const situacao = this.isAprovado() ? "Aprovado" : "Reprovado";
    return `${this.#nome}, ${this.#idade} anos, curso: ${this.#curso}, nota final: ${this.#notaFinal.toFixed(1)} (${situacao})`;
  }
}
