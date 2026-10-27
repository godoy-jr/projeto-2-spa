# Câmbio Fácil

Single Page Application acadêmica para conversão e análise de moedas. O projeto será desenvolvido de forma incremental com React, Vite e JavaScript.

> Status atual: conversor, histórico, gráfico, tabela, filtros, ordenação e CSV implementados com dados da Frankfurter v2 e publicados no GitHub Pages. Os fluxos especificados abaixo foram revisados no navegador.

**Aplicação publicada:** [https://godoy-jr.github.io/projeto-2-spa/](https://godoy-jr.github.io/projeto-2-spa/)

## Objetivo

Construir uma interface em português que permita converter moedas com dados da API Frankfurter e analisar o histórico das cotações. Cada funcionalidade será implementada e testada em uma etapa própria.

## Tecnologias da etapa atual

- React;
- JavaScript e JSX;
- Componentes e props;
- Eventos e `useState`;
- `useEffect`, `fetch` e `async/await`;
- Funções puras e testes automatizados com `node:test`;
- Testes de hooks com Testing Library e `jsdom`;
- Gráfico responsivo com Recharts;
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

O [arquivo do projeto no Figma](https://www.figma.com/design/uX1l7OXMaKBnelFgvZ7ymi) contém wireframes de baixa fidelidade, layouts de média fidelidade, estados e dois fluxos demonstrativos para desktop e mobile. Os exemplos são navegáveis entre frames, mas não executam API, preenchimento de campos ou download real. Consulte `docs/FIGMA.md` para as evidências, limitações e a diferenciação entre o trabalho do projeto e as referências HERMES fornecidas pelo professor.

## Evolução planejada

1. Preparação, JSX e interface estática — concluída;
2. Componentização e props — concluída;
3. Eventos, formulários e `useState` — concluída;
4. Lifting State Up e inversão de moedas — concluída;
5. Funções de negócio e processamento — concluída;
6. Camada de serviço com `fetch` e `async/await` — concluída;
7. Conversor com moedas e taxas reais usando `useEffect` — concluída;
8. Custom hook reutilizável para taxa — concluída;
9. Histórico e gráfico — concluída;
10. Tabela, filtros e ordenação — concluída;
11. Exportação CSV — concluída;
12. Revisão, testes, documentação e publicação — concluída para os fluxos registrados; verificações manuais não executadas continuam indicadas como pendentes.

## Entregáveis e pendências

- [x] Repositório público no GitHub;
- [x] [Aplicação publicada e funcionando](https://godoy-jr.github.io/projeto-2-spa/);
- [x] Documentação final do projeto;
- [x] Wireframes, protótipos e exemplos navegáveis desktop/mobile criados no Figma;
- [ ] Percurso completo do Figma conferido no modo de apresentação;
- [x] Collection da Frankfurter v2 criada e executada no Postman, com os resultados documentados em `docs/API_TESTS.md`;
- [x] Histórico real de commits incrementais.

Consulte o estado verificável da entrega em [`docs/DELIVERY_CHECKLIST.md`](docs/DELIVERY_CHECKLIST.md).

## Verificação atual

- 56 testes automatizados aprovados;
- lint concluído sem erros ou avisos;
- build de produção concluído;
- revisão independente confirmou os oito períodos, gráfico mobile, filtro de cotação, contagem, ordenação decrescente, CSV correspondente às linhas visíveis, bloqueio da exportação vazia e validação de mínimo maior que máximo;
- na aplicação publicada, foram testadas a conversão real e o histórico de sete dias;
- outros fluxos não cobertos por essa revisão não são considerados verificados;
- GitHub Actions concluído com sucesso na tentativa 2 da execução `40588883001`, e a URL pública respondeu corretamente.

## Fonte dos dados

O conversor consulta a API Frankfurter v2 e calcula o resultado com `valor × taxa`. A interface mostra a taxa e a data efetiva devolvidas pela API. Taxas de referência não devem ser interpretadas como cotações intradiárias em tempo real.

## Camada de serviço

As consultas de moedas, taxa e histórico estão em `src/services/frankfurter.js`, com validação e cancelamento. Os três fluxos já são usados pela aplicação. Contratos e testes: [docs/SERVICES.md](docs/SERVICES.md).
