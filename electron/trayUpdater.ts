import { TimerService } from './services/TimerService';
import { updateTrayTitle } from './menuBar';
import { getElapsedSeconds, formatTrayTitle } from './utils/timeFormat';

let updateInterval: NodeJS.Timeout | null = null;

/**
 * Start updating tray title every second
 */
export function startTrayUpdates(): void {
  // Clear existing interval
  stopTrayUpdates();

  // Update immediately
  updateTrayDisplay();

  // Then update every second
  updateInterval = setInterval(() => {
    updateTrayDisplay();
  }, 1000);

  console.log('Tray updates started');
}

/**
 * Stop updating tray title
 */
export function stopTrayUpdates(): void {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
    console.log('Tray updates stopped');
  }
}

/**
 * Update tray display based on active timer
 */
function updateTrayDisplay(): void {
  const activeTimer = TimerService.getActiveTimer();

  if (activeTimer) {
    const elapsedSeconds = getElapsedSeconds(activeTimer.start_time);
    const title = formatTrayTitle(elapsedSeconds);
    updateTrayTitle(title);
  } else {
    updateTrayTitle('Timer');
  }
}

/**
 * Force immediate tray update
 */
export function refreshTrayDisplay(): void {
  updateTrayDisplay();
}
