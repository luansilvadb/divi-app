# Quickstart: Using Standardized UI Components

This guide shows how to quickly migrate existing views to the new "Holy Grail" Design System using the standardized shared components.

## 1. Import Shared Components

All standardized components are located in `src/shared/components/`.

```vue
<script setup lang="ts">
import BaseViewHeader from '@/shared/components/organisms/BaseViewHeader.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
</script>
```

## 2. Standardized Page Header

Replace manual header implementations with `BaseViewHeader`.

```vue
<template>
  <BaseViewHeader 
    title="Minhas Transações" 
    highlight="Transações" 
    subtitle="Veja o histórico completo de seus gastos e receitas."
  >
    <template #action>
      <BaseButton variant="primary">Nova Transação</BaseButton>
    </template>
  </BaseViewHeader>
</template>
```

## 3. Standardized Cards

All cards should use the `glass-card` and `hover-glow` patterns. `BaseCard` now supports these via props or by default.

```vue
<BaseCard class="glass-card hover-glow">
  <template #header>
    Título do Card
  </template>
  Conteúdo do card segue aqui.
</BaseCard>
```

## 4. Using Summary Items

Standardize sidebar or dashboard summaries.

```vue
<BaseSummaryItem 
  label="Total Recebido" 
  value="R$ 5.000,00" 
  color="var(--color-success-main)" 
  status="success"
>
  <template #icon>
    <!-- SVG Icon -->
  </template>
</BaseSummaryItem>
```

## 5. Standardized Progress Bars

For budgets, goals, or loans.

```vue
<BaseProgressBar 
  :percentage="75" 
  color="var(--color-primary-main)" 
  :is-over-budget="false" 
/>
```
