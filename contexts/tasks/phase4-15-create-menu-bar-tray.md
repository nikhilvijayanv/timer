# Task 15: Create menuBar.ts (Tray Icon & Popover Window Management)

**Phase:** 4 - Electron Main Process
**Dependencies:** Task 14 (main.ts implemented)

## Description
Implement the menu bar tray icon with dynamic title (timer display), context menu, and popover window positioning.

## Implementation Steps

1. **Create electron/menuBar.ts**
   ```typescript
   import { Tray, Menu, BrowserWindow, screen, nativeImage } from 'electron';
   import path from 'path';

   let tray: Tray | null = null;
   let window: BrowserWindow | null = null;

   /**
    * Create the menu bar tray icon
    */
   export function createMenuBarTray(mainWindow: BrowserWindow): Tray {
     window = mainWindow;

     // Create tray icon (will use template image for native look)
     const iconPath = getIconPath();
     tray = new Tray(iconPath);

     tray.setToolTip('Timer');

     // Set initial title
     updateTrayTitle('Timer');

     // Handle tray click
     tray.on('click', () => {
       toggleWindow();
     });

     // Create context menu
     const contextMenu = Menu.buildFromTemplate([
       {
         label: 'Show Timer',
         click: () => {
           if (window) {
             showWindow();
           }
         },
       },
       { type: 'separator' },
       {
         label: 'Quit',
         click: () => {
           if (window) {
             window.destroy();
           }
           require('electron').app.quit();
         },
       },
     ]);

     tray.setContextMenu(contextMenu);

     console.log('Menu bar tray created');
     return tray;
   }

   /**
    * Update the tray title (shows timer in menu bar)
    */
   export function updateTrayTitle(title: string): void {
     if (tray) {
       tray.setTitle(title);
     }
   }

   /**
    * Toggle window visibility
    */
   function toggleWindow(): void {
     if (!window) return;

     if (window.isVisible()) {
       window.hide();
     } else {
       showWindow();
     }
   }

   /**
    * Show window positioned below tray icon
    */
   function showWindow(): void {
     if (!window || !tray) return;

     // Get tray bounds
     const trayBounds = tray.getBounds();

     // Get primary display
     const primaryDisplay = screen.getPrimaryDisplay();
     const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

     // Window dimensions
     const windowWidth = 360;
     const windowHeight = 480;

     // Calculate position
     let x = Math.round(trayBounds.x + trayBounds.width / 2 - windowWidth / 2);
     let y = Math.round(trayBounds.y + trayBounds.height);

     // Ensure window stays on screen
     if (x + windowWidth > screenWidth) {
       x = screenWidth - windowWidth;
     }
     if (x < 0) {
       x = 0;
     }

     // On macOS, menu bar is at top, so window should be below
     // Add small gap
     y = y + 5;

     // Set position and show
     window.setPosition(x, y, false);
     window.show();
     window.focus();
   }

   /**
    * Hide window
    */
   export function hideWindow(): void {
     if (window && window.isVisible()) {
       window.hide();
     }
   }

   /**
    * Get icon path (will create actual icon in later task)
    */
   function getIconPath(): string {
     // For now, use a default template icon
     // Template icons on macOS automatically adapt to dark/light mode
     const iconName = process.platform === 'darwin' ? 'iconTemplate.png' : 'icon.png';
     const iconPath = path.join(__dirname, '..', 'assets', iconName);

     // Check if icon exists, otherwise use a default
     try {
       return iconPath;
     } catch {
       // Create a simple 16x16 icon programmatically as fallback
       return nativeImage.createEmpty().toDataURL();
     }
   }

   /**
    * Destroy tray
    */
   export function destroyTray(): void {
     if (tray) {
       tray.destroy();
       tray = null;
       console.log('Tray destroyed');
     }
   }

   /**
    * Get tray instance (for external use)
    */
   export function getTray(): Tray | null {
     return tray;
   }
   ```

2. **Create assets directory for icons**
   ```bash
   mkdir -p assets
   ```

3. **Create placeholder icon**
   Create `assets/README.md`:
   ```markdown
   # Tray Icons

   ## Required Files
   - `iconTemplate.png` - macOS menu bar icon (16x16 or 32x32 @2x)
   - `icon.png` - Windows/Linux tray icon (16x16)

   ## macOS Icon Requirements
   - Use `iconTemplate.png` naming for automatic dark mode support
   - Should be a simple, monochrome design
   - Black on transparent background
   - Size: 16x16 (or 32x32 for @2x)

   ## Create Icon
   Can use SF Symbols, create custom in design tool, or use simple Unicode:
   - Clock emoji: ⏱
   - Timer symbol: ⏲
   - Simple clock: 🕐

   For now, tray will work without icon but appearance may not be optimal.
   ```

4. **Test tray functionality**
   ```bash
   npm run dev
   ```

   Verify:
   - Tray icon appears in menu bar
   - Clicking tray toggles window visibility
   - Window appears below tray icon
   - Right-click shows context menu
   - Quit from context menu works

5. **Test window positioning on different displays**
   If you have multiple monitors, test that the window appears correctly positioned below the tray icon

## Acceptance Criteria
- [ ] Tray icon created in menu bar
- [ ] Click tray to toggle window
- [ ] Window positioned below tray icon
- [ ] Window stays on screen (doesn't go off edge)
- [ ] Context menu with Show and Quit options
- [ ] Tray title can be updated (for timer display)
- [ ] Window hides when clicking outside
- [ ] Tray destroyed on app quit

## Positioning Logic
```
┌─────────────────────────────────────┐
│  Menu Bar        [Tray Icon]        │
├─────────────────────────────────────┤
│                 ┌──────┐            │
│                 │      │            │
│              Window (360x480)       │
│                 │      │            │
│                 └──────┘            │
```

## Future Enhancements (Not in this task)
- Dynamic icon based on timer state
- Update tray title with elapsed time
- Badge/notification dot on icon

## References
- project_init.md lines 23, 47-51 (Menu bar integration)
- project_init.md lines 136-140 (MenuBar module)
