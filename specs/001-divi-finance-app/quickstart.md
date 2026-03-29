# Quickstart: Divi Personal Finance App

**Feature**: `001-divi-finance-app`
**Status**: Draft

## Development Prerequisites

- **Node.js**: v18 or higher.
- **Package Manager**: npm or yarn.
- **Supabase Account**: A project with a configured database and Google OAuth.
- **Dexie.js**: Installed as a dependency for offline storage.

## Setup Steps

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/user/divi.git
    cd divi
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Create a `.env` file in the root directory:
    ```bash
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    VITE_GOOGLE_CLIENT_ID=your-google-client-id
    ```

4.  **Supabase Initialization**:
    - Run the provided SQL migration files (to be generated in Phase 2) in the Supabase SQL Editor to set up tables, RLS, and indexes.

5.  **Run the development server**:
    ```bash
    npm run dev
    ```

6.  **Access the app**:
    Open `http://localhost:5173` in your browser.

## Testing

- **Unit Tests**: `npm run test:unit`
- **E2E Tests**: `npm run test:e2e`
- **Linting**: `npm run lint`

## Service Worker & PWA

- To test PWA features locally, use `npm run build && npm run preview`.
- The Service Worker will be registered and cached files will be served.
- Use the browser's developer tools (Application tab) to simulate offline mode and verify synchronization.
