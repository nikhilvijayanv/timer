import { globalShortcut } from 'electron';
import { getConfig } from './config';
import { TimerService } from './services/TimerService';
import { refreshTrayDisplay } from './trayUpdater';

let registeredShortcut: string | null = null;

/**
 * Register global shortcut from config
 */
export function registerGlobalShortcut(): boolean {
  const config = getConfig();
  const shortcut = config.globalShortcut;

  // Unregister existing shortcut if any
  if (registeredShortcut) {
    globalShortcut.unregister(registeredShortcut);
    registeredShortcut = null;
  }

  try {
    const success = globalShortcut.register(shortcut, () => {
      handleShortcutPressed();
    });

    if (success) {
      registeredShortcut = shortcut;
      console.log(`Global shortcut registered: ${shortcut}`);
      return true;
    } else {
      console.error(`Failed to register shortcut: ${shortcut}`);
      return false;
    }
  } catch (error) {
    console.error(`Error registering shortcut: ${shortcut}`, error);
    return false;
  }
}

/**
 * Handle global shortcut press - toggle timer
 */
function handleShortcutPressed(): void {
  console.log('Global shortcut pressed');

  const activeTimer = TimerService.getActiveTimer();

  if (activeTimer) {
    // Stop active timer
    const stopped = TimerService.stopTimer();
    console.log('Timer stopped via shortcut:', stopped);

    // TODO: Play stop sound (will implement in Phase 6)
  } else {
    // Start new timer with default task name
    const defaultTaskName = 'Quick Timer';
    const timerId = TimerService.startTimer(defaultTaskName);
    console.log('Timer started via shortcut:', timerId);

    // TODO: Play start sound (will implement in Phase 6)
  }

  // Refresh tray immediately
  refreshTrayDisplay();
}

/**
 * Unregister all shortcuts
 */
export function unregisterGlobalShortcut(): void {
  if (registeredShortcut) {
    globalShortcut.unregister(registeredShortcut);
    console.log('Global shortcut unregistered');
    registeredShortcut = null;
  }
}

/**
 * Unregister all shortcuts on quit
 */
export function unregisterAllShortcuts(): void {
  globalShortcut.unregisterAll();
  console.log('All global shortcuts unregistered');
  registeredShortcut = null;
}

/**
 * Check if a shortcut is registered
 */
export function isShortcutRegistered(): boolean {
  return registeredShortcut !== null;
}

/**
 * Get currently registered shortcut
 */
export function getRegisteredShortcut(): string | null {
  return registeredShortcut;
}
