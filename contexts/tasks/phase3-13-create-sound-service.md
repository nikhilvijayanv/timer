# Task 13: Create SoundService.ts Placeholder

**Phase:** 3 - Database & Core Services
**Dependencies:** Task 12 (Config service created)

## Description

Create a placeholder SoundService module. The actual sound playback will be implemented in the renderer process using HTML5 Audio, but this service will manage sound-related configuration.

## Implementation Steps

1. **Create electron/services/SoundService.ts**

   ```typescript
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
   ```

2. **Add sound file paths to config**
   The actual sound files will be in `src/assets/` and played via the renderer process

3. **Document sound implementation approach**
   Create `electron/services/README.md`:

   ````markdown
   # Services

   ## SoundService

   Sound playback is handled in the **renderer process** using HTML5 Audio API.

   ### Why renderer process?

   - HTML5 Audio is simpler than native audio APIs
   - No additional dependencies needed
   - Works cross-platform
   - Easier to bundle with Vite

   ### Implementation

   - Sound files: `src/assets/start.wav` and `src/assets/stop.wav`
   - Playback: React component or hook using `new Audio()`
   - Control: SoundService reads config to determine if sounds are enabled

   ### Usage

   ```typescript
   // In renderer process
   import startSound from '@/assets/start.wav';

   if (SoundService.isSoundEnabled()) {
     const audio = new Audio(startSound);
     audio.play();
   }
   ```
   ````

   ```

   ```

4. **Create placeholder sound files**

   ```bash
   # Create placeholder files - will be replaced with actual audio later
   mkdir -p src/assets
   touch src/assets/start.wav
   touch src/assets/stop.wav
   ```

5. **Add note about obtaining sound files**
   Create `src/assets/README.md`:

   ```markdown
   # Assets

   ## Sound Files

   ### Required Files

   - `start.wav` - Played when timer starts
   - `stop.wav` - Played when timer stops

   ### Specifications

   - Format: WAV (uncompressed, for low latency)
   - Sample rate: 44.1kHz or 48kHz
   - Duration: Short (< 1 second recommended)
   - Volume: Normalized

   ### Sources

   You can:

   1. Create custom sounds using audio software (Audacity, GarageBand, etc.)
   2. Use royalty-free sounds from:
      - https://freesound.org/
      - https://mixkit.co/free-sound-effects/
   3. Generate simple beeps using online tools

   ### Current Status

   Placeholder files exist. Replace with actual WAV files before building.
   ```

6. **Test sound service (config access only)**
   Add to main.ts temporarily:

   ```typescript
   import { SoundService } from './services/SoundService';

   app.whenReady().then(() => {
     initConfig();

     console.log('Sound enabled:', SoundService.isSoundEnabled());
     console.log('Start sound:', SoundService.getStartSound());
     console.log('Stop sound:', SoundService.getStopSound());

     initDatabase();
     createWindow();
   });
   ```

## Acceptance Criteria

- [ ] SoundService.ts created with config accessor methods
- [ ] Placeholder sound files exist in src/assets/
- [ ] Documentation explains sound implementation approach
- [ ] SoundService can read config values
- [ ] README documents where to get sound files

## Implementation Note

The actual sound playback functionality will be implemented in **Phase 6** (Task 27) in the renderer process. This task only creates the service structure and placeholders.

## Sound Playback Flow

```
Config (electron/config.ts)
  ↓
SoundService (reads config)
  ↓
IPC Bridge (exposes to renderer)
  ↓
React Hook/Component (plays sound with HTML5 Audio)
  ↓
Audio files (src/assets/*.wav)
```

## References

- project_init.md lines 26, 57, 152-156 (SoundService section)
- project_init.md lines 206-212 (Audio files section)
