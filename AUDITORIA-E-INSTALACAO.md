# Auditoria e instalação — ARLATEM

## Resultado desta revisão

- Layout responsivo corrigido no computador e celular.
- Filtros e cards não se sobrepõem mais.
- Imagem principal restaurada e validada.
- Depoimentos possuem conteúdo local de segurança quando o Supabase estiver vazio.
- Mapa real do endereço inserido, com botão para abrir a rota no Google Maps.
- Catálogo disponível pela URL limpa `/catalogo/`.
- Compatibilidade local garantida para `/catalogo`, `/catalogo/` e o arquivo `/catalogo.html`.
- Vitrine de produtos redesenhada com cards mais limpos, filtros avançados recolhíveis e melhor leitura.
- Logos locais das dez principais montadoras adicionadas à seção de marcas.
- As 12 categorias agora usam uma página própria mais compacta, com breadcrumb, título curto, descrição técnica, indicadores relevantes e contexto de atendimento.
- Categorias com um único item exibem o produto em destaque horizontal; categorias vazias mostram atendimento sob consulta e acesso direto ao WhatsApp.
- URLs antigas de categorias redirecionadas para URLs limpas.
- Busca compartilhável disponível em `/catalogo/?q=termo`.
- Títulos, descrições, canonicals, Open Graph, dados estruturados, `robots.txt` e `sitemap.xml` revisados.
- Painel e APIs administrativas marcados para não serem indexados.
- Google Analytics 4 preparado, com consentimento de privacidade e eventos de WhatsApp/catálogo.
- Supabase protegido com RLS: leitura pública limitada ao conteúdo e gravação apenas pela chave de serviço no servidor.
- Sessão administrativa sem segredo padrão e upload limitado a imagens de até 5 MB.

## Configuração local

1. Instale Node.js 20 ou mais recente.
2. Abra um terminal nesta pasta.
3. Execute `npm run dev`.
4. Acesse `http://127.0.0.1:3000`.

Esse modo usa dados locais e não altera o Supabase.

O painel local funciona com o usuário `gestor-arlatem` e a senha `arlatem-local`. Salvamentos permanecem somente na pasta `.local` deste projeto até a futura integração controlada com o Supabase.

## Antes de publicar

1. Faça backup do projeto e do Supabase atuais.
2. Preencha `.env.local` ou as variáveis da Vercel usando `.env.example` como modelo.
3. Execute `supabase/schema.sql` no SQL Editor do Supabase.
4. Informe o ID real do GA4 no formato `G-XXXXXXXXXX` nas metas `google-analytics-id` das páginas públicas.
5. Publique primeiro em uma URL de teste da Vercel.
6. Teste painel, salvamento, upload, WhatsApp, mapa e catálogo.
7. Depois de publicar no domínio, envie `https://www.arlatem.com.br/sitemap.xml` no Google Search Console e solicite indexação das páginas principais.

## Observações importantes

- Nenhuma senha ou chave real está incluída neste pacote.
- A presença do arquivo de verificação do Google não confirma, sozinha, que a propriedade ainda esteja ativa na conta correta.
- O GA4 permanece inativo enquanto o ID real não for informado.
- Produtos precisam ser cadastrados no painel para preencher as categorias que ainda não possuem itens.
