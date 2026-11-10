/* =========================================================
   Estado da aplicação (armazenado em memória)
   ========================================================= */
const CURSOS = ["JavaScript", "Python", "Java"];

const alunos = [];          // array de objetos da classe Aluno
let indiceEmEdicao = null;  // posição do aluno em edição (null = cadastrando)
let relatorioAtual = null;  // último relatório exibido (para atualizar sozinho)

/* =========================================================
   Referências ao DOM
   ========================================================= */
const form = document.getElementById("form-aluno");
const tituloForm = document.getElementById("titulo-form");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const tabela = document.getElementById("tabela-alunos");
const areaResultado = document.getElementById("resultado");

const campos = {
  nome: document.getElementById("nome"),
  idade: document.getElementById("idade"),
  curso: document.getElementById("curso"),
  nota: document.getElementById("nota"),
};

/* =========================================================
   Exercício 3 - Arrow functions nas operações de manipulação
   dos dados
   ========================================================= */
const lerFormulario = () => ({
  nome: campos.nome.value.trim(),
  idade: parseInt(campos.idade.value),
  curso: campos.curso.value,
  notaFinal: parseFloat(campos.nota.value),
});

const adicionarAluno = dados => {
  const aluno = new Aluno(dados.nome, dados.idade, dados.curso, dados.notaFinal);
  alunos.push(aluno);
  return aluno;
};

const atualizarAluno = (indice, dados) => {
  const aluno = alunos[indice];
  aluno.nome = dados.nome;
  aluno.idade = dados.idade;
  aluno.curso = dados.curso;
  aluno.notaFinal = dados.notaFinal;
  return aluno;
};

const removerAluno = indice => alunos.splice(indice, 1)[0];

const formatarNota = nota => nota.toFixed(1).replace(".", ",");

const media = (lista, extrair) =>
  lista.length === 0
    ? 0
    : lista.reduce((soma, item) => soma + extrair(item), 0) / lista.length;

/* =========================================================
   Renderização da tabela (Exercício 1)
   ========================================================= */
const criarCelula = texto => {
  const td = document.createElement("td");
  td.textContent = texto; // textContent evita injeção de HTML
  return td;
};

function renderizarTabela() {
  tabela.innerHTML = "";

  alunos.forEach((aluno, indice) => {
    const linha = document.createElement("tr");

    linha.appendChild(criarCelula(aluno.nome));
    linha.appendChild(criarCelula(aluno.idade));
    linha.appendChild(criarCelula(aluno.curso));
    linha.appendChild(criarCelula(formatarNota(aluno.notaFinal)));
    linha.appendChild(criarCelula(aluno.isAprovado() ? "Aprovado" : "Reprovado"));

    const tdAcoes = document.createElement("td");

    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    // Exercício 3: addEventListener com função anônima
    botaoEditar.addEventListener("click", function () {
      iniciarEdicao(indice);
    });

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.addEventListener("click", function () {
      excluir(indice);
    });

    tdAcoes.appendChild(botaoEditar);
    tdAcoes.appendChild(botaoExcluir);
    linha.appendChild(tdAcoes);

    tabela.appendChild(linha);
  });

  if (alunos.length === 0) {
    const linha = document.createElement("tr");
    const td = criarCelula("Nenhum aluno cadastrado.");
    td.colSpan = 6;
    linha.appendChild(td);
    tabela.appendChild(linha);
  }
}

/* =========================================================
   Cadastro, edição e exclusão
   ========================================================= */
/* =========================================================
   Validações (além das do HTML, por segurança)
   ========================================================= */
// Nome: começa com letra; só letras, espaços, apóstrofo, hífen e ponto
const nomeValido = nome => /^\p{L}[\p{L}' .-]*$/u.test(nome);

function sairDoModoEdicao() {
  indiceEmEdicao = null;
  tituloForm.textContent = "Cadastrar aluno";
  btnSalvar.textContent = "Cadastrar";
  btnCancelar.hidden = true;
  form.reset();
}

function iniciarEdicao(indice) {
  const aluno = alunos[indice];
  if (!aluno) return;

  indiceEmEdicao = indice;
  campos.nome.value = aluno.nome;
  campos.idade.value = aluno.idade;
  campos.curso.value = aluno.curso;
  campos.nota.value = aluno.notaFinal;

  tituloForm.textContent = `Editando aluno: ${aluno.nome}`;
  btnSalvar.textContent = "Salvar alterações";
  btnCancelar.hidden = false;
  campos.nome.focus();
}

function excluir(indice) {
  const aluno = alunos[indice];
  if (!aluno) return;

  if (!confirm(`Excluir o aluno "${aluno.nome}"?`)) return;

  removerAluno(indice);

  // Mantém o modo de edição coerente depois que o array encolhe
  if (indiceEmEdicao === indice) {
    sairDoModoEdicao();
  } else if (indiceEmEdicao !== null && indiceEmEdicao > indice) {
    indiceEmEdicao--;
  }

  console.log("Aluno excluído:", aluno.toString());
  alert(`Aluno "${aluno.nome}" excluído com sucesso!`);
  atualizarTela();
}

// Exercício 3: addEventListener com função anônima
form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const dados = lerFormulario();

  if (!nomeValido(dados.nome)) {
    alert("Nome inválido: use apenas letras, espaços, apóstrofo, hífen ou ponto (sem números).");
    campos.nome.focus();
    return;
  }

  if (indiceEmEdicao === null) {
    const novo = adicionarAluno(dados);
    console.log("Aluno cadastrado:", novo.toString());
    alert(`Aluno "${novo.nome}" cadastrado com sucesso!`);
  } else {
    const editado = atualizarAluno(indiceEmEdicao, dados);
    console.log("Aluno editado:", editado.toString());
    alert(`Aluno "${editado.nome}" atualizado com sucesso!`);
    sairDoModoEdicao();
  }

  form.reset();
  atualizarTela();
});

