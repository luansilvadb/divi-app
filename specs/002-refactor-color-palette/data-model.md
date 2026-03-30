# Data Model: Design System Color Tokens

**Feature**: 002-refactor-color-palette
**Date**: 2026-03-29

## Entities

### Theme
- **id**: string (e.g., 'light', 'dark')
- **name**: string (e.g., 'Light', 'Dark')
- **isDefault**: boolean

### ColorToken
- **name**: string (e.g., 'primary-main', 'bg-main')
- **category**: enum ('Brand', 'Neutral', 'Text', 'Semantic')
- **lightValue**: string (hex code)
- **darkValue**: string (hex code)
- **description**: string (rationale for the color)

## Relationships
- **Theme** manages a set of **ColorTokens**.
- **System** persists the active **Theme** ID in LocalStorage.
