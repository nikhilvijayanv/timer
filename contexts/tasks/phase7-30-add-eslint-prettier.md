# Task 30: Add ESLint and Prettier Configuration

**Phase:** 7 - Testing, Build & Polish
**Dependencies:** All previous phases

## Description

Set up code quality tools (ESLint and Prettier) to ensure consistent code style and catch potential issues.

## Implementation Steps

1. **Install ESLint and Prettier**

   ```bash
   npm install --save-dev eslint prettier
   npm install --save-dev eslint-config-prettier eslint-plugin-prettier
   npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
   npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
   ```

2. **Create .eslintrc.cjs**

   ```javascript
   module.exports = {
     root: true,
     env: {
       browser: true,
       es2021: true,
       node: true,
     },
     extends: [
       'eslint:recommended',
       'plugin:@typescript-eslint/recommended',
       'plugin:react/recommended',
       'plugin:react-hooks/recommended',
       'plugin:prettier/recommended',
     ],
     parser: '@typescript-eslint/parser',
     parserOptions: {
       ecmaVersion: 'latest',
       sourceType: 'module',
       ecmaFeatures: {
         jsx: true,
       },
     },
     plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
     rules: {
       'react/react-in-jsx-scope': 'off', // Not needed in React 19
       '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
       '@typescript-eslint/no-explicit-any': 'warn',
       'prettier/prettier': 'warn',
       'no-console': 'off', // Allow console in Electron app
     },
     settings: {
       react: {
         version: 'detect',
       },
     },
     ignorePatterns: ['dist', 'dist-electron', 'node_modules', '*.config.js', '*.config.ts'],
   };
   ```

3. **Create .prettierrc**

   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5",
     "printWidth": 100,
     "arrowParens": "always",
     "endOfLine": "lf"
   }
   ```

4. **Create .prettierignore**

   ```
   dist
   dist-electron
   node_modules
   build
   release
   *.md
   package-lock.json
   ```

5. **Create .eslintignore**

   ```
   dist
   dist-electron
   node_modules
   build
   release
   *.config.js
   *.config.ts
   ```

6. **Add scripts to package.json**

   ```json
   {
     "scripts": {
       "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
       "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
       "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\" \"electron/**/*.{ts,js}\"",
       "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\" \"electron/**/*.{ts,js}\""
     }
   }
   ```

7. **Run linter and fix issues**

   ```bash
   npm run lint
   ```

   Review errors and warnings:
   - Fix critical issues
   - Add `// eslint-disable-next-line` for justified exceptions
   - Run `npm run lint:fix` to auto-fix formatting

8. **Run Prettier**

   ```bash
   npm run format
   ```

   This will format all code consistently

9. **Set up VS Code integration (optional)**
   Create `.vscode/settings.json`:

   ```json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
   }
   ```

   Create `.vscode/extensions.json`:

   ```json
   {
     "recommendations": [
       "dbaeumer.vscode-eslint",
       "esbenp.prettier-vscode",
       "bradlc.vscode-tailwindcss"
     ]
   }
   ```

10. **Add pre-commit hook (optional)**

    ```bash
    npm install --save-dev husky lint-staged
    npx husky install
    ```

    Update package.json:

    ```json
    {
      "lint-staged": {
        "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
        "*.{json,css,md}": ["prettier --write"]
      },
      "scripts": {
        "prepare": "husky install"
      }
    }
    ```

    Create `.husky/pre-commit`:

    ```bash
    #!/bin/sh
    . "$(dirname "$0")/_/husky.sh"

    npx lint-staged
    ```

## Acceptance Criteria

- [ ] ESLint configured and running
- [ ] Prettier configured and running
- [ ] No critical lint errors
- [ ] All code formatted consistently
- [ ] Scripts added to package.json
- [ ] VS Code integration working (optional)
- [ ] Pre-commit hooks working (optional)

## Common Lint Issues to Fix

- Unused imports
- Unused variables
- Missing type annotations
- Any type usage
- Console.log statements (can keep in Electron)
- React hooks dependencies

## Prettier Formatting

- Consistent indentation (2 spaces)
- Single quotes
- Semicolons
- Line length 100 chars
- Trailing commas (ES5)

## Benefits

- **Consistency:** All code looks the same
- **Quality:** Catch bugs early
- **Maintainability:** Easier to read and modify
- **Best practices:** Enforce React/TypeScript patterns

## Optional: Strict Mode

For stricter linting, update ESLint rules:

```javascript
rules: {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/explicit-function-return-type': 'warn',
  'no-console': ['warn', { allow: ['warn', 'error'] }],
}
```

## References

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- project_init.md line 229 (Add lint/prettier config)
