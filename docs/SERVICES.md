# Camada de serviço Frankfurter v2

## Escopo

`src/services/frankfurter.js` consulta os endpoints v2 da [documentação oficial](https://frankfurter.dev/). A camada não importa React nem acessa o DOM. `App` usa o catálogo e `ConverterForm` usa a taxa mais recente; o histórico ainda não foi conectado.

## Funções e contratos

Todas as funções são assíncronas e aceitam um último argumento opcional `{ signal, fetchImpl }`. No uso normal, `fetchImpl` é o `fetch` global. Nos testes ele é substituído, sem modificar o global e sem acessar a rede.

- `getCurrencies(options)`: consulta `/v2/currencies`; retorna o array original de moedas com `iso_code`, `name` e demais metadados preservados. Valida os campos utilizados pela futura interface, sem impor contagem fixa ou proibir campos adicionais.
- `getLatestRate(base, quote, options)`: consulta `/v2/rate/BASE/QUOTE`; retorna `{ date, base, quote, rate }` e eventuais campos extras. Exige par correspondente, data válida e taxa numérica finita positiva. Preserva a data efetiva da resposta.
- `getHistoricalRates(base, quote, from, to, options)`: consulta `/v2/rates` com `URLSearchParams` (`base`, `quotes`, `from`, `to`); retorna o array plano, inclusive `[]` para ausência de dados. Valida datas, par e taxa de cada registro e limites inclusivos. Não interpola dias nem fabrica registros, não ordena e não altera o conteúdo recebido.

Os códigos de entrada são normalizados para maiúsculas; as datas usam `YYYY-MM-DD` e são validadas por calendário. Intervalos invertidos são rejeitados antes da consulta.

## Moedas iguais

`getLatestRate('EUR', 'EUR')` retorna `null` sem HTTP. Isso representa uma identidade matemática, não uma cotação publicada. O conversor conserva o valor informado, apresenta “Mesma moeda — sem consulta de cotação ou data efetiva” e não cria dados fictícios. A consulta histórica com moedas iguais rejeita com `INVALID_INPUT`; a futura interface histórica deverá solicitar moedas distintas, sem gerar série artificial.

## Erros e cancelamento

`FrankfurterError` expõe `code` e, quando aplicável, `status` e `cause`:

| Código | Significado |
| --- | --- |
| `INVALID_INPUT` | Código de moeda ou intervalo inválido |
| `HTTP` | `response.ok` falso; preserva `status`, mesmo sem corpo JSON |
| `NETWORK` | Falha no fetch ou interrupção ao ler a resposta |
| `INVALID_RESPONSE` | JSON inválido ou dados incompatíveis com o contrato |

Cancelamentos são propagados sem virar erro HTTP/rede, tanto antes da chamada quanto durante fetch e leitura do corpo. Os efeitos atuais encaminham o `signal`, cancelam consultas substituídas e verificam a identidade da requisição antes de aceitar uma resposta. O estado da taxa também é associado ao par, à revisão e à tentativa atual.

## Integração atual

- o catálogo possui carregamento, erro e ação de tentar novamente;
- a taxa possui carregamento, erro, ausência de dados e nova tentativa;
- HTTP `404` na taxa é apresentado como ausência de dados;
- o resultado usa `valor × taxa` e mostra a data efetiva recebida;
- controles do par são preservados, incluindo inversão e o valor digitado;
- a lógica permanece diretamente nos componentes nesta etapa; o custom hook ainda não foi criado.

## Testes

`test/frankfurter.test.js` usa `node:test` e fetch simulado em todos os cenários. Nenhuma chamada HTTP real foi executada nesta etapa.

Cobertura: catálogo, taxa e histórico válidos; URL e parâmetros v2; preservação da data; respostas vazias; status 404/422/500; falha de rede; JSON inválido; estruturas, pares, datas e taxas inválidas; entradas inválidas; moedas iguais; cancelamento prévio, durante fetch e durante leitura do corpo; interrupção de conexão durante leitura.

Resultados: os 16 testes de serviço passaram isoladamente na preparação. A execução completa, lint e build são registrados em `docs/FUNCTION_TESTS.md` após a verificação no projeto.
