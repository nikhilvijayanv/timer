# Task 07: Initialize shadcn/ui with Required Components

**Phase:** 2 - Styling & UI Foundation
**Dependencies:** Task 06 (Tailwind CSS configured)

## Description
Initialize shadcn/ui and install the core components needed for the timer application UI.

## Implementation Steps

1. **Install shadcn/ui CLI and initialize**
   ```bash
   npx shadcn@latest init
   ```

   When prompted, configure:
   - TypeScript: Yes
   - Style: Default
   - Base color: Slate
   - CSS variables: Yes
   - tailwind.config: Yes
   - components location: `@/components`
   - utils location: `@/lib/utils`
   - React Server Components: No
   - Write configuration: Yes

2. **Create lib/utils.ts if not created**
   ```typescript
   import { type ClassValue, clsx } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

3. **Install required utility dependencies**
   ```bash
   npm install clsx tailwind-merge
   npm install class-variance-authority
   ```

4. **Add core components needed for the app**
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add input
   npx shadcn@latest add card
   npx shadcn@latest add badge
   npx shadcn@latest add dialog
   npx shadcn@latest add tabs
   npx shadcn@latest add dropdown-menu
   npx shadcn@latest add separator
   npx shadcn@latest add scroll-area
   ```

5. **Verify components directory structure**
   ```bash
   ls -la src/components/ui/
   ```
   Should see: button.tsx, input.tsx, card.tsx, badge.tsx, dialog.tsx, tabs.tsx, dropdown-menu.tsx, separator.tsx, scroll-area.tsx

6. **Test a shadcn/ui component**
   Update src/App.tsx:
   ```typescript
   import { Button } from "@/components/ui/button";
   import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

   function App() {
     return (
       <div className="min-h-screen bg-background p-4">
         <Card className="max-w-md mx-auto">
           <CardHeader>
             <CardTitle>Timer App</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-muted-foreground mb-4">Menu bar timer application</p>
             <Button>Start Timer</Button>
           </CardContent>
         </Card>
       </div>
     );
   }

   export default App;
   ```

7. **Run and verify**
   ```bash
   npm run dev
   ```
   Should see a styled card with a button using shadcn/ui components

## Acceptance Criteria
- [ ] shadcn/ui initialized successfully
- [ ] All required components installed (button, input, card, badge, dialog, tabs, dropdown-menu, separator, scroll-area)
- [ ] src/components/ui/ directory contains all component files
- [ ] lib/utils.ts created with cn() helper
- [ ] Path alias @/ works correctly
- [ ] Test component renders without errors

## References
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [shadcn/ui Installation](https://ui.shadcn.com/docs/installation)
- project_init.md lines 8, 132-134, 200-204
