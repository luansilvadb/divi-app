# Premium Dashboard Components

Componentes visuais de alta qualidade para o dashboard DIVI.

## Design System

### Tokens CSS
Localizados em `../styles/premium-tokens.css`:
- **Cores**: Tema escuro premium com acentos dourados
- **Tipografia**: Inter (body) + Playfair Display (display)
- **Espaçamento**: Escala 8px (4, 8, 12, 16, 24, 32, 48, 64)
- **Animação**: Easing suave e durações consistentes

## Componentes

### PremiumCard
Card com glassmorphism (transparência + blur) e estados de hover.

```vue
<PremiumCard variant="glass" hoverable>
  <h3>Título</h3>
  <p>Conteúdo</p>
</PremiumCard>
```

Props:
- `variant`: 'default' | 'elevated' | 'glass' (default: 'glass')
- `hoverable`: boolean (default: true)
- `clickable`: boolean (default: false)

### PremiumButton
Botão com gradiente dourado, ripple effect e focus ring.

```vue
<PremiumButton variant="primary" size="md" @click="handleClick">
  Clique Aqui
</PremiumButton>
```

Props:
- `variant`: 'primary' | 'secondary' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean

### PremiumBackground
Background com gradiente sutil e noise texture opcional.

```vue
<PremiumBackground variant="gradient" :show-noise="true">
  <DashboardContent />
</PremiumBackground>
```

### PremiumSkeleton
Placeholder de carregamento com shimmer animation.

```vue
<PremiumSkeleton variant="rect" width="100%" height="200px" />
<PremiumSkeleton variant="text" :lines="3" />
```

### PremiumDashboardLayout
Layout grid responsivo com áreas semânticas.

```vue
<PremiumDashboardLayout template="default">
  <template #header>...</template>
  <template #summary>...</template>
  <template #main-chart>...</template>
  <template #side-stats>...</template>
  <template #recent-activity>...</template>
  <template #footer>...</template>
</PremiumDashboardLayout>
```

## Composables

### usePremiumAnimations
Fornece variants de animação com respeito a `prefers-reduced-motion`.

```typescript
const { fadeIn, slideUp, scaleIn, cardStagger } = usePremiumAnimations()
```

### usePremiumFeatureFlag
Controla a ativação do dashboard premium.

```typescript
const { isPremiumEnabled, enablePremium, disablePremium } = usePremiumFeatureFlag()
```

Ativação via:
- localStorage (persistente)
- Query param: `?premium=true`

## Feature Flag

Para ativar o dashboard premium:

1. **Query param (temporário)**:
   ```
   http://localhost:5173/?premium=true
   ```

2. **localStorage (persistente)**:
   ```javascript
   localStorage.setItem('divi:premium-dashboard', 'true')
   ```

3. **Composable**:
   ```typescript
   const { enablePremium } = usePremiumFeatureFlag()
   enablePremium()
   ```

## Rollback

Para voltar ao dashboard clássico:
```javascript
localStorage.removeItem('divi:premium-dashboard')
```

Ou use o composable:
```typescript
const { disablePremium } = usePremiumFeatureFlag()
disablePremium()
```
