# Task 04: Set Up Project Directory Structure

**Phase:** 1 - Project Setup & Infrastructure
**Dependencies:** Task 01 (Initialize project)

## Description
Create the complete directory structure as defined in project_init.md, organizing code into logical modules for the Electron main process and React renderer.

## Implementation Steps

1. **Create electron/ subdirectories**
   ```bash
   mkdir -p electron/services
   ```

2. **Create src/ subdirectories**
   ```bash
   mkdir -p src/components/ui
   mkdir -p src/features/Timer
   mkdir -p src/features/Tasks
   mkdir -p src/features/Projects
   mkdir -p src/features/Reports
   mkdir -p src/hooks
   mkdir -p src/contexts
   mkdir -p src/assets/icons
   ```

3. **Create placeholder files for electron modules**
   ```bash
   touch electron/config.ts
   touch electron/menuBar.ts
   touch electron/services/TimerService.ts
   touch electron/services/SoundService.ts
   ```

4. **Create placeholder README files for future features**
   ```bash
   echo "# Timer Feature" > src/features/Timer/README.md
   echo "# Tasks Feature" > src/features/Tasks/README.md
   echo "# Projects Feature (Future)" > src/features/Projects/README.md
   echo "# Reports Feature (Future)" > src/features/Reports/README.md
   ```

5. **Update src/main.tsx (Vite default entry)**
   Ensure it exists and has basic React setup:
   ```typescript
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './index.css';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

6. **Create basic src/App.tsx**
   ```typescript
   function App() {
     return (
       <div className="app">
         <h1>Timer App</h1>
         <p>Menu bar timer application</p>
       </div>
     );
   }

   export default App;
   ```

7. **Verify directory structure**
   ```bash
   tree -L 3 -I 'node_modules|dist*'
   ```
   Should match structure from project_init.md lines 17-44

## Expected Structure
```
root/
├─ electron/
│  ├─ main.ts
│  ├─ preload.ts
│  ├─ config.ts
│  ├─ menuBar.ts
│  └─ services/
│     ├─ TimerService.ts
│     └─ SoundService.ts
├─ src/
│  ├─ components/
│  │  └─ ui/
│  ├─ features/
│  │  ├─ Timer/
│  │  ├─ Tasks/
│  │  ├─ Projects/
│  │  └─ Reports/
│  ├─ hooks/
│  ├─ contexts/
│  ├─ assets/
│  │  └─ icons/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ package.json
├─ vite.config.ts
└─ tsconfig.json
```

## Acceptance Criteria
- [ ] All directories exist as per project structure
- [ ] Placeholder files created for main modules
- [ ] Directory structure matches project_init.md specification
- [ ] `npm run dev` still works after restructuring

## References
- project_init.md lines 16-44 (Project Structure section)
