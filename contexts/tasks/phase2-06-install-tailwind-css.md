# Task 06: Install and Configure Tailwind CSS 4

**Phase:** 2 - Styling & UI Foundation
**Dependencies:** Task 04 (Project structure created)

## Description

Install Tailwind CSS 4.0 and configure it for the Electron React app with CSS-first configuration approach.

## Implementation Steps

1. **Install Tailwind CSS 4 and dependencies**

   ```bash
   npm install -D tailwindcss@^4.0.0 postcss autoprefixer
   ```

2. **Initialize Tailwind config**

   ```bash
   npx tailwindcss init -p
   ```

3. **Update tailwind.config.js for Tailwind 4**

   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
     theme: {
       extend: {
         colors: {
           border: 'hsl(var(--border))',
           input: 'hsl(var(--input))',
           ring: 'hsl(var(--ring))',
           background: 'hsl(var(--background))',
           foreground: 'hsl(var(--foreground))',
           primary: {
             DEFAULT: 'hsl(var(--primary))',
             foreground: 'hsl(var(--primary-foreground))',
           },
           secondary: {
             DEFAULT: 'hsl(var(--secondary))',
             foreground: 'hsl(var(--secondary-foreground))',
           },
           destructive: {
             DEFAULT: 'hsl(var(--destructive))',
             foreground: 'hsl(var(--destructive-foreground))',
           },
           muted: {
             DEFAULT: 'hsl(var(--muted))',
             foreground: 'hsl(var(--muted-foreground))',
           },
           accent: {
             DEFAULT: 'hsl(var(--accent))',
             foreground: 'hsl(var(--accent-foreground))',
           },
           popover: {
             DEFAULT: 'hsl(var(--popover))',
             foreground: 'hsl(var(--popover-foreground))',
           },
           card: {
             DEFAULT: 'hsl(var(--card))',
             foreground: 'hsl(var(--card-foreground))',
           },
         },
         borderRadius: {
           lg: 'var(--radius)',
           md: 'calc(var(--radius) - 2px)',
           sm: 'calc(var(--radius) - 4px)',
         },
       },
     },
     plugins: [],
   };
   ```

4. **Update src/index.css with Tailwind directives and CSS variables**

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     :root {
       --background: 0 0% 100%;
       --foreground: 222.2 84% 4.9%;
       --card: 0 0% 100%;
       --card-foreground: 222.2 84% 4.9%;
       --popover: 0 0% 100%;
       --popover-foreground: 222.2 84% 4.9%;
       --primary: 221.2 83.2% 53.3%;
       --primary-foreground: 210 40% 98%;
       --secondary: 210 40% 96.1%;
       --secondary-foreground: 222.2 47.4% 11.2%;
       --muted: 210 40% 96.1%;
       --muted-foreground: 215.4 16.3% 46.9%;
       --accent: 210 40% 96.1%;
       --accent-foreground: 222.2 47.4% 11.2%;
       --destructive: 0 84.2% 60.2%;
       --destructive-foreground: 210 40% 98%;
       --border: 214.3 31.8% 91.4%;
       --input: 214.3 31.8% 91.4%;
       --ring: 221.2 83.2% 53.3%;
       --radius: 0.5rem;
     }

     .dark {
       --background: 222.2 84% 4.9%;
       --foreground: 210 40% 98%;
       --card: 222.2 84% 4.9%;
       --card-foreground: 210 40% 98%;
       --popover: 222.2 84% 4.9%;
       --popover-foreground: 210 40% 98%;
       --primary: 217.2 91.2% 59.8%;
       --primary-foreground: 222.2 47.4% 11.2%;
       --secondary: 217.2 32.6% 17.5%;
       --secondary-foreground: 210 40% 98%;
       --muted: 217.2 32.6% 17.5%;
       --muted-foreground: 215 20.2% 65.1%;
       --accent: 217.2 32.6% 17.5%;
       --accent-foreground: 210 40% 98%;
       --destructive: 0 62.8% 30.6%;
       --destructive-foreground: 210 40% 98%;
       --border: 217.2 32.6% 17.5%;
       --input: 217.2 32.6% 17.5%;
       --ring: 224.3 76.3% 48%;
     }
   }

   @layer base {
     * {
       @apply border-border;
     }
     body {
       @apply bg-background text-foreground;
     }
   }
   ```

5. **Verify Tailwind is working**
   Update src/App.tsx to test:

   ```typescript
   function App() {
     return (
       <div className="min-h-screen bg-background p-4">
         <div className="max-w-md mx-auto">
           <h1 className="text-2xl font-bold text-foreground">Timer App</h1>
           <p className="text-muted-foreground mt-2">Menu bar timer application</p>
           <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
             Test Button
           </button>
         </div>
       </div>
     );
   }

   export default App;
   ```

6. **Test with npm run dev**
   ```bash
   npm run dev
   ```
   Should see styled content with Tailwind classes applied

## Acceptance Criteria

- [ ] Tailwind CSS 4 installed and configured
- [ ] CSS variables set up for theming (light/dark mode ready)
- [ ] Tailwind directives in src/index.css
- [ ] Test components render with Tailwind styles
- [ ] No console errors related to CSS

## References

- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)
- project_init.md lines 8-9, 127-130
