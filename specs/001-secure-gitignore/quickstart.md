# Quickstart: Secure Gitignore Configuration

## Overview
This guide explains how to apply and verify the secure `.gitignore` configuration for the project.

## 1. Prerequisites
- Git installed.
- Access to the project root directory.

## 2. Applying the Configuration
1. Open the `.gitignore` file at the project root.
2. Replace its contents with the patterns defined in the `spec.md` and `research.md`.
3. Save the file.

## 3. Verifying the Configuration
Run the following commands to ensure that sensitive and build files are correctly ignored:

```bash
# Check if a .env file is ignored (should return no output)
git status --porcelain .env

# Check if node_modules is ignored (should return no output)
git status --porcelain node_modules/

# Check if build output is ignored (should return no output)
git status --porcelain dist/

# List all ignored files in the repository (should be comprehensive)
git clean -ndX
```

## 4. Troubleshooting
If a file that should be ignored is still being tracked:
1. Run `git rm --cached <file_path>` to untrack it.
2. Verify it's now ignored via `git status`.
3. Commit the removal.
