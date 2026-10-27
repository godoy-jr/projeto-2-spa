# Checklist de entrega

| Requisito | Situação real | Evidência | Pendências |
| --- | --- | --- | --- |
| Repositório do projeto | Repositório público, com código versionado e sincronizado em `main` | [Repositório GitHub](https://github.com/godoy-jr/projeto-2-spa), API pública do GitHub e histórico Git local | Nenhuma pendência conhecida. |
| Aplicação executável | Executa localmente e está publicada no GitHub Pages; a página pública respondeu `200` com assets sob `/projeto-2-spa/` | `npm run build`, [aplicação publicada](https://godoy-jr.github.io/projeto-2-spa/) e [execução do deploy](https://github.com/godoy-jr/projeto-2-spa/actions/runs/40588883001) | Nenhuma pendência de publicação conhecida. |
| Conversor real | Catálogo e taxa Frankfurter v2, data efetiva, inversão, validação e moedas iguais; conversão real testada na aplicação pública | `src/App.jsx`, `src/components/ConverterForm.jsx`, `src/hooks/useExchangeRate.js` e revisão informada pelo autor | Nenhuma pendência funcional conhecida nos fluxos revisados. |
| Histórico e gráfico | Oito períodos, dados reais, estados, cancelamento e gráfico Recharts; oito períodos e gráfico mobile confirmados, além do histórico de sete dias testado na aplicação pública | `src/hooks/useHistoricalRates.js`, `src/components/HistorySection.jsx`, `src/components/HistoryChart.jsx`, testes e revisões informadas pelo autor | Outros tamanhos, períodos na versão pública e estados visuais não foram abrangidos por essa revisão. |
| Tabela e processamento | Data, origem, destino, cotação, filtros combinados, validação, limpeza, ordenação e contagem; filtro de cotação, contagem, ordem decrescente e mínimo maior que máximo confirmados | `src/components/HistoryTable.jsx`, `src/utils/history.js`, testes e revisão informada pelo autor | Demais combinações e sentidos não foram abrangidos pela revisão independente. |
| Exportação CSV | Exporta registros filtrados/ordenados, com cabeçalhos, nome, escaping e bloqueio vazio; download correspondente às linhas visíveis e bloqueio vazio confirmados | `src/utils/csv.js`, `test/csv.test.js` e revisão informada pelo autor | Não há pendência conhecida nos cenários revisados; outros cenários não foram generalizados. |
| Testes automatizados | 56 aprovados, 0 falhas, 0 ignorados | `test/`, `docs/FUNCTION_TESTS.md` e execução de `npm test` | Não há teste visual ou end-to-end completo. |
| Qualidade técnica | Lint sem avisos; build concluído e gráfico separado em chunk; gráfico mobile revisado | `npm run lint`, `npm run build` e revisão independente informada pelo autor | Não houve revisão visual integral de todos os fluxos em desktop e mobile. |
| Histórico real de commits | Evolução registrada em commits coerentes e enviados sem force | `git log` | Nenhuma pendência conhecida. |
| Documentação obrigatória | README e documentos de requisitos, componentes, API, funções, serviços, Figma e IA presentes; URL pública registrada | `README.md` e diretório `docs/` | Nenhuma pendência documental conhecida além das limitações explicitamente registradas. |
| Figma | Frames editáveis, estados e dois fluxos demonstrativos desktop/mobile; 82 conexões com destinos verificados pelo assistente de acompanhamento | [Arquivo Figma](https://www.figma.com/design/uX1l7OXMaKBnelFgvZ7ymi), guias e `docs/FIGMA.md` | Percurso completo no modo de apresentação e acesso do avaliador ainda devem ser conferidos. |
| Collection do Postman | JSON versionado e execução do autor registrada com 31 testes aprovados | `postman/Frankfurter-v2.postman_collection.json` e `docs/API_TESTS.md` | Nenhuma execução nova nesta revisão final. |
| Imagens e evidências | Figma contém telas e estados; resultados de testes estão documentados | `docs/FIGMA.md`, `docs/API_TESTS.md` e `docs/FUNCTION_TESTS.md` | Capturas da aplicação final publicada ainda não foram produzidas. |
| Publicação | GitHub Pages gratuito ativo; tentativa 2 da execução `40588883001` concluída com sucesso | [Aplicação pública](https://godoy-jr.github.io/projeto-2-spa/) e [GitHub Actions](https://github.com/godoy-jr/projeto-2-spa/actions/runs/40588883001) | A abertura da página, a conversão real e o histórico de sete dias foram verificados; outros fluxos na URL pública não foram generalizados como testados. |

## Conferência manual recomendada antes do envio

1. Conferir os fluxos e estados desktop/mobile que não constam nas evidências específicas acima.
2. Combinar os demais filtros, limpar e conferir os outros sentidos de ordenação.
3. Conferir cabeçalhos e acentuação do CSV aberto em um leitor compatível.
4. Executar os dois percursos do Figma no modo de apresentação.
5. Confirmar que o repositório e o Figma abrem em janela anônima.
6. Conferir na URL pública os fluxos ainda não abrangidos pela conversão real e pelo histórico de sete dias já testados.
