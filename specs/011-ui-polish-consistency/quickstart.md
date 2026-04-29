# Quickstart: UI Polish and Consistency

## Development Environment
- **Vite/Vue 3**
- **UnoCSS** for styling
- **Naive UI** component library
- **Lucide** icons

## Key Files
- `src/shared/components/organisms/AppSidebar.vue`: Main navigation sidebar.
- `src/shared/components/organisms/GlobalHeader.vue`: Top header containing sync and notifications.
- `src/shared/components/molecules/SyncStatusIndicator.vue`: Sync status pill.

## Running the Application
```bash
npm run dev
```

## Verifying Changes
1. **Sidebar**: Verify "Orçamentos" has a wallet icon.
2. **Header**: Verify "Sincronizado" text is clearly visible and the notification bell has a consistent style.
3. **Themes**: Toggle between Light and Dark mode to ensure contrast is maintained.

## Testing
```bash
# Run unit tests
npm run test:unit
```
Relevant tests:
- `src/shared/components/molecules/__tests__/SyncStatusIndicator.spec.ts`
- `src/shared/components/organisms/__tests__/AppSidebar.spec.ts` (if exists)
