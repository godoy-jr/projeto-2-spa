# Estrutura de componentes

## Visão geral

A aplicação usa componentes funcionais React. `App` mantém o par compartilhado, carrega o catálogo de moedas e compõe a página; os demais componentes recebem apenas as informações necessárias por props. `ConverterForm` consulta a taxa do par e mantém localmente os estados que não precisam ser compartilhados.

Cada componente visual importa seu próprio arquivo `.module.css`. O Vite transforma as classes dos CSS Modules em identificadores locais, evitando colisões entre nomes iguais usados por componentes diferentes. No JSX, uma classe é aplicada pelo objeto importado, por exemplo `className={styles.hero}`. Tokens de cor, reset, tipografia base e foco permanecem globais em `src/index.css`.

## Relação entre componentes

```text
main.jsx
└── App
    ├── Header
    ├── main
    │   ├── Hero
    │   ├── ConverterForm
    │   └── HistorySection
    └── Footer
```

## Componentes

| Componente | Responsabilidade | Arquivo JSX | CSS Module | Principais props | Estados |
| --- | --- | --- | --- | --- | --- |
| `App` | Carrega as moedas, mantém o par compartilhado, sua revisão, erros do catálogo e realiza a inversão. | `src/App.jsx` | `src/App.module.css` | Nenhuma. | `sourceCode`, `targetCode`, `pairRevision`, `currencies`, status/erro/tentativa do catálogo. |
| `Header` | Exibe a marca e gera os links da navegação principal. | `src/components/Header.jsx` | `src/components/Header.module.css` | `brandName`: nome da aplicação; `navigationItems`: objetos com `label` e `href`. | Nenhum. |
| `Hero` | Apresenta a proposta, o atalho para o conversor e identifica a Frankfurter como fonte. | `src/components/Hero.jsx` | `src/components/Hero.module.css` | `title` e `description`. | Nenhum. |
| `ConverterForm` | Consome o hook da taxa, apresenta estados da requisição, valida o valor e calcula com a taxa direta. | `src/components/ConverterForm.jsx` | `src/components/ConverterForm.module.css` | Catálogo e seu estado, par e revisão, callbacks de alteração, inversão e nova tentativa. | `amount`, `result` e erro de validação. |
| `HistorySection` | Identifica o par compartilhado e comunica que o histórico permanece em desenvolvimento. | `src/components/HistorySection.jsx` | `src/components/HistorySection.module.css` | `sourceCode` e `targetCode`. | Nenhum. |
| `Footer` | Exibe a identificação acadêmica e a fonte planejada para dados reais. | `src/components/Footer.jsx` | `src/components/Footer.module.css` | `dataSource`. | Nenhum. |

## Fluxo de dados e comportamento atual

- `App` passa dados para os componentes de cima para baixo por props.
- `App` mantém `sourceCode` e `targetCode` porque o conversor e a identificação do histórico utilizam o mesmo par, além de incrementar `pairRevision` a cada troca.
- `App` consulta `getCurrencies` em um `useEffect`, cancela a consulta ao desmontar ou tentar novamente e apresenta carregamento/erro ao formulário.
- `ConverterForm` solicita alterações por callbacks; `App` atualiza o estado compartilhado e renderiza novamente os consumidores.
- A inversão troca origem e destino em `App`, preserva o valor local do formulário e limpa resultado e erro anteriores.
- `Header` transforma `navigationItems` em links usando `map`.
- `ConverterForm` transforma `currencies` em opções usando `map`.
- `ConverterForm` consome `useExchangeRate` e permanece responsável pela apresentação e conversão.
- `useExchangeRate` consulta `getLatestRate` em um `useEffect` e usa `AbortController` mais um identificador monotônico para descartar respostas obsoletas.
- O estado da cotação registra par, revisão e tentativa. Mesmo que o usuário saia de um par e retorne rapidamente, dados da revisão anterior não são mostrados como atuais.
- A submissão rejeita entrada vazia, não finita, zero ou negativa e delega `valor × taxa` a `convertWithDirectRate`.
- Quando as moedas são iguais, o valor é preservado sem consultar ou inventar taxa e data.
- A alteração de qualquer moeda limpa resultado e erro anteriores.
- `amount`, `result` e `error` permanecem locais porque não são consumidos por outros componentes.

## Estilos globais

`src/index.css` contém somente tokens visuais, reset, tipografia base, altura mínima do ponto de montagem e indicação de foco visível.

## Pendências fora desta etapa

- navegação interativa e revisão visual final dos layouts do Figma;
- histórico, gráfico, tabela, filtros, ordenação e exportação CSV.

## Funções de negócio

As funções puras de conversão, períodos, filtros e ordenação ficam em `src/utils/`. O conversor real consome `convertWithDirectRate`; períodos, filtros e ordenação permanecem preparados para as próximas telas. Os cenários e resultados estão documentados em `docs/FUNCTION_TESTS.md`.

## Custom hook

`src/hooks/useExchangeRate.js` recebe origem, destino, revisão do par e indicação de que a consulta está habilitada. Ele devolve `quote`, `status`, `error` e `retry`. O hook encapsula carregamento por token, sucesso, erro, ausência de dados, identidade de moedas, cancelamento e proteção contra respostas antigas. Nos testes, `requestRate` permite injetar um serviço simulado; a aplicação usa `getLatestRate` por padrão.
