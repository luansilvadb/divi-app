# UI Contract: Categories Module

## Overview
This contract defines the interaction between the `CategoriesView` and the underlying systems (Store, Design System).

## View Inputs (Props/Store)
| Source | Key | Type | Description |
|--------|-----|------|-------------|
| CategoryStore | `categories` | `ICategory[]` | List of categories to render |
| CategoryStore | `stats` | `ICategoryStats` | Aggregate statistics for the sidebar |
| ThemeStore | `isDarkMode` | `Boolean` | Current application theme state |

## View Outputs (Events)
| Event | Payload | Description |
|-------|---------|-------------|
| `onCategoryClick` | `categoryId` | Triggered when a category card is selected |
| `onAddCategory` | `void` | Triggered when the "New Category" button is clicked |

## Visual Contracts (CSS Interface)
The `CategoriesView` must consume the following tokens to maintain the premium visual contract:

| Token Category | Token Names | Requirement |
|----------------|-------------|-------------|
| Surfaces | `--surface-glass`, `--glass-blur` | Applied to cards and sidebar panels |
| Atmosphere | `--color-primary-subtle`, etc. | Used in mesh gradient radial segments |
| Motion | `--ease-spring`, `--duration-normal` | Used for all interaction transitions |
| Hierarchy | `--text-2xl`, `--font-bold` | Applied to primary category balances |
