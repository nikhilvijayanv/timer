# Task 08: Set Up Base Styles and Theme Configuration

**Phase:** 2 - Styling & UI Foundation
**Dependencies:** Task 06, 07 (Tailwind and shadcn/ui configured)

## Description
Configure the theme system to support light/dark modes and establish base styling that matches the menu bar popover design requirements.

## Implementation Steps

1. **Create theme context**
   Create `src/contexts/ThemeContext.tsx`:
   ```typescript
   import React, { createContext, useContext, useEffect, useState } from 'react';

   type Theme = 'light' | 'dark' | 'system';

   interface ThemeContextType {
     theme: Theme;
     setTheme: (theme: Theme) => void;
     effectiveTheme: 'light' | 'dark';
   }

   const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

   export function ThemeProvider({ children }: { children: React.ReactNode }) {
     const [theme, setTheme] = useState<Theme>('system');
     const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

     useEffect(() => {
       // Load theme from config via IPC (will implement later)
       // For now, use system preference
       const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
       setEffectiveTheme(theme === 'system' ? (isDark ? 'dark' : 'light') : theme);
     }, [theme]);

     useEffect(() => {
       const root = window.document.documentElement;
       root.classList.remove('light', 'dark');
       root.classList.add(effectiveTheme);
     }, [effectiveTheme]);

     return (
       <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
         {children}
       </ThemeContext.Provider>
     );
   }

   export function useTheme() {
     const context = useContext(ThemeContext);
     if (context === undefined) {
       throw new Error('useTheme must be used within a ThemeProvider');
     }
     return context;
   }
   ```

2. **Update src/main.tsx to include ThemeProvider**
   ```typescript
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import { ThemeProvider } from './contexts/ThemeContext';
   import './index.css';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <ThemeProvider>
         <App />
       </ThemeProvider>
     </React.StrictMode>
   );
   ```

3. **Add popover-specific styles to index.css**
   ```css
   /* Menu bar popover window specific styles */
   body {
     margin: 0;
     padding: 0;
     overflow: hidden; /* Prevent scrolling of main container */
     user-select: none; /* Prevent text selection */
     -webkit-user-select: none;
     -webkit-app-region: no-drag;
   }

   #root {
     width: 360px;
     height: 480px;
     overflow: hidden;
   }

   /* Custom scrollbar for macOS feel */
   ::-webkit-scrollbar {
     width: 8px;
   }

   ::-webkit-scrollbar-track {
     background: transparent;
   }

   ::-webkit-scrollbar-thumb {
     background: hsl(var(--muted-foreground) / 0.3);
     border-radius: 4px;
   }

   ::-webkit-scrollbar-thumb:hover {
     background: hsl(var(--muted-foreground) / 0.5);
   }
   ```

4. **Update App.tsx with proper container sizing**
   ```typescript
   import { Button } from "@/components/ui/button";
   import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

   function App() {
     return (
       <div className="w-full h-full bg-background overflow-hidden">
         <div className="w-full h-full flex flex-col">
           <Card className="flex-1 rounded-none border-0 shadow-none">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">Timer App</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground mb-4">
                 Menu bar timer application
               </p>
               <Button className="w-full">Start Timer</Button>
             </CardContent>
           </Card>
         </div>
       </div>
     );
   }

   export default App;
   ```

5. **Test theme switching**
   Add a theme toggle button temporarily to test:
   ```typescript
   import { useTheme } from "@/contexts/ThemeContext";

   // In App component:
   const { theme, setTheme, effectiveTheme } = useTheme();

   <Button
     variant="outline"
     size="sm"
     onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
   >
     Toggle {effectiveTheme}
   </Button>
   ```

## Acceptance Criteria
- [ ] ThemeContext created and working
- [ ] Theme persists across renders
- [ ] Light and dark modes both render correctly
- [ ] Popover-specific styles applied (360x480 fixed size)
- [ ] Custom scrollbar styling matches macOS aesthetic
- [ ] No layout overflow or scrolling issues

## References
- project_init.md lines 51, 64-78, 109-110
