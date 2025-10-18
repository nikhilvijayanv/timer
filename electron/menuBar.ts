import { Tray, Menu, BrowserWindow, screen, nativeImage, app } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
        app.quit();
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
function getIconPath(): nativeImage {
  // For now, use a default template icon
  // Template icons on macOS automatically adapt to dark/light mode
  const iconName = process.platform === 'darwin' ? 'iconTemplate.png' : 'icon.png';
  const iconPath = path.join(__dirname, '..', 'assets', iconName);

  // Check if icon file exists
  if (existsSync(iconPath)) {
    return nativeImage.createFromPath(iconPath);
  }

  // Create a simple programmatic icon as fallback
  // Create a 16x16 empty image (tray will show a default icon)
  console.log('Icon file not found, using fallback empty icon');
  return nativeImage.createEmpty();
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
