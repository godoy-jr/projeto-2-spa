# Funções de negócio e testes

## Escopo

Esta etapa extrai regras de cálculo e processamento para funções puras em `src/utils/`. Elas recebem os dados por argumentos, devolvem um resultado e não alteram estado do React, elementos da página ou os arrays recebidos.

Apenas a conversão demonstrativa foi conectada ao formulário existente. Intervalos, filtros e ordenação estão preparados e testados, mas ainda não possuem interface.

## Funções

### Conversões — `src/utils/conversion.js`

- `convertWithDirectRate(amount, rate)`: calcula `valor × taxa`. Essa é a fórmula preparada para uma futura taxa direta da API.
- `convertWithDemoRates(amount, sourceCode, targetCode, demoRates)`: preserva a base fictícia atual e calcula `valor × (taxaBaseDaOrigem ÷ taxaBaseDoDestino)`.

As duas fórmulas são intencionalmente separadas. A função demonstrativa não deve ser reutilizada como se sua razão entre taxas fosse a taxa direta fornecida pela API.

Valores e taxas devem ser números finitos maiores que zero. Na conversão entre moedas iguais, uma taxa direta igual a `1` ou a divisão da mesma taxa demonstrativa preserva o valor.

### Períodos — `src/utils/periods.js`

`calculateHistoricalInterval(period, referenceDate)` aceita os identificadores `7d`, `15d`, `30d`, `3m`, `6m`, `1y`, `5y` e `10y`.

- a data de referência é recebida como argumento, o que torna os testes determinísticos;
- `from` e `to` são inclusivos;
- períodos em dias contêm exatamente 7, 15 ou 30 datas de calendário incluindo a referência; por isso, o início é calculado subtraindo `quantidade - 1` dias;
- meses e anos são subtraídos pelo calendário, não por uma quantidade aproximada de dias;
- quando o dia não existe no mês de destino, é usado o último dia válido, como `2024-05-31` menos três meses resultando em `2024-02-29`;
- strings `YYYY-MM-DD` e objetos `Date` são lidos e formatados com campos locais, sem conversão para UTC que possa deslocar o dia.

Como ambos os limites são inclusivos, `7d` com referência em `2024-05-31` produz `from: 2024-05-25` e `to: 2024-05-31`, totalizando sete datas. Para meses e anos, a regra permanece a subtração do período de calendário completo, com ajuste para o último dia válido quando necessário.

### Filtros — `src/utils/history.js`

`filterHistory(records, filters)` trabalha com registros no formato v2 estudado:

```json
{
  "date": "2024-05-01",
  "base": "EUR",
  "quote": "USD",
  "rate": 1.0708
}
```

Os filtros opcionais são `from`, `to`, `minRate` e `maxRate`. Todos os limites são inclusivos e podem ser combinados. A função rejeita datas inválidas, intervalo de datas invertido, cotações negativas e mínimo maior que o máximo.

### Ordenação — `src/utils/history.js`

`sortHistory(records, sortBy, direction)` ordena por `date` ou `rate`, usando `asc` ou `desc`. Antes de ordenar, cria uma cópia rasa do array; assim, a ordem original não é modificada.

## Comandos executados

```bash
npm test
npm run lint
npm run build
```

O projeto usa o executor nativo `node:test`, executado nesta etapa com Node `v24.13.1`, sem adicionar biblioteca de testes.

## Cenários verificados

- taxa direta e conversões demonstrativas conhecidas;
- conversão entre moedas iguais;
- valores, taxas e moedas demonstrativas inválidos;
- os oito períodos históricos;
- quantidade exata de datas inclusivas nos períodos de 7, 15 e 30 dias;
- viradas de mês e ano, último dia do mês e ano bissexto;
- preservação de datas locais sem deslocamento por UTC;
- filtros individuais e combinados, com limites inclusivos;
- intervalos de datas e cotações inválidos;
- ordenação cronológica e numérica nos dois sentidos;
- preservação do array original.

## Resultados efetivamente obtidos

- `npm test`: 21 testes aprovados, 0 falhas, 0 ignorados;
- `npm run lint`: concluído sem erros ou avisos;
- `npm run build`: concluído com sucesso, 28 módulos transformados.

O build criou `dist/` apenas como saída local de verificação. Essa pasta permanece ignorada e não faz parte das alterações do projeto.

## Verificação da camada de serviço v2

A camada `src/services/frankfurter.js` foi preparada isoladamente nesta verificação. Os contratos estão em `docs/SERVICES.md` e os testes em `test/frankfurter.test.js`.

Resultados efetivamente executados nesta etapa:
- npm test: 37 aprovados (21 de negócio e 16 de serviço), zero falhas e zero ignorados;
- npm run lint: aprovado;
- npm run build: aprovado, 28 módulos transformados.

