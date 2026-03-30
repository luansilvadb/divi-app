# UI Theme Contract: Standardization

The application uses a unified design system based on Tailwind CSS and CSS variables. All views must strictly adhere to these tokens.

## Layout Variables
- **Breakpoint (Side column)**: 1100px (standard grid layout).
- **Gap (Grid)**: 1.5rem (24px) - `gap-6`.
- **Padding (View)**: Standardized `view-wrapper` padding.

## Spacing Tokens
- **Card Padding**: Standardized through `BaseCard` component.
- **Section Margin**: `mt-8` (32px) for major sections.
- **Header Margin**: `mb-5` (20px) for section headers.

## Typography Tokens
- **View Title**: `text-4xl` (36px) | `font-black` | `tracking-tight`.
- **Section Title**: `text-xl` (20px) | `font-bold`.
- **Card Title**: `text-lg` (18px) | `font-bold`.
- **Body Text**: `text-sm` (14px) | `font-medium`.
- **Labels (Small)**: `text-[0.7rem]` (11px) | `font-bold` | `uppercase`.

## Color Utilities
- **Success**: `text-success-main` (emerald).
- **Error**: `text-error-main` (rose).
- **Warning**: `text-warning-main` (amber).
- **Primary**: `text-primary-main` (navy).
- **Secondary**: `text-text-secondary` (gray).
- **Disabled**: `text-text-disabled` (light gray).
