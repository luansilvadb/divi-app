# Research: Fix Invalid URL Error for Data URIs

## Decision
Substituir o uso de Data URIs (Base64) em arquivos CSS/Stylesheets por referências a ativos estáticos na pasta `/public` ou remover o ruído visual (`sidebar-noise`) se for malformado.

## Rationale
- O erro `net::ERR_INVALID_URL` é disparado pelo navegador quando uma URL é considerada malformada ou excede os limites de comprimento.
- Strings Base64 embutidas em arquivos `.vue` (seção `<style>`) são processadas pelo Vite e injetadas no DOM. Se a string for muito longa ou contiver caracteres inválidos após a transpilação, o navegador falhará ao tentar carregá-la como uma imagem de fundo.
- Embora a string no `AppSidebar.vue` pareça válida em isolamento, o erro aparece durante a instalação do Pinia, o que sugere um conflito de temporização ou processamento de ativos durante a hidratação/montagem dos componentes que consomem essas stores.

## Findings
1. **AppSidebar.vue (Linha 342)**: Contém uma string `data:image/png;base64` para o efeito de ruído (`sidebar-noise`).
2. **LoginView.vue (Linha 171)**: Contém um SVG embutido como Data URI.
3. **Pinia Stores**: O erro de console menciona explicitamente `'dashboard' store installed` e `'transactions' store installed`. Isso ocorre porque esses componentes globais (Sidebar) ou as views principais são montados e instanciados simultaneamente com as stores.

## Implementation Strategy
- Mover o `data:image/png;base64` do `AppSidebar.vue` para um arquivo físico em `/public/assets/noise.png`.
- Criar um utilitário de sanitização para garantir que qualquer URL de ícone dinâmica vinda do banco de dados (Dexie) seja validada antes de ser atribuída ao `src` de um elemento `<img>`.
- Adicionar tratamento de erro (`@error`) em componentes que renderizam imagens dinâmicas para aplicar um fallback silencioso.

## Alternatives Considered
- **Aumentar o limite de inlining do Vite**: Rejeitado, pois não resolve a causa raiz de URLs malformadas e pode aumentar o tamanho do bundle.
- **Ignorar o erro**: Rejeitado, pois polui o console do desenvolvedor e indica instabilidade na UI.
