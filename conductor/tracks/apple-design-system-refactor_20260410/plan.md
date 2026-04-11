# Implementation Plan: Apple-Style Design System Refactor

## Context7 MCP: https://developer.apple.com/design/human-interface-guidelines/

## Phase 1: Foundation (Apple System Tokens) [checkpoint: e5a6e0b]

Nesta fase, estabeleceremos as variáveis CSS e os tokens do Tailwind v4 para alinhar a paleta de cores e os princípios básicos de design com os da Apple.

- [x] Task: Definir cores nativas da Apple (SystemBlue, SystemPink, SystemGray, etc.) no `theme.css`. (5503cf3)
- [x] Task: Configurar tokens de sombra (shadows) suaves no Tailwind CSS v4 (`main.css`). (d4573f9)
- [x] Task: Definir variáveis globais de `backdrop-blur` e `vibrancy` para glassmorphism. (ab75eb3)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation' (Protocol in workflow.md)

## Phase 2: Layout & Surfaces (Glassmorphism & Squircle) [checkpoint: 0858d3c]

Aplicação dos princípios de curvatura contínua (squircle) e transparência em containers principais.

- [x] Task: Refatorar o container `glass-card` para usar o raio de curvatura "Squircle Apple Style". (8b06e9e)
- [x] Task: Ajustar Sidebars e Headers para usar `backdrop-blur` e fundos translúcidos (Vibrant & Mixed). (269d850)
- [x] Task: Refinar modais e sobreposições com sombras profundas e bordas sutis. (082e29b)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Layout & Surfaces' (Protocol in workflow.md)

## Phase 3: UI Controls & Components (PrimeUI Styling)

Estilização minuciosa dos componentes do PrimeUI para refletir a estética da Apple usando classes Tailwind.

- [x] Task: Estilizar botões (Primary, Secondary, Tertiary) com cantos arredondados e estados táteis. (ecad3b5)
- [x] Task: Refatorar campos de formulário (Inputs, Selects, Textareas) com foco e bordas suaves. (e85543c)
- [x] Task: Estilizar controles de seleção (Switches, Checkboxes, Sliders) seguindo o iOS/macOS. (b4e3e51)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Controls & Components' (Protocol in workflow.md)

## Phase 4: Typography & Motion (Details & Refinement)

Ajustes finais na tipografia e inclusão de animações fluidas típicas da Apple.

- [ ] Task: Ajustar pesos de fonte, kerning e escalas tipográficas para o estilo SF Pro.
- [ ] Task: Implementar transições suaves de hover e feedbacks visuais em componentes interativos.
- [ ] Task: Realizar auditoria visual completa em Light e Dark Mode para garantir contraste e estética.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Typography & Motion' (Protocol in workflow.md)
