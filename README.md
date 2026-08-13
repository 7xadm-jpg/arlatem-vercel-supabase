# ARLATEM - execução local

## Requisitos

- Node.js 20 ou superior
- Conta e projeto do Supabase apenas para testar dados reais e o painel

## Como executar

1. Abra um terminal nesta pasta.
2. Para visualizar com os dados locais, execute `npm run dev`.
3. Abra `http://127.0.0.1:3000`.

Se o servidor já estava aberto antes de atualizar os arquivos, encerre-o com `Ctrl+C` e execute `npm run dev` novamente. As rotas `/catalogo`, `/catalogo/` e `/catalogo.html` são aceitas; há também um arquivo físico em `catalogo/index.html` para servidores estáticos simples.

Essa visualização local não exige instalação de pacotes nem credenciais.

## Painel no modo local

Abra `http://127.0.0.1:3000/acesso-tecnico-arlatem` e use:

- Usuário: `gestor-arlatem`
- Senha: `arlatem-local`

Nesse modo, o painel permite editar, salvar, enviar imagens e baixar backup. As alterações ficam em `.local/site-content.json` e as imagens em `uploads/local/`; nada é enviado ao Supabase. Para definir outra senha temporária, inicie o servidor com a variável `LOCAL_ADMIN_PASSWORD`.

## Testar com Supabase e funções da Vercel

1. Execute `npm install`.
2. Instale a Vercel CLI com `npm install --global vercel`.
3. Copie `.env.example` para `.env.local`.
4. Preencha `.env.local` com as variáveis do seu projeto Supabase.
5. Execute `supabase/schema.sql` uma vez no SQL Editor do Supabase para ativar a tabela, leitura pública controlada e bloqueio de gravação anônima.
6. Gere o hash SHA-256 da senha do painel com:
   `node -e "console.log(require('crypto').createHash('sha256').update('SUA-SENHA-FORTE').digest('hex'))"`
7. Cole o resultado em `ADMIN_PASSWORD_HASH` e use um `SESSION_SECRET` aleatório com pelo menos 32 caracteres.
8. Execute `npm run dev:vercel`.

O painel administrativo, autenticação, gravações e uploads precisam das variáveis reais do Supabase.

## Verificação

Execute `npm run check` para validar arquivos essenciais, JSON e a imagem principal.

## Segurança

Nunca envie `.env.local`, `SUPABASE_SERVICE_ROLE_KEY`, a senha administrativa, `ADMIN_PASSWORD_HASH` ou `SESSION_SECRET` para o GitHub.

## Google Analytics 4

O carregador do GA4 já está incluído, mas permanece inativo até receber um ID válido.
Para ativar, preencha `content="G-SEU_ID"` na meta `google-analytics-id` das páginas públicas.
O carregador só inicia a medição após o visitante aceitar o aviso de privacidade.

## Google Search Console

Depois da publicação, confirme a propriedade do domínio, envie `https://www.arlatem.com.br/sitemap.xml` e solicite a indexação da página inicial e do catálogo.
