# Specification: Apple-Style Design System Refactor

## 1. Overview
Esta track visa uma refatoração puramente estética do Design System do Divi App. O objetivo é alinhar a interface com os princípios de design da Apple (Human Interface Guidelines), mantendo o uso de TailwindCSS e PrimeUI como base tecnológica.

## 2. Functional Requirements (Aesthetic)
### 2.1 Surfaces & Containers
- **Squircle Curvature:** Implementação de arredondamento "Apple Style" (squircle) em todos os cartões, modais e containers principais.
- **Glassmorphism (Mixed):** Aplicação de efeitos de translucidez e desfoque de fundo (`backdrop-blur`) em sidebars, headers e modais, variando a intensidade conforme a profundidade do elemento.
- **Shadows:** Uso de sombras suaves e difusas para criar profundidade sem bordas nítidas.

### 2.2 UI Controls
- **Apple System Buttons:** Refatoração de botões para seguir o visual do iOS/macOS (cantos arredondados, estados de hover sutis).
- **Form Inputs:** Inputs com bordas suaves, fundos levemente tingidos e foco com anéis de brilho sutis.
- **Switches & Sliders:** Alinhamento visual com os controles nativos da Apple.

### 2.3 Typography & Color
- **Native Apple Palette:** Substituição da paleta atual pelas cores do sistema da Apple (SystemBlue, SystemPink, SystemGray, etc.), garantindo suporte a Dark Mode.
- **Typography Scale:** Ajuste de pesos de fonte (SF Pro style), kerning e entrelinhamento para uma leitura mais fluida e espaçosa.

## 3. Non-Functional Requirements
- **Performance:** O uso de `backdrop-blur` deve ser otimizado para evitar lentidão em dispositivos menos potentes.
- **Accessibility:** Garantir que o contraste das cores nativas da Apple atenda aos padrões WCAG 2.1 AA.
- **Theming:** Compatibilidade total com o sistema de temas do PrimeUI e Tailwind CSS v4.

## 4. Acceptance Criteria
- [ ] Todos os componentes de container utilizam o raio de curvatura estilo Apple.
- [ ] A paleta de cores reflete fielmente as cores do sistema iOS/macOS.
- [ ] O efeito de glassmorphism é visível e fluido em elementos de navegação e sobreposição.
- [ ] A tipografia segue a escala e o peso visual da Apple.

## 5. Out of Scope
- Mudanças na lógica de negócio ou funcionamento dos componentes.
- Alteração da biblioteca base (continuar com PrimeUI + TailwindCSS).