btnCancelar.addEventListener("click", function () {
  sairDoModoEdicao();
});

/* =========================================================
   Exercício 4 - Relatórios com filter, map, reduce, sort, forEach
   ========================================================= */
function mostrarRelatorio(titulo, linhas, textoVazio) {
  areaResultado.innerHTML = "";

  const h3 = document.createElement("h3");
  h3.textContent = titulo;
  areaResultado.appendChild(h3);

  if (linhas.length === 0) {
    const p = document.createElement("p");
    p.textContent = textoVazio;
    areaResultado.appendChild(p);
    return;
  }

  const ul = document.createElement("ul");
  linhas.forEach(texto => {
    const li = document.createElement("li");
    li.textContent = texto;
    ul.appendChild(li);
  });
  areaResultado.appendChild(ul);
}

const SEM_ALUNOS = "Nenhum aluno cadastrado.";

// 1) Alunos aprovados (notaFinal >= 7) -> filter + map
const relatorioAprovados = () => {
  const aprovados = alunos
    .filter(a => a.isAprovado())
    .map(a => `${a.nome} (${a.curso}) - nota ${formatarNota(a.notaFinal)}`);
  mostrarRelatorio("Alunos aprovados (nota final >= 7)", aprovados, "Nenhum aluno aprovado.");
};

// 2) Média das notas finais -> reduce
const relatorioMediaNotas = () => {
  const linhas = alunos.length ? [formatarNota(media(alunos, a => a.notaFinal))] : [];
  mostrarRelatorio("Média das notas finais", linhas, SEM_ALUNOS);
};

// 3) Média das idades -> reduce
const relatorioMediaIdades = () => {
  const linhas = alunos.length
    ? [`${media(alunos, a => a.idade).toFixed(1).replace(".", ",")} anos`]
    : [];
  mostrarRelatorio("Média das idades", linhas, SEM_ALUNOS);
};

// 4) Nomes em ordem alfabética -> map + sort
const relatorioAlfabetico = () => {
  const nomes = alunos
    .map(a => a.nome)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  mostrarRelatorio("Nomes em ordem alfabética", nomes, SEM_ALUNOS);
};

// 5) Quantidade de alunos por curso -> reduce + forEach
const relatorioPorCurso = () => {
  if (alunos.length === 0) {
    mostrarRelatorio("Quantidade de alunos por curso", [], SEM_ALUNOS);
    return;
  }

  const contagem = alunos.reduce((acc, a) => {
    acc[a.curso] = (acc[a.curso] || 0) + 1;
    return acc;
  }, {});

  const linhas = [];
  CURSOS.forEach(curso => {
    linhas.push(`${curso}: ${contagem[curso] || 0}`);
  });
  mostrarRelatorio("Quantidade de alunos por curso", linhas, SEM_ALUNOS);
};

// Cada botão guarda o relatório exibido para mantê-lo atualizado
const ligarBotaoRelatorio = (idBotao, relatorio) => {
  document.getElementById(idBotao).addEventListener("click", function () {
    relatorioAtual = relatorio;
    relatorio();
  });
};

ligarBotaoRelatorio("btn-aprovados", relatorioAprovados);
ligarBotaoRelatorio("btn-media-notas", relatorioMediaNotas);
ligarBotaoRelatorio("btn-media-idades", relatorioMediaIdades);
ligarBotaoRelatorio("btn-alfabetica", relatorioAlfabetico);
ligarBotaoRelatorio("btn-por-curso", relatorioPorCurso);

/* =========================================================
   Atualização geral da tela
   ========================================================= */
function atualizarTela() {
  renderizarTabela();
  if (relatorioAtual) relatorioAtual();
}

renderizarTabela();
