# Requisitos — Câmbio Fácil

## 1. Contexto

O Câmbio Fácil é uma Single Page Application acadêmica para conversão e análise de moedas. O projeto deve demonstrar a evolução incremental do aprendizado em React e JavaScript, desde a definição dos requisitos até a entrega publicada.

A fonte prevista para as cotações reais é a API Frankfurter. Antes da integração, seus endpoints e respostas devem ser estudados e registrados em uma Collection do Postman.

## 2. Público-alvo

Pessoas que desejam:

- converter valores entre moedas de forma simples;
- identificar a taxa e a data efetiva de uma cotação;
- observar a variação de um par de moedas ao longo do tempo;
- filtrar, ordenar e exportar dados históricos.

## 3. Objetivo

Construir uma aplicação web responsiva que permita converter moedas com dados reais da API Frankfurter e analisar o histórico das cotações por meio de gráfico, tabela, filtros, ordenação e exportação CSV.

## 4. Escopo

### 4.1 Incluído

- conversão entre moedas disponíveis na API Frankfurter;
- seleção das moedas de origem e destino;
- inversão das moedas selecionadas;
- apresentação do valor convertido, da taxa utilizada e da data efetiva;
- consulta histórica para períodos predefinidos;
- gráfico atualizado de acordo com o par e o período selecionados;
- tabela de cotações históricas;
- filtros combináveis e ordenação;
- exportação CSV dos registros filtrados;
- estados de carregamento, erro e ausência de dados;
- interface responsiva para desktop e dispositivos móveis;
- documentação do projeto, protótipo no Figma e Collection do Postman.

### 4.2 Fora do escopo

- autenticação de usuários;
- backend próprio;
- banco de dados;
- armazenamento de dados financeiros do usuário;
- compra, venda ou transferência de moedas.

## 5. Requisitos funcionais

### RF01 — Informar valor

O usuário deve poder informar um valor numérico maior que zero para conversão.

### RF02 — Selecionar moedas

O usuário deve poder selecionar uma moeda de origem e uma moeda de destino entre as moedas suportadas.

### RF03 — Inverter moedas

O usuário deve poder trocar as moedas de origem e destino por meio de uma ação de inversão.

### RF04 — Converter moedas

A aplicação deve calcular e exibir o valor convertido usando uma cotação real obtida da API Frankfurter.

### RF05 — Exibir detalhes da cotação

O resultado deve apresentar:

- valor informado;
- moeda de origem;
- moeda de destino;
- valor convertido;
- taxa utilizada;
- data efetiva da cotação.

### RF06 — Validar a entrada

A aplicação deve impedir a conversão de valores vazios, iguais a zero, negativos ou inválidos e apresentar uma mensagem compreensível.

### RF07 — Selecionar período histórico

O usuário deve poder consultar os seguintes períodos:

- 7, 15 e 30 dias;
- 3 e 6 meses;
- 1, 5 e 10 anos.

### RF08 — Atualizar o gráfico

O gráfico deve ser atualizado quando o usuário alterar o par de moedas ou o período histórico.

### RF09 — Exibir tabela histórica

A tabela deve apresentar, para cada registro:

- data;
- moeda de origem;
- moeda de destino;
- cotação.

### RF10 — Filtrar registros

O usuário deve poder combinar os seguintes filtros:

- data inicial e data final;
- cotação mínima e cotação máxima.

### RF11 — Limpar filtros

O usuário deve poder remover todos os filtros e retornar à lista completa do período consultado.

### RF12 — Ordenar registros

O usuário deve poder ordenar a tabela por data ou cotação, em ordem crescente ou decrescente.

### RF13 — Contar registros

A interface deve informar quantos registros estão sendo exibidos após a aplicação dos filtros.

### RF14 — Exportar CSV

O usuário deve poder exportar somente os registros atualmente filtrados para um arquivo CSV.

### RF15 — Tratar estados da consulta

A aplicação deve apresentar estados distintos para:

- carregamento;
- erro de consulta;
- ausência de dados;
- dados carregados com sucesso.

## 6. Requisitos não funcionais

### RNF01 — Tecnologias

A aplicação deve usar React com JavaScript e Vite.

### RNF02 — Conceitos obrigatórios

O código deve demonstrar:

- componentes React;
- props;
- eventos;
- `useState`;
- Lifting State Up;
- `useEffect`;
- `fetch` com `async/await`;
- pelo menos um custom hook reutilizável;
- manipulação de arrays e objetos.

### RNF03 — Estilos

Os estilos dos componentes devem usar CSS Modules. A interface deve funcionar em telas desktop e mobile.

### RNF04 — Simplicidade arquitetural

O projeto não deve adicionar backend, autenticação, banco de dados ou dependências sem necessidade comprovada.

### RNF05 — Segurança

Chaves, tokens, senhas e outras credenciais não devem ser incluídos no código ou no repositório. A API Frankfurter não deve ser tratada como se exigisse uma chave quando isso não for necessário.

### RNF06 — Clareza dos dados

Dados fictícios ou demonstrativos devem ser identificados claramente e nunca apresentados como cotações atuais.

### RNF07 — Qualidade

