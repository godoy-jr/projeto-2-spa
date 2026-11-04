# Proposta de autenticação

## Recomendação

Para uma SPA estática publicada no GitHub Pages, a opção recomendada é **Supabase Auth com login por link mágico ou OAuth**, acompanhada de uma tabela `favorites` protegida por Row Level Security (RLS).

O SDK funciona no navegador e o GitHub Pages não precisa executar um servidor próprio. A chave pública (`anon`/publishable) pode estar na configuração do Vite; segredos administrativos e `service_role` nunca devem ser enviados ao navegador ou versionados.

## Custos

- A interface atual e os favoritos locais não têm custo adicional.
- O Supabase oferece plano gratuito com limites de usuários, banco e tráfego; os limites e preços devem ser confirmados na página oficial antes da contratação.
- OAuth pode exigir configuração no provedor escolhido. Alguns provedores podem ter regras ou custos próprios.

## Configuração necessária

1. Criar um projeto Supabase e habilitar o método de entrada aprovado.
2. Cadastrar as URLs de redirecionamento local e do GitHub Pages.
3. Definir `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nos ambientes local e de build do GitHub Actions.
4. Criar a tabela `favorites` com `user_id`, `source`, `target` e uma restrição única por usuário e par direcional.
5. Ativar RLS para permitir que cada usuário leia e altere apenas seus próprios registros.
6. Implementar sessão, entrada e saída na interface de Conta.
7. Após o primeiro login, oferecer “Importar favoritos deste navegador”; inserir com `upsert` para evitar duplicatas e manter `EUR/BRL` distinto de `BRL/EUR`.

## Estado desta entrega

A interface de Conta está preparada no estado visitante, sem chamadas externas. A integração real aguarda aprovação. Nenhuma credencial privada foi adicionada ao projeto.
