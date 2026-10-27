# Câmbio Fácil

Single Page Application acadêmica para conversão e análise de moedas. O projeto será desenvolvido de forma incremental com React, Vite e JavaScript.

> Status atual: conversor integrado à Frankfurter v2, com catálogo de moedas, taxa direta, data efetiva, inversão, cancelamento e estados da consulta. Histórico e análise ainda estão pendentes.

## Objetivo

Construir uma interface em português que permita converter moedas com dados da API Frankfurter e analisar o histórico das cotações. Cada funcionalidade será implementada e testada em uma etapa própria.

## Tecnologias da etapa atual

- React;
- JavaScript e JSX;
- Componentes e props;
- Eventos e `useState`;
- `useEffect`, `fetch` e `async/await`;
- Funções puras e testes automatizados com `node:test`;
- Vite;
- CSS Modules e CSS global de base;
- CSS responsivo;
- Git.

## Como executar

Requisitos: Node.js e npm instalados.

```bash
npm install
npm run dev
```

Abra no navegador o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

Para conferir a qualidade do código e gerar a versão de produção:

```bash
npm test
npm run lint
npm run build
```

## Funcionalidades planejadas

- informar um valor e selecionar as moedas de origem e destino;
- converter valores usando cotações reais da API Frankfurter;
- exibir a data da cotação;
- tratar carregamento, erros e entradas inválidas;
- consultar o histórico por período e apresentar um gráfico;
- exibir dados em tabela com filtros e ordenação;
- exportar os dados exibidos para CSV.

Os requisitos funcionais e não funcionais estão consolidados em `docs/REQUIREMENTS.md`.

## Prototipação

O [arquivo do projeto no Figma](https://www.figma.com/design/uX1l7OXMaKBnelFgvZ7ymi) contém wireframes de baixa fidelidade, layouts de média fidelidade e estados para desktop e mobile. Os layouts são editáveis, mas ainda estáticos e sem navegação interativa. Consulte `docs/FIGMA.md` para o registro completo e para a diferenciação entre o trabalho do projeto e as referências HERMES fornecidas pelo professor.

## Evolução planejada

1. Preparação, JSX e interface estática — concluída;
2. Componentização e props — concluída;
3. Eventos, formulários e `useState` — concluída;
4. Lifting State Up e inversão de moedas — concluída;
5. Funções de negócio e processamento — concluída;
6. Camada de serviço com `fetch` e `async/await` — concluída;
7. Conversor com moedas e taxas reais usando `useEffect` — concluída;
8. Custom hook reutilizável;
9. Histórico e gráfico;
10. Tabela, filtros e ordenação;
11. Exportação CSV;
12. Revisão, testes, documentação e publicação.

## Entregáveis e pendências

- [ ] Repositório público no GitHub;
- [ ] Aplicação publicada e funcionando;
- [ ] Documentação final do projeto;
- [x] Wireframes e protótipos estáticos criados no Figma;
- [ ] Navegação interativa configurada no Figma;
- [x] Collection da Frankfurter v2 criada e executada no Postman, com os resultados documentados em `docs/API_TESTS.md`;
- [ ] Histórico real de commits incrementais.

## Fonte dos dados

O conversor consulta a API Frankfurter v2 e calcula o resultado com `valor × taxa`. A interface mostra a taxa e a data efetiva devolvidas pela API. Taxas de referência não devem ser interpretadas como cotações intradiárias em tempo real.

## Camada de serviço

As consultas de moedas, taxa e histórico estão em `src/services/frankfurter.js`, com validação e cancelamento. Catálogo e taxa atual já são usados pelo conversor; histórico permanece preparado para a próxima etapa. Contratos e testes: [docs/SERVICES.md](docs/SERVICES.md).