Todos os testes de serviço usam fetch simulado; nenhuma consulta HTTP real foi executada nesta etapa. O primeiro build foi impedido por permissão de gravação de temporários e passou ao ser reexecutado com essa permissão. Nenhuma dependência foi adicionada e dist continua sendo apenas saída local ignorada.

## Verificação da integração do conversor

Após conectar catálogo e taxa aos componentes, foram executados:

- `npm test`: 37 testes aprovados, 0 falhas e 0 ignorados;
- `npm run lint`: concluído sem erros ou avisos;
- `npm run build`: concluído com sucesso, 29 módulos transformados.

Os testes automatizados continuam cobrindo funções e serviço com fetch simulado; não foi adicionada biblioteca de teste de componentes. Em revisão independente no navegador, foram confirmados: conversão com dados reais, inversão, preservação do valor informado, moedas iguais sem taxa/data, entradas inválidas e troca rápida do par sem exibir resultado antigo. Esse registro não amplia a evidência para outros cenários.

Como verificação HTTP separada dos testes automatizados e do Postman, as próprias funções do serviço consultaram a instância pública nesta execução: o catálogo retornou 170 moedas, incluindo BRL e EUR, e `getLatestRate('EUR', 'BRL')` retornou `{"date":"2026-10-27","base":"EUR","quote":"BRL","rate":5.9696}`. O servidor Vite local respondeu `200` e entregou o ponto de montagem e o módulo principal. Essas verificações confirmam conectividade e disponibilidade local, mas não substituem a revisão visual no navegador.

## Verificação da extração para custom hook

A consulta de taxa foi movida de `ConverterForm` para `src/hooks/useExchangeRate.js` sem alterar o contrato exibido pelo formulário. Depois da extração, foram executados:

- `npm test`: 44 testes aprovados, 0 falhas e 0 ignorados;
- `npm run lint`: concluído sem erros ou avisos;
- `npm run build`: concluído com sucesso, 30 módulos transformados.

`test/useExchangeRate.test.js` usa Testing Library e `jsdom` para renderizar o hook. O serviço é injetado e simulado; esses sete testes não acessam a rede real. Foram cobertos:

- sucesso;
- erro seguido de nova tentativa bem-sucedida;
- cancelamento ao trocar o par;
- descarte de resposta atrasada;
- sequência A → B → A sem reaproveitar a resposta da primeira revisão de A;
- moedas iguais sem chamada ao serviço;
- cancelamento ao desmontar durante uma consulta.

A primeira tentativa com `react-test-renderer` foi descartada por emitir aviso de descontinuação. A versão final usa `@testing-library/react` e `jsdom`; o pacote descontinuado não permanece nas dependências.

## Verificação do histórico e gráfico

Foram adicionados sete testes de `useHistoricalRates` com serviço simulado e sem rede: intervalo inclusivo e sucesso, ausência de dados, erro e nova tentativa, cancelamento ao trocar período, resposta atrasada, sequência A → B → A, moedas iguais e desmontagem. Após a implementação:

- `npm test`: 51 testes aprovados, 0 falhas e 0 ignorados;
- `npm run lint`: concluído sem erros ou avisos;
- `npm run build`: concluído com sucesso, 609 módulos transformados;
- o gráfico foi separado em chunk sob demanda, sem aviso de tamanho excessivo.

Em verificação HTTP real separada dos testes simulados, EUR/BRL de `2026-10-21` a `2026-10-27` retornou sete registros publicados. O primeiro foi `2026-10-21`, taxa `5.6459`, e o último `2026-10-27`, taxa `5.9427`. Essa consulta confirma o serviço e os dados, mas não substitui a revisão visual do gráfico.

## Verificação da tabela, filtros e CSV

Os testes existentes de processamento cobrem filtros individuais e combinados, intervalos inválidos, ordenação numérica e cronológica nos dois sentidos e preservação do array original. Foram adicionados cinco testes de CSV para:

- cabeçalhos e ordem recebida;
- escaping de `;`, aspas e quebra de linha;
- BOM UTF-8 e bloqueio de lista vazia;
- nome identificável com par e intervalo;
- criação do download e revogação da URL temporária.

Resultados após integrar tabela e exportação:

- `npm test`: 56 testes aprovados, 0 falhas e 0 ignorados;
- `npm run lint`: concluído sem erros ou avisos;
- `npm run build`: concluído com sucesso, 612 módulos transformados.

Esses testes comprovam processamento e geração do arquivo de forma simulada. O download efetivo pelo navegador e a apresentação visual da tabela permanecem para a revisão final.
