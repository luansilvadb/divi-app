# Gitignore Structure Contract

## Standard Sections

The `.gitignore` file MUST follow this organizational structure for readability and maintenance:

1. **Security & Secrets**: All `.env` files, keys, and credentials.
2. **Build Outputs**: Vite/Vue build artifacts (`dist`, `build`).
3. **Dependencies**: `node_modules`, `pnpm-lock.yaml` (if applicable), `package-lock.json`.
4. **OS Specifics**: `.DS_Store`, `Thumbs.db`, etc.
5. **IDE Specifics**: `.vscode`, `.idea`, `*.swp`.
6. **Logs & Debugging**: `*.log`, `npm-debug.log*`.
7. **Local Databases**: `*.sqlite`, `*.db`.
8. **Supabase Local Dev**: `.supabase/functions/.import_map.json`.

## Requirements

- **Encoding**: UTF-8.
- **Line Endings**: LF (standard for Git).
- **Comments**: Each section MUST start with a `#` comment header.
- **Safety**: `.env*` MUST be the first rule under Security.
