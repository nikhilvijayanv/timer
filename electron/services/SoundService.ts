import { getConfig } from '../config';

export class SoundService {
  /**
   * Check if sounds are enabled in config
   */
  static isSoundEnabled(): boolean {
    const config = getConfig();
    return config.soundEnabled;
  }

  /**
   * Get the configured start sound filename
   */
  static getStartSound(): string {
    const config = getConfig();
    return config.startSound;
  }

  /**
   * Get the configured stop sound filename
   */
  static getStopSound(): string {
    const config = getConfig();
    return config.stopSound;
  }

  /**
   * Validate sound file exists (for future use)
   */
  static validateSoundFile(filename: string): boolean {
    // TODO: Check if sound file exists in assets
    // For now, just return true
    return true;
  }
}
