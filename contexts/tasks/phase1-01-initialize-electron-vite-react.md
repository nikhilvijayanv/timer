# Task 01: Initialize Electron + Vite + React + TypeScript Project

**Phase:** 1 - Project Setup & Infrastructure
**Dependencies:** None (first task)

## Description

Set up the foundational project structure using Electron 38.3.0, Vite 7.1.10, React 19.0.0, and TypeScript. This creates the base application framework.

## Implementation Steps

1. **Verify Node.js version**

   ```bash
   node --version  # Must be 20.19+ or 22.12+
   ```

2. **Initialize project with npm**

   ```bash
   npm create vite@latest . -- --template react-ts
   ```

3. **Install Electron and core dependencies**

   ```bash
   npm install --save-dev electron@^38.3.0
   npm install --save-dev electron-builder
   npm install --save-dev concurrently wait-on cross-env
   ```

4. **Install React 19 (if not already at correct version)**

   ```bash
   npm install react@^19.0.0 react-dom@^19.0.0
   npm install --save-dev @types/react@^19.0.0 @types/react-dom@^19.0.0
   ```

5. **Create basic package.json scripts**
   Add to package.json:

   ```json
   {
     "scripts": {
       "dev": "concurrently \"npm run dev:vite\" \"npm run dev:electron\"",
       "dev:vite": "vite",
       "dev:electron": "wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .",
       "build": "tsc && vite build && electron-builder",
       "preview": "vite preview"
     },
     "main": "electron/main.js"
   }
   ```

6. **Create electron directory**

   ```bash
   mkdir electron
   ```

7. **Create minimal electron/main.ts**

   ```typescript
   import { app, BrowserWindow } from 'electron';
   import path from 'path';

   let mainWindow: BrowserWindow | null = null;

   function createWindow() {
     mainWindow = new BrowserWindow({
       width: 360,
       height: 480,
       webPreferences: {
         nodeIntegration: false,
         contextIsolation: true,
         preload: path.join(__dirname, 'preload.js'),
       },
     });

     if (process.env.NODE_ENV === 'development') {
       mainWindow.loadURL('http://localhost:5173');
     } else {
       mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
     }
   }

   app.whenReady().then(createWindow);

   app.on('window-all-closed', () => {
     if (process.platform !== 'darwin') {
       app.quit();
     }
   });
   ```

8. **Create minimal electron/preload.ts**

   ```typescript
   import { contextBridge } from 'electron';

   contextBridge.exposeInMainWorld('electron', {
     // IPC methods will be added later
   });
   ```

## Acceptance Criteria

- [ ] Node.js version is 20.19+ or 22.12+
- [ ] package.json has correct dependencies for Electron 38, React 19, Vite 7
- [ ] `electron/` directory exists with main.ts and preload.ts
- [ ] Project structure follows standard Vite + Electron pattern
- [ ] `npm run dev` command exists (even if not fully working yet)

## References

- [Electron Documentation](https://www.electronjs.org/docs/latest/)
- [Vite Documentation](https://vite.dev/)
- project_init.md lines 6-11, 122-125
