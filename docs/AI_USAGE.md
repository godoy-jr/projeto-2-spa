# Uso de inteligência artificial

## Atividades apoiadas

Foi utilizada inteligência artificial como apoio às seguintes atividades efetivamente realizadas no projeto:

- planejamento e interpretação dos requisitos confirmados no Notion;
- implementação inicial e componentização da interface React;
- criação da conversão demonstrativa e correção de sua fórmula;
- extração das funções puras de negócio e elaboração dos testes automatizados correspondentes;
- migração dos estilos específicos para CSS Modules;
- elaboração e atualização da documentação do projeto;
- apoio a testes manuais no navegador;
- criação dos layouts editáveis do projeto Câmbio Fácil no Figma.

Na prototipação, o auxílio abrangeu:

- wireframes de baixa fidelidade para desktop e mobile;
- protótipos de média fidelidade para desktop e mobile;
- representação dos estados de sucesso, carregamento, erro, ausência de dados e validação.

Os layouts resultantes permanecem estáticos e ainda não possuem navegação interativa.

## Participação na colaboração

### Autor do projeto

- forneceu e confirmou os requisitos, a ordem das etapas e as evidências do trabalho realizado;
- tomou as decisões sobre o escopo e autorizou as alterações e os registros no Git;
- criou e manteve o arquivo real do projeto no Figma com apoio de IA;
- participou da conferência do comportamento da aplicação e da revisão dos resultados.
- executou no Postman, com orientação assistida, a Collection preparada para investigar a API Frankfurter v2 e forneceu o resumo da execução.

### Assistente de acompanhamento

- consultou o Notion e recuperou a sequência confirmada das etapas e os requisitos do projeto;
- apoiou o planejamento e a interpretação do escopo;
- outro assistente desta mesma colaboração conferiu, pela integração do Figma, as camadas editáveis, as versões desktop/mobile e as prévias visuais.

### Assistente responsável pelas alterações locais desta etapa

- consolidou os requisitos e as pendências na documentação;
- migrou os estilos específicos dos componentes para CSS Modules;
- documentou a estrutura real dos componentes;
- executou lint, build e verificações assistidas do comportamento demonstrativo;
- atualizou os registros de Figma e uso de IA com base nas evidências fornecidas pela colaboração.

## Responsabilidade e limites

- as referências HERMES fornecidas pelo professor foram tratadas somente como inspiração e não como produção autoral;
- a seleção e a validação dos requisitos do Câmbio Fácil permanecem sob responsabilidade do autor do projeto;
- o auxílio de IA não comprova implementação, testes ou funcionamento das funcionalidades;
- os testes manuais assistidos complementam, mas não substituem, testes automatizados futuros;
- este registro não atribui à IA atividades, ferramentas, prompts ou datas que não tenham sido confirmados.

## Camada de serviço v2

O assistente de acompanhamento implementou a camada de serviço e seus testes determinísticos com fetch simulado, consultando a documentação oficial e a Collection existente. Também documentou os contratos, erros e moedas iguais. Não realizou consultas reais de cotações nesta etapa nem conectou os serviços ao React. Não houve commit ou push.

## Integração do conversor

O assistente responsável pelas alterações locais conectou o catálogo e a taxa aos componentes com `useEffect`, apoiou a organização dos estados, o cancelamento e a proteção contra respostas obsoletas, removeu a apresentação fictícia e atualizou a documentação. Testes automatizados, lint e build foram executados. O autor informou que uma revisão independente no navegador confirmou conversão real, inversão, preservação do valor, moedas iguais, entradas inválidas e troca rápida do par.

O mesmo assistente extraiu posteriormente a consulta de taxa para `useExchangeRate` e criou testes específicos com serviço simulado para sucesso, erro e nova tentativa, cancelamento, respostas atrasadas, sequência A → B → A, moedas iguais e desmontagem. As verificações do hook não usaram a rede real.

O assistente implementou também o hook histórico, a seleção dos oito períodos e o gráfico responsivo com Recharts, além de testes simulados dos estados assíncronos. Uma consulta HTTP real separada confirmou dados do período de sete dias; não foi atribuída a ela evidência de revisão visual.

O assistente conectou a tabela aos utilitários já testados, implementou a geração e o download do CSV e adicionou testes automatizados de conteúdo, caracteres especiais, nome de arquivo, lista vazia e ciclo da URL temporária. Não foi atribuída aos testes automatizados evidência de download visual no navegador.

Na revisão final, o assistente consolidou documentação e evidências, tentou acessar o Figma e o navegador local e registrou as limitações encontradas. Não marcou como concluídas a revisão visual final, o download real do CSV, o acesso atual do avaliador ao Figma ou a publicação.
