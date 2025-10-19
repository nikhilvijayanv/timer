# Task 27: Sync Config Settings with UI

**Phase:** 6 - Timer Logic & Integration
**Dependencies:** Task 12 (Config service), Task 26 (Sound implemented)

## Description

Create a settings dialog in the UI that allows users to view and update configuration without manually editing config.json.

## Implementation Steps

1. **Create Settings dialog component**
   Create `src/components/SettingsDialog.tsx`:

   ```typescript
   import { useState, useEffect } from 'react';
   import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
   } from '@/components/ui/dialog';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   import { Label } from '@/components/ui/label';
   import { Separator } from '@/components/ui/separator';
   import { Badge } from '@/components/ui/badge';
   import { Settings } from '@/components/ui/icons';
   import { useTheme } from '@/contexts/ThemeContext';
   import { useAppSound } from '@/contexts/SoundContext';

   interface AppConfig {
     globalShortcut: string;
     theme: 'light' | 'dark' | 'system';
     soundEnabled: boolean;
     startSound: string;
     stopSound: string;
   }

   export function SettingsDialog() {
     const [open, setOpen] = useState(false);
     const [config, setConfig] = useState<AppConfig | null>(null);
     const [configPath, setConfigPath] = useState('');
     const { setTheme } = useTheme();
     const { setSoundEnabled } = useAppSound();

     useEffect(() => {
       if (open) {
         loadConfig();
       }
     }, [open]);

     const loadConfig = async () => {
       try {
         const cfg = await window.electron.config.get();
         const path = await window.electron.config.getPath();
         setConfig(cfg);
         setConfigPath(path);
       } catch (error) {
         console.error('Error loading config:', error);
       }
     };

     const handleSave = async () => {
       if (!config) return;

       try {
         await window.electron.config.update(config);

         // Apply settings to UI
         setTheme(config.theme);
         setSoundEnabled(config.soundEnabled);

         setOpen(false);
       } catch (error) {
         console.error('Error saving config:', error);
       }
     };

     const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
       setConfig((prev) => prev ? { ...prev, theme } : null);
     };

     const handleSoundToggle = () => {
       setConfig((prev) => prev ? { ...prev, soundEnabled: !prev.soundEnabled } : null);
     };

     if (!config) {
       return (
         <Dialog open={open} onOpenChange={setOpen}>
           <DialogTrigger asChild>
             <Button variant="ghost" size="icon">
               <Settings className="h-4 w-4" />
             </Button>
           </DialogTrigger>
           <DialogContent>
             <div className="text-center py-4">Loading settings...</div>
           </DialogContent>
         </Dialog>
       );
     }

     return (
       <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
           <Button variant="ghost" size="icon">
             <Settings className="h-4 w-4" />
           </Button>
         </DialogTrigger>

         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>Settings</DialogTitle>
             <DialogDescription>
               Manage your timer app preferences
             </DialogDescription>
           </DialogHeader>

           <div className="space-y-4 py-4">
             {/* Theme Setting */}
             <div className="space-y-2">
               <Label>Theme</Label>
               <div className="flex gap-2">
                 {(['light', 'dark', 'system'] as const).map((theme) => (
                   <Button
                     key={theme}
                     variant={config.theme === theme ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => handleThemeChange(theme)}
                     className="capitalize"
                   >
                     {theme}
                   </Button>
                 ))}
               </div>
             </div>

             <Separator />

             {/* Sound Setting */}
             <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <Label>Sound Effects</Label>
                 <Button
                   variant={config.soundEnabled ? 'default' : 'outline'}
                   size="sm"
                   onClick={handleSoundToggle}
                 >
                   {config.soundEnabled ? 'Enabled' : 'Disabled'}
                 </Button>
               </div>
               <p className="text-xs text-muted-foreground">
                 Play sounds when starting and stopping timers
               </p>
             </div>

             <Separator />

             {/* Global Shortcut */}
             <div className="space-y-2">
               <Label htmlFor="shortcut">Global Shortcut</Label>
               <Input
                 id="shortcut"
                 value={config.globalShortcut}
                 onChange={(e) =>
                   setConfig({ ...config, globalShortcut: e.target.value })
                 }
                 placeholder="CommandOrControl+Alt+Shift+."
               />
               <p className="text-xs text-muted-foreground">
                 Requires app restart to take effect
               </p>
             </div>

             <Separator />

             {/* Config File Location */}
             <div className="space-y-2">
               <Label>Configuration File</Label>
               <div className="flex items-center gap-2">
                 <code className="flex-1 text-xs bg-muted px-2 py-1 rounded truncate">
                   {configPath}
                 </code>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     // Copy path to clipboard
                     navigator.clipboard.writeText(configPath);
                   }}
                 >
                   Copy
                 </Button>
               </div>
               <p className="text-xs text-muted-foreground">
                 Advanced settings can be edited manually
               </p>
             </div>
           </div>

           <div className="flex justify-end gap-2">
             <Button variant="outline" onClick={() => setOpen(false)}>
               Cancel
             </Button>
             <Button onClick={handleSave}>
               Save Changes
             </Button>
           </div>
         </DialogContent>
       </Dialog>
     );
   }
   ```

