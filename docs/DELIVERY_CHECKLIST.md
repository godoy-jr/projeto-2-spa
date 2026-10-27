# Checklist de entrega

| Requisito | Situação real | Evidência | Pendências |
| --- | --- | --- | --- |
| Repositório do projeto | Código versionado e sincronizado em `main` | [Repositório GitHub](https://github.com/godoy-jr/projeto-2-spa) e histórico Git local | A visibilidade pública não pôde ser confirmada de forma independente nesta sessão. |
| Aplicação executável | Executa localmente com Vite e build de produção aprovado | `npm run dev`, `npm run build` e `http://127.0.0.1:5176/` nesta execução | Publicação ainda não realizada. |
| Conversor real | Catálogo e taxa Frankfurter v2, data efetiva, inversão, validação e moedas iguais | `src/App.jsx`, `src/components/ConverterForm.jsx`, `src/hooks/useExchangeRate.js` | Nenhuma pendência funcional conhecida nos fluxos revisados. |
| Histórico e gráfico | Oito períodos, dados reais, estados, cancelamento e gráfico Recharts | `src/hooks/useHistoricalRates.js`, `src/components/HistorySection.jsx`, `src/components/HistoryChart.jsx` e testes | Revisão visual do gráfico no navegador não foi executada nesta sessão. |
| Tabela e processamento | Data, origem, destino, cotação, filtros combinados, validação, limpeza, ordenação e contagem | `src/components/HistoryTable.jsx` e `src/utils/history.js` | Revisão interativa da tabela no navegador não foi executada nesta sessão. |
| Exportação CSV | Exporta registros filtrados/ordenados, com cabeçalhos, nome, escaping e bloqueio vazio | `src/utils/csv.js` e `test/csv.test.js` | Download real pelo navegador não foi executado nesta sessão. |
| Testes automatizados | 56 aprovados, 0 falhas, 0 ignorados | `test/`, `docs/FUNCTION_TESTS.md` e execução de `npm test` | Não há teste visual ou end-to-end completo. |
| Qualidade técnica | Lint sem avisos; build concluído e gráfico separado em chunk | `npm run lint` e `npm run build` | Conferência visual desktop/mobile da versão final permanece pendente. |
| Histórico real de commits | Evolução registrada em commits coerentes e enviados sem force | `git log` | Nenhuma pendência conhecida. |
| Documentação obrigatória | README e documentos de requisitos, componentes, API, funções, serviços, Figma e IA presentes | `README.md` e diretório `docs/` | Adicionar a URL pública depois da publicação. |
| Figma | Link autoral registrado; frames editáveis desktop/mobile e estados confirmados anteriormente por outro assistente | [Arquivo Figma](https://www.figma.com/design/uX1l7OXMaKBnelFgvZ7ymi) e `docs/FIGMA.md` | Acesso atual não disponível; acesso do avaliador não confirmado e navegação interativa continua pendente. |
| Collection do Postman | JSON versionado e execução do autor registrada com 31 testes aprovados | `postman/Frankfurter-v2.postman_collection.json` e `docs/API_TESTS.md` | Nenhuma execução nova nesta revisão final. |
| Imagens e evidências | Figma contém telas e estados; resultados de testes estão documentados | `docs/FIGMA.md`, `docs/API_TESTS.md` e `docs/FUNCTION_TESTS.md` | Capturas da aplicação final publicada ainda não foram produzidas. |
| Publicação | Opção gratuita preparada para GitHub Pages | Configuração local a ser apresentada antes do envio | Exige aprovação do destino e possível ativação manual de Pages no GitHub. |

## Conferência manual recomendada antes do envio

1. Abrir a URL local e conferir desktop e mobile.
2. Converter e inverter pares; testar valor vazio, zero e negativo.
3. Percorrer os oito períodos e conferir gráfico e contagem.
4. Combinar filtros válidos e inválidos; limpar e ordenar nos quatro modos.
5. Baixar o CSV, abrir o arquivo e conferir linhas, ordem, cabeçalhos e acentuação.
6. Confirmar que o repositório e o Figma abrem em janela anônima.
7. Depois da publicação, repetir os fluxos principais na URL pública.
