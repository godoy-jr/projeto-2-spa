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

A camada src/services/frankfurter.js está preparada, mas não conectada ao React. Os contratos estão em docs/SERVICES.md e os testes em test/frankfurter.test.js.

Resultados efetivamente executados nesta etapa:
- npm test: 37 aprovados (21 de negócio e 16 de serviço), zero falhas e zero ignorados;
- npm run lint: aprovado;
- npm run build: aprovado, 28 módulos transformados.

Todos os testes de serviço usam fetch simulado; nenhuma consulta HTTP real foi executada nesta etapa. O primeiro build foi impedido por permissão de gravação de temporários e passou ao ser reexecutado com essa permissão. Nenhuma dependência foi adicionada e dist continua sendo apenas saída local ignorada.