## 2024-05-18 - First entry\n\n**Aprendizado:** Need to observe the specific components.\n**Ação:** Review atomic components for a11y.
## 2026-03-31 - Rótulos ARIA em botões de ícone

**Aprendizado:** Identifiquei um padrão neste projeto onde botões que contêm apenas ícones (como navegação de calendário e ações de exclusão) e inputs de busca sem labels visíveis não possuem os atributos `aria-label` adequados, dificultando o uso por leitores de tela.
**Ação:** Sempre verificar a presença de atributos `aria-label` ou `aria-labelledby` em elementos interativos que não possuem texto explicativo visível.

## 2026-03-31 - Atributos ARIA em Select Customizado

**Aprendizado:** Descobri que componentes complexos customizados, como o dropdown (BaseSelect.vue), carecem completamente dos atributos semânticos adequados (aria-haspopup, role="listbox", role="option", aria-selected) e gerenciamento de foco (tabindex) neste design system, tornando-os invisíveis para leitores de tela em termos do seu propósito (selecionar opções).
**Ação:** Ao encontrar qualquer componente customizado complexo (como dropdowns, modais, abas) verificar rigorosamente seus atributos WAI-ARIA para garantir que eles comuniquem corretamente seu estado, função e estrutura para as tecnologias assistivas.
