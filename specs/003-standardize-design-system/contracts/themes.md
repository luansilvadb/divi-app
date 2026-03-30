# Contracts: UI Component Interfaces

These contracts define the properties and events for the standardized UI components to ensure consistency across the application.

## `BaseBadge.vue`

```typescript
interface BaseBadgeProps {
  label: string;
  color?: string; // Default to 'var(--color-primary-main)'
  variant?: 'subtle' | 'outline' | 'solid'; // Default to 'subtle'
}
```

## `BaseProgressBar.vue`

```typescript
interface BaseProgressBarProps {
  percentage: number; // 0 to 100
  color?: string; // Default to 'var(--color-primary-main)'
  isOverBudget?: boolean; // If true, adds error color and pulse animation
}
```

## `BaseIconBox.vue`

```typescript
interface BaseIconBoxProps {
  color?: string; // Default to 'var(--color-primary-main)'
  size?: 'sm' | 'md' | 'lg'; // 28px, 40px, 48px
  rounded?: 'sm' | 'md' | 'lg' | 'full'; // Default to 'md' (12px)
}
```

## `BaseSummaryItem.vue`

```typescript
interface BaseSummaryItemProps {
  label: string;
  value: string | number;
  icon?: string; // Icon name or component
  color?: string; // Background color for the icon box
  status?: 'normal' | 'error' | 'success'; // Default to 'normal'
  size?: 'sm' | 'md' | 'lg'; // Default to 'md'
}
```

## `BaseViewHeader.vue`

```typescript
interface BaseViewHeaderProps {
  title: string;
  subtitle?: string;
  highlight?: string; // Substring of the title to wrap in <span class="text-primary-main">
}
```