2. **Install missing shadcn component**

   ```bash
   npx shadcn@latest add label
   ```

3. **Update AppHeader to use SettingsDialog**
   Update `src/components/AppHeader.tsx`:

   ```typescript
   import { Button } from '@/components/ui/button';
   import { X } from '@/components/ui/icons';
   import { SettingsDialog } from './SettingsDialog';

   export function AppHeader() {
     const handleClose = () => {
       window.electron.window.hide();
     };

     return (
       <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
         <h1 className="text-lg font-semibold">Timer</h1>
         <div className="flex gap-1">
           <SettingsDialog />
           <Button
             variant="ghost"
             size="icon"
             className="h-8 w-8"
             onClick={handleClose}
           >
             <X className="h-4 w-4" />
           </Button>
         </div>
       </div>
     );
   }
   ```

4. **Update ThemeContext to persist changes**
   Update `src/contexts/ThemeContext.tsx`:

   ```typescript
   export function ThemeProvider({ children }: { children: React.ReactNode }) {
     const [theme, setTheme] = useState<Theme>('system');
     const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

     useEffect(() => {
       // Load theme from config on mount
       window.electron.config.get().then((config) => {
         setTheme(config.theme);
       });
     }, []);

     useEffect(() => {
       const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
       setEffectiveTheme(theme === 'system' ? (isDark ? 'dark' : 'light') : theme);
     }, [theme]);

     useEffect(() => {
       const root = window.document.documentElement;
       root.classList.remove('light', 'dark');
       root.classList.add(effectiveTheme);
     }, [effectiveTheme]);

     const updateTheme = (newTheme: Theme) => {
       setTheme(newTheme);
       // Optionally auto-save to config
       window.electron.config.update({ theme: newTheme });
     };

     return (
       <ThemeContext.Provider
         value={{ theme, setTheme: updateTheme, effectiveTheme }}
       >
         {children}
       </ThemeContext.Provider>
     );
   }
   ```

5. **Test settings dialog**

   ```bash
   npm run dev
   ```

   Test:
   - Click settings icon in header
   - Dialog should open with current settings
   - Change theme → should apply immediately
   - Toggle sound → should apply immediately
   - Change global shortcut → should save (requires restart)
   - Click "Copy" on config path → should copy to clipboard
   - Save changes → dialog closes
   - Reopen dialog → changes should persist

## Acceptance Criteria

- [ ] Settings dialog accessible from header
- [ ] All config options displayed
- [ ] Theme changes apply immediately
- [ ] Sound toggle works
- [ ] Global shortcut editable
- [ ] Config file path shown and copyable
- [ ] Changes saved to config.json
- [ ] Settings persist across app restarts
- [ ] Cancel button discards changes

## Settings Managed

- **Theme:** Light, Dark, System (applies immediately)
- **Sound Effects:** On/Off (applies immediately)
- **Global Shortcut:** Text input (requires restart)
- **Config Path:** Display only (with copy button)

## Future Enhancements (Not in this task)

- Validate shortcut format before saving
- Test shortcut registration without restart
- Add more sound options (volume, custom files)
- Hourly rate / billing settings
- Data export/import
- Backup settings

## UI/UX Notes

- Settings icon in top-right of header
- Dialog modal (blocks background)
- Save/Cancel buttons
- Restart warning for shortcut changes
- Immediate preview of theme changes

## References

- project_init.md lines 22, 101-120 (User Configuration)
- project_init.md lines 52, 117-119 (Manually editable config)
