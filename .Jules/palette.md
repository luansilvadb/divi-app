## 2024-05-18 - First entry\n\n**Aprendizado:** Need to observe the specific components.\n**Ação:** Review atomic components for a11y.
## 2026-03-31 - Rótulos ARIA em botões de ícone

**Aprendizado:** Identifiquei um padrão neste projeto onde botões que contêm apenas ícones (como navegação de calendário e ações de exclusão) e inputs de busca sem labels visíveis não possuem os atributos `aria-label` adequados, dificultando o uso por leitores de tela.
**Ação:** Sempre verificar a presença de atributos `aria-label` ou `aria-labelledby` em elementos interativos que não possuem texto explicativo visível.

## 2026-03-31 - Atributos ARIA em Select Customizado

**Aprendizado:** Descobri que componentes complexos customizados, como o dropdown (BaseSelect.vue), carecem completamente dos atributos semânticos adequados (aria-haspopup, role="listbox", role="option", aria-selected) e gerenciamento de foco (tabindex) neste design system, tornando-os invisíveis para leitores de tela em termos do seu propósito (selecionar opções).
**Ação:** Ao encontrar qualquer componente customizado complexo (como dropdowns, modais, abas) verificar rigorosamente seus atributos WAI-ARIA para garantir que eles comuniquem corretamente seu estado, função e estrutura para as tecnologias assistivas.

## 2025-03-31 - Melhoria de Acessibilidade no BaseButton **Aprendizado:** Componentes com estados de loading (ex: spinners/texto substituído) precisam informar aos leitores de tela que o botão está em uma operação através de `aria-busy="true"` e esconder elementos visuais puramente decorativos com `aria-hidden="true"`. Faltava também o outline para foco no teclado. **Ação:** Adicionar `aria-busy` dinâmico e suporte melhorado de `focus-visible` em botões customizados.

## 2024-05-24 - Melhoria de Acessibilidade em Modais **Aprendizado:** Modais precisam anunciar seu estado para leitores de tela usando `role="dialog"` e `aria-modal="true"`, e o fundo deve ser ignorado com `aria-hidden="true"`. A navegação por teclado (tecla `Escape`) é fundamental para fechar o modal. **Ação:** Sempre que criar um componente modal, incluir atributos ARIA correspondentes e suporte para a tecla `Escape`.

## 2026-03-31 - Validação de Inputs com Acessibilidade **Aprendizado:** Textos de erro não conectados semanticamente (sem `aria-describedby` ou `aria-invalid`) e sem feedback visual de bordas tornam a identificação de erro falha, principalmente para usuários de leitores de tela. **Ação:** Sempre implementar os atributos `aria-invalid="true"`, mapear o erro via `aria-describedby`, e incluir feedback de erro visual (ex: `border-error-main`) simultaneamente no input afetado.