O projeto deve permanecer aprovado pelas verificações de lint e build e deve registrar os testes manuais ou automatizados relevantes.

### RNF08 — Versionamento

O histórico Git deve registrar a evolução real do trabalho com commits coerentes, sem alteração artificial de datas ou divisão fictícia de uma implementação pronta.

## 7. Regras de negócio

### RN01 — Valor válido

Somente valores numéricos maiores que zero podem ser convertidos.

### RN02 — Cálculo da conversão

O resultado deve usar a taxa correspondente ao par de origem e destino retornada pela API. Para moedas iguais, o valor convertido deve permanecer igual ao valor informado.

### RN03 — Inversão

Ao inverter o par, a moeda de origem deve assumir o lugar da moeda de destino e vice-versa. Uma cotação ou resultado antigo não pode permanecer identificado como se pertencesse ao novo par.

### RN04 — Data efetiva

A interface deve mostrar a data efetiva informada pela API, que pode ser diferente da data da consulta.

### RN05 — Período histórico

O intervalo enviado à API deve corresponder ao período selecionado pelo usuário.

### RN06 — Filtros combináveis

Quando mais de um filtro estiver preenchido, um registro deve atender simultaneamente a todos os filtros ativos para continuar visível.

### RN07 — Limites de filtros

O sistema deve sinalizar intervalos inválidos, incluindo data inicial posterior à final e cotação mínima superior à máxima.

### RN08 — Exportação filtrada

O CSV deve refletir exatamente os registros visíveis após filtros e ordenação, conter cabeçalhos e possuir nome de arquivo identificável.

### RN09 — Exportação vazia

A exportação deve ser bloqueada quando não houver registros visíveis.

## 8. Critérios de aceite

### CA01 — Conversor

- Dado um valor válido e moedas distintas, ao solicitar a conversão, o resultado é calculado com dados da API.
- O resultado mostra taxa e data efetiva.
- Valores vazios, zero, negativos e inválidos não produzem conversão.
- A inversão troca corretamente as moedas.
- Quando origem e destino são iguais, o resultado mantém o valor informado.

### CA02 — Histórico e gráfico

- Todos os períodos definidos em RF07 podem ser selecionados.
- Alterar o par ou período atualiza os dados e o gráfico.
- Carregamento, erro e ausência de dados possuem apresentação própria.

### CA03 — Tabela e filtros

- A tabela contém data, origem, destino e cotação.
- Filtros de datas e valores funcionam de forma combinada.
- A limpeza restaura a lista do período consultado.
- A ordenação funciona por data e cotação nos dois sentidos.
- A contagem corresponde ao número de linhas exibidas.

### CA04 — CSV

- O arquivo contém somente os registros visíveis.
- O arquivo possui cabeçalhos e nome identificável.
- A aplicação impede a exportação quando a lista filtrada está vazia.

### CA05 — Responsividade e qualidade

- Os fluxos principais funcionam em desktop e mobile.
- Lint e build são concluídos sem erros.
- Dados demonstrativos e reais são visualmente distinguíveis.

## 9. Pendências conhecidas

- configurar a navegação interativa entre os layouts do Figma e realizar uma revisão visual final do arquivo;
- implementar integração real com a API, `useEffect` e custom hook;
- implementar taxa e data efetiva com os dados reais da API;
- implementar histórico, gráfico, tabela, filtros e ordenação;
- implementar exportação CSV;
- revisar testes, responsividade e todos os estados da aplicação;
- publicar a versão final da aplicação.

## 10. Situação atual

A versão atual possui interface React componentizada, props, listas com `map`, eventos e `useState`. O par de moedas foi elevado para `App` por Lifting State Up e é compartilhado com `ConverterForm` e `HistorySection`. O formulário permite alterar ou inverter o par por callbacks, preserva o valor informado e limpa feedback anterior quando o par muda. Os estilos específicos foram separados em CSS Modules e a estrutura real está documentada em `docs/COMPONENTS.md`.

O Figma do projeto possui wireframes de baixa fidelidade e layouts de média fidelidade para desktop e mobile, incluindo os estados de sucesso, carregamento, erro, ausência de dados e validação. Esses layouts são editáveis, porém estáticos e ainda não possuem navegação interativa. O link e as limitações estão registrados em `docs/FIGMA.md`, e o auxílio de IA está registrado em `docs/AI_USAGE.md`.

A API Frankfurter v2 foi investigada por requisições HTTP, e a Collection registrada em `postman/Frankfurter-v2.postman_collection.json` foi executada pelo autor no Postman. Os cenários, as observações HTTP e o resumo da execução no Postman estão documentados separadamente em `docs/API_TESTS.md`. A integração da API com a aplicação permanece pendente.

As funções puras de conversão direta e demonstrativa, cálculo dos oito períodos históricos, filtros combinados e ordenação foram implementadas em `src/utils/` e verificadas com testes automatizados. Somente a função demonstrativa está conectada ao conversor atual; as demais permanecem preparadas para etapas futuras, conforme registrado em `docs/FUNCTION_TESTS.md`.

A conversão existente no código usa taxas fictícias claramente identificadas e serve apenas para aprendizado. Ela não comprova a integração com a API nem atende, por si só, aos critérios de aceite das cotações reais.
