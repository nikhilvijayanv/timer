# Task 02: Configure Vite 7 for Electron 38 Compatibility

**Phase:** 1 - Project Setup & Infrastructure
**Dependencies:** Task 01 (Initialize project)

## Description

Configure Vite to properly build for Electron, handle TypeScript compilation for the main process, and externalize native modules.

## Implementation Steps

1. **Install vite plugin for electron**

   ```bash
   npm install --save-dev vite-plugin-electron vite-plugin-electron-renderer
   ```

2. **Update vite.config.ts**

   ```typescript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import electron from 'vite-plugin-electron';
   import renderer from 'vite-plugin-electron-renderer';
   import path from 'path';

   export default defineConfig({
     plugins: [
       react(),
       electron([
         {
           entry: 'electron/main.ts',
           vite: {
             build: {
               outDir: 'dist-electron',
               rollupOptions: {
                 external: ['better-sqlite3'], // Will add in Task 03
               },
             },
           },
         },
         {
           entry: 'electron/preload.ts',
           onstart(options) {
             options.reload();
           },
           vite: {
             build: {
               outDir: 'dist-electron',
             },
           },
         },
       ]),
       renderer(),
     ],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
     base: './', // Important for Electron file:// protocol
   });
   ```

3. **Create tsconfig.node.json for Electron**

   ```json
   {
     "compilerOptions": {
       "composite": true,
       "skipLibCheck": true,
       "module": "ESNext",
       "moduleResolution": "bundler",
       "allowSyntheticDefaultImports": true,
       "strict": true,
       "esModuleInterop": true,
       "resolveJsonModule": true
     },
     "include": ["electron/**/*.ts", "vite.config.ts"]
   }
   ```

4. **Update main tsconfig.json**
   Add reference to tsconfig.node.json:

   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "useDefineForClassFields": true,
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "skipLibCheck": true,
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx",
       "strict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noFallthroughCasesInSwitch": true,
       "paths": {
         "@/*": ["./src/*"]
       }
     },
     "include": ["src"],
     "references": [{ "path": "./tsconfig.node.json" }]
   }
   ```

5. **Update .gitignore**
   Add:

   ```
   dist-electron
   dist
   node_modules
   *.local
   .DS_Store
   ```

6. **Test the build**
   ```bash
   npm run dev
   ```
   Should open an Electron window showing Vite's React template

## Acceptance Criteria

- [ ] vite.config.ts properly configured for Electron
- [ ] TypeScript compilation works for both renderer and main process
- [ ] `npm run dev` launches Electron app with hot reload
- [ ] Path alias `@/` resolves to `src/`
- [ ] Build outputs to dist-electron and dist directories

## References

- [vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron)
- project_init.md lines 11, 99, 122-125
