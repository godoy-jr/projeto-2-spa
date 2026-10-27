# Estrutura de componentes

## Visão geral

A aplicação usa componentes funcionais React. `App` mantém os dados demonstrativos, o par de moedas compartilhado e a composição da página; os demais componentes recebem apenas as informações necessárias por props. `ConverterForm` mantém localmente os estados que não precisam ser compartilhados.

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
| `App` | Define os dados demonstrativos, mantém o par compartilhado, realiza a inversão e conecta os componentes. | `src/App.jsx` | `src/App.module.css` | Nenhuma. | `sourceCode`: moeda de origem; `targetCode`: moeda de destino. |
| `Header` | Exibe a marca e gera os links da navegação principal. | `src/components/Header.jsx` | `src/components/Header.module.css` | `brandName`: nome da aplicação; `navigationItems`: objetos com `label` e `href`. | Nenhum. |
| `Hero` | Apresenta a proposta, o atalho para o conversor e uma cotação demonstrativa. | `src/components/Hero.jsx` | `src/components/Hero.module.css` | `title`, `description` e `exampleRate`. | Nenhum. |
| `ConverterForm` | Recebe o par compartilhado, permite alterá-lo ou invertê-lo, valida a entrada e calcula uma conversão com taxas fictícias. | `src/components/ConverterForm.jsx` | `src/components/ConverterForm.module.css` | `currencies`, `demoRates`, `sourceCode`, `targetCode`, `onSourceChange`, `onTargetChange` e `onInvertCurrencies`. | `amount`: valor informado; `result`: conversão calculada; `error`: mensagem de validação. |
| `HistorySection` | Identifica o par compartilhado e comunica que o histórico permanece em desenvolvimento. | `src/components/HistorySection.jsx` | `src/components/HistorySection.module.css` | `sourceCode` e `targetCode`. | Nenhum. |
| `Footer` | Exibe a identificação acadêmica e a fonte planejada para dados reais. | `src/components/Footer.jsx` | `src/components/Footer.module.css` | `dataSource`. | Nenhum. |

## Fluxo de dados e comportamento atual

- `App` passa dados para os componentes de cima para baixo por props.
- `App` mantém `sourceCode` e `targetCode` porque o conversor e a identificação do histórico utilizam o mesmo par.
- `ConverterForm` solicita alterações por callbacks; `App` atualiza o estado compartilhado e renderiza novamente os consumidores.
- A inversão troca origem e destino em `App`, preserva o valor local do formulário e limpa resultado e erro anteriores.
- `Header` transforma `navigationItems` em links usando `map`.
- `ConverterForm` transforma `currencies` em opções usando `map`.
- A submissão converte `amount` para número, rejeita entrada vazia, zero ou negativa e calcula os demais casos com `demoRates`.
- A alteração de qualquer moeda limpa resultado e erro anteriores.
- `amount`, `result` e `error` permanecem locais porque não são consumidos por outros componentes.

## Estilos globais

`src/index.css` contém somente tokens visuais, reset, tipografia base, altura mínima do ponto de montagem e indicação de foco visível.

## Pendências fora desta etapa

- navegação interativa e revisão visual final dos layouts do Figma;
- Collection e testes da API Frankfurter no Postman;
- integração da API, efeitos e custom hook;
- histórico, gráfico, tabela, filtros, ordenação e exportação CSV.
