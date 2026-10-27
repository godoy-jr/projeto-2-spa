# Investigação da API Frankfurter v2

## Escopo e fonte

A investigação foi feita antes da integração com o React e usa a [documentação oficial da Frankfurter](https://frankfurter.dev/) e a instância pública `https://api.frankfurter.dev`.

A documentação informa que a API:

- não exige chave;
- fornece taxas de referência atualizadas diariamente;
- oferece moedas, taxa de um par, data histórica e séries por intervalo;
- usa `base` para a moeda de origem e `quotes` para filtrar destinos;
- retorna erros em JSON com códigos HTTP padrão;
- não possui endpoint próprio de conversão: o valor deve ser multiplicado pela taxa retornada.

## Artefato do Postman

A Collection importável está em `postman/Frankfurter-v2.postman_collection.json`.

Variáveis da Collection:

- `baseUrl`: `https://api.frankfurter.dev`;
- `baseCurrency`: `EUR`;
- `quoteCurrency`: `USD`.

### Como importar e executar

1. Abra o Postman.
2. Selecione **Import**.
3. Escolha `postman/Frankfurter-v2.postman_collection.json`.
4. Confirme a importação da Collection **Câmbio Fácil - Frankfurter API v2**.
5. Abra a Collection e confira as variáveis.
6. Use **Run collection** para executar todas as requisições.
7. Guarde o relatório da execução para registrar os resultados efetivamente obtidos no Postman.

## Classificação das verificações

### Executadas por HTTP neste ambiente

As requisições abaixo foram executadas diretamente contra a instância pública e tiveram status e corpo inspecionados.

### Executadas no Postman

O autor importou e executou a Collection no Postman. O resumo fornecido pelo autor registrou:

- 31 testes aprovados;
- 0 falhas;
- 0 erros;
- 0 testes ignorados;
- 1 iteração;
- duração de 7,416 segundos.

Não foi informada a data completa da execução nem foram disponibilizados resultados individuais por requisição. Por isso, este registro se limita ao resumo efetivamente fornecido.

### Preparadas e pendentes no Postman

Nenhuma verificação da Collection ficou pendente nesta etapa. Alterações futuras nos endpoints ou scripts deverão ser executadas novamente no Postman e registradas com nova evidência.

## Resultados observados por HTTP

| Cenário | Requisição | Esperado | Observado neste ambiente |
| --- | --- | --- | --- |
| Moedas ativas | `GET /v2/currencies` | `200`, lista de moedas e metadados | `200`; 170 registros; BRL, EUR e USD presentes. |
| Moedas legadas | `GET /v2/currencies?scope=all` | Lista maior, incluindo moedas históricas | `200`; 228 registros. |
| Taxa mais recente — nova consulta | `GET /v2/rate/EUR/USD` | Objeto com `date`, `base`, `quote` e `rate` | Executada em `2026-10-26T22:26:05.109-03:00`; `200`; corpo recebido sem alteração: `{"date":"2026-10-27","base":"EUR","quote":"USD","rate":1.1213}`. |
| Histórico mensal | `GET /v2/rates?from=2024-05-01&to=2024-05-31&base=EUR&quotes=USD` | Lista cronológica do intervalo | `200`; 31 registros, de `2024-05-01` a `2024-05-31`. |
| Sábado no feed mesclado | `GET /v2/rates?date=2024-05-04&base=EUR&quotes=USD` | Resposta válida ou ausência documentável | `200`; um registro datado `2024-05-04`, taxa `1.0737`. |
| Fim de semana no intervalo | `GET /v2/rates?from=2024-05-04&to=2024-05-05&base=EUR&quotes=USD` | Comportamento consistente do feed mesclado | `200`; registros para sábado e domingo. |
| Sábado no provedor ECB | `GET /v2/providers/ecb/rates?date=2024-05-04&base=EUR&quotes=USD` | Última observação publicada pelo provedor | `200`; registro efetivo de `2024-05-03`, taxa `1.0744`. |
| Data anterior à cobertura | `GET /v2/rates?date=1900-01-01&base=EUR&quotes=USD` | Ausência de dados | `200`; `[]`. |
| Data futura sem dados | `GET /v2/rates?date=2099-01-01&base=EUR&quotes=USD` | Ausência de dados | `200`; `[]`. |
| Moeda inválida | `GET /v2/rate/INVALID/USD` | Erro JSON | `422`; `{"status":422,"message":"invalid currency: INVALID"}`. |
| Data inválida | `GET /v2/rates?date=2024-99-99&base=EUR&quotes=USD` | Erro de validação | `422`; `{"status":422,"message":"invalid date"}`. |
| Parâmetro antigo | `GET /v2/rates?base=EUR&symbols=USD` | Rejeição do parâmetro desconhecido | `422`; `{"status":422,"message":"unknown parameter: symbols"}`. |
| Intervalo invertido | `GET /v2/rates?from=2024-05-31&to=2024-05-01&base=EUR&quotes=USD` | Resposta sem registros ou erro documentado | `200`; `[]`. |
| Rota inexistente | `GET /v2/does-not-exist` | Recurso não encontrado | `404`; `{"status":404,"message":"not found"}`. |

Na nova consulta da taxa mais recente, a data local da execução no fuso `-03:00` era `2026-10-26`, mas o campo `date` devolvido pela API foi `2026-10-27`. A divergência foi preservada fielmente; não houve ajuste da data nem alteração do corpo recebido.

## Estruturas JSON observadas

### Moeda

```json
{
  "iso_code": "BRL",
  "iso_numeric": "986",
  "name": "Brazilian Real",
  "symbol": "R$",
  "start_date": "1994-07-01",
  "end_date": "2026-10-26"
}
```

### Taxa de um par

```json
{
  "date": "2026-10-27",
  "base": "EUR",
  "quote": "USD",
  "rate": 1.1213
}
```

### Série histórica

`/v2/rates` retorna um array plano, com um objeto por data e par:

```json
[
  {
    "date": "2024-05-01",
    "base": "EUR",
    "quote": "USD",
    "rate": 1.0708
  }
]
```

### Erro

```json
{
  "status": 422,
  "message": "invalid currency: INVALID"
}
```

## Parâmetros relevantes

- `base`: moeda de origem;
- `quotes`: uma ou mais moedas de destino separadas por vírgula;
- `date`: uma data específica no formato `YYYY-MM-DD`;
- `from` e `to`: limites do intervalo histórico;
- `group`: redução da série por `week` ou `month`;
- `providers`: restringe a origem dos dados;
- `expand=providers`: inclui atribuição dos provedores;
- `scope=all`: inclui moedas legadas no catálogo de moedas.

Na v2, `quotes` substitui o parâmetro `symbols` da v1. Parâmetros desconhecidos são validados de forma estrita.

## Finais de semana e datas sem publicação

Os testes mostram dois comportamentos distintos:

- o feed v2 mesclado retornou valores para cada dia do intervalo, inclusive sábado e domingo, mantendo a data solicitada;
- a consulta direta ao provedor ECB para um sábado retornou a última observação efetivamente publicada, datada da sexta-feira anterior;
- datas fora da cobertura retornaram `200` com uma lista vazia, e não `404`.

Por isso, a aplicação deve usar o campo `date` devolvido pela API como data efetiva e não presumir que ele sempre corresponde ao dia da consulta. Também deve tratar uma lista vazia como estado de ausência de dados.

## Cuidados para a futura integração

- não incluir chave de API, pois a instância pública não exige autenticação;
- validar `response.ok` antes de consumir o JSON;
- tratar separadamente respostas vazias e respostas de erro;
- usar a taxa retornada para calcular `valor × rate`;
- exibir a data recebida na resposta;
- manter `base` e `quotes` alinhados ao par compartilhado da aplicação;
- evitar assumir que uma taxa é intradiária: a Frankfurter trabalha com taxas de referência, não com mercado em tempo real.

## Uso atual na aplicação

O conversor e o histórico passaram a consumir os serviços v2. Essa implementação não altera nem substitui os resultados HTTP e do Postman registrados acima. Nenhuma nova execução no Postman foi realizada durante a revisão final.
