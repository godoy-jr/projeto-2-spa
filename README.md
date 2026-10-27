# Câmbio Fácil

Single Page Application acadêmica para conversão e análise de moedas. O projeto será desenvolvido de forma incremental com React, Vite e JavaScript.

> Status atual: formulário interativo com eventos e estado local. A aplicação ainda não consulta cotações reais.

## Objetivo

Construir uma interface em português que permita converter moedas com dados da API Frankfurter e analisar o histórico das cotações. Cada funcionalidade será implementada e testada em uma etapa própria.

## Tecnologias da etapa atual

- React;
- JavaScript e JSX;
- Componentes e props;
- Eventos e `useState`;
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
4. Lifting State Up;
5. Integração com a API usando `fetch`, `async/await` e `useEffect`;
6. Custom hook e tratamento dos estados da requisição;
7. Histórico e gráfico;
8. Tabela, filtros e ordenação;
9. Exportação CSV;
10. Revisão, testes, documentação e publicação.

## Entregáveis e pendências

- [ ] Repositório público no GitHub;
- [ ] Aplicação publicada e funcionando;
- [ ] Documentação final do projeto;
- [x] Wireframes e protótipos estáticos criados no Figma;
- [ ] Navegação interativa configurada no Figma;
- [ ] Collection criada no Postman;
- [ ] Histórico real de commits incrementais.

## Fonte dos dados

Quando a integração for implementada, as cotações reais virão da API Frankfurter. Até lá, todo valor mostrado na interface está identificado como demonstrativo e não deve ser interpretado como uma cotação atual.
