# DevTech Academy - Gerenciamento de Alunos

CRUD de alunos em HTML + JavaScript puro, com relatórios usando
`filter`, `map`, `reduce`, `sort` e `forEach`.

## Como rodar (Docker)

```bash
docker compose up --build
```

Acesse http://localhost:8081

## Estrutura

- `index.html`: formulário, tabela e botões de relatório
- `Aluno.js`: classe `Aluno` (construtor, get/set, `isAprovado()`, `toString()`)
- `script.js`: eventos, CRUD, arrow functions e relatórios
- `Dockerfile` / `docker-compose.yml`: ambiente de desenvolvimento

## Versionamento

```bash
git init
git add .
git commit -m "feat: sistema de gerenciamento de alunos"
git branch -M main
git remote add origin <URL_DO_REPOSITORIO>
git push -u origin main
```
