# Task 26: Implement Sound Service with HTML5 Audio Playback

**Phase:** 6 - Timer Logic & Integration
**Dependencies:** Task 13 (SoundService placeholder), Task 24 (Timer integration)

## Description

Implement sound playback in the renderer process using HTML5 Audio, playing start.wav when timer starts and stop.wav when timer stops.

## Implementation Steps

1. **Get or create audio files**
   You can:
   - Generate simple beeps using online tools
   - Use royalty-free sounds from freesound.org
   - Create in audio software (Audacity, etc.)

   Save as:
   - `src/assets/start.wav` (short, pleasant beep)
   - `src/assets/stop.wav` (different tone than start)

2. **Configure Vite to handle audio assets**
   Update `vite.config.ts`:

   ```typescript
   export default defineConfig({
     // ... existing config ...
     assetsInclude: ['**/*.wav', '**/*.mp3'],
   });
   ```

3. **Create audio hook**
   Create `src/hooks/useSound.ts`:

   ```typescript
   import { useRef, useCallback, useEffect } from 'react';

   export function useSound(soundFile: string, enabled: boolean = true) {
     const audioRef = useRef<HTMLAudioElement | null>(null);

     useEffect(() => {
       if (enabled) {
         audioRef.current = new Audio(soundFile);
       }

       return () => {
         if (audioRef.current) {
           audioRef.current.pause();
           audioRef.current = null;
         }
       };
     }, [soundFile, enabled]);

     const play = useCallback(() => {
       if (enabled && audioRef.current) {
         audioRef.current.currentTime = 0; // Reset to start
         audioRef.current.play().catch((error) => {
           console.warn('Audio playback failed:', error);
         });
       }
     }, [enabled]);

     return { play };
   }
   ```

4. **Create SoundContext for app-wide sound management**
   Create `src/contexts/SoundContext.tsx`:

   ```typescript
   import React, { createContext, useContext, useState, useEffect } from 'react';
   import { useSound } from '@/hooks/useSound';
   import startSoundFile from '@/assets/start.wav';
   import stopSoundFile from '@/assets/stop.wav';

   interface SoundContextType {
     playStartSound: () => void;
     playStopSound: () => void;
     soundEnabled: boolean;
     setSoundEnabled: (enabled: boolean) => void;
   }

   const SoundContext = createContext<SoundContextType | undefined>(undefined);

   export function SoundProvider({ children }: { children: React.ReactNode }) {
     const [soundEnabled, setSoundEnabled] = useState(true);

     // Load sound preference from config
     useEffect(() => {
       window.electron.config.get().then((config) => {
         setSoundEnabled(config.soundEnabled);
       });
     }, []);

     const startSound = useSound(startSoundFile, soundEnabled);
     const stopSound = useSound(stopSoundFile, soundEnabled);

     return (
       <SoundContext.Provider
         value={{
           playStartSound: startSound.play,
           playStopSound: stopSound.play,
           soundEnabled,
           setSoundEnabled,
         }}
       >
         {children}
       </SoundContext.Provider>
     );
   }

   export function useAppSound() {
     const context = useContext(SoundContext);
     if (context === undefined) {
       throw new Error('useAppSound must be used within a SoundProvider');
     }
     return context;
   }
   ```

5. **Wrap app with SoundProvider**
   Update `src/main.tsx`:

   ```typescript
   import { SoundProvider } from './contexts/SoundContext';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <ThemeProvider>
         <SoundProvider>
           <TimerProvider>
             <App />
           </TimerProvider>
         </SoundProvider>
       </ThemeProvider>
     </React.StrictMode>
   );
   ```

6. **Integrate sounds into timer operations**
   Update `src/features/Timer/QuickTaskEntry.tsx`:

   ```typescript
   import { useAppSound } from '@/contexts/SoundContext';

   export function QuickTaskEntry() {
     const { activeTimer, refreshTimer } = useTimer();
     const { playStartSound } = useAppSound();
     const [taskName, setTaskName] = useState('');
     const [isStarting, setIsStarting] = useState(false);

     const handleStart = async (name?: string) => {
       const taskToStart = name || taskName;
       if (!taskToStart.trim() || activeTimer) return;

       setIsStarting(true);
       try {
         const result = await window.electron.timer.start(taskToStart.trim());
         if (result !== null) {
           playStartSound(); // Play sound on success
           setTaskName('');
           await refreshTimer();
         }
       } catch (error) {
         console.error('Error starting timer:', error);
       } finally {
         setIsStarting(false);
       }
     };

     // ... rest of component
   }
   ```

7. **Add sound to timer stop**
   Update `src/features/Timer/CompactTimerView.tsx`:

   ```typescript
   import { useAppSound } from '@/contexts/SoundContext';

   export function CompactTimerView() {
     const { activeTimer, refreshTimer } = useTimer();
     const { playStopSound } = useAppSound();
     const elapsed = useElapsedTime(activeTimer?.start_time || null);

     const handleStop = async () => {
       try {
         const result = await window.electron.timer.stop();
         if (result) {
           playStopSound(); // Play sound on success
           await refreshTimer();
         }
       } catch (error) {
         console.error('Error stopping timer:', error);
       }
     };

     // ... rest of component
   }
   ```

8. **Update global shortcut to play sounds**
   Update `electron/shortcuts.ts`:

   ```typescript
   function handleShortcutPressed(): void {
     console.log('Global shortcut pressed');

     const activeTimer = TimerService.getActiveTimer();

     if (activeTimer) {
       TimerService.stopTimer();
       // Send event to renderer to play sound
       BrowserWindow.getAllWindows().forEach((win) => {
         win.webContents.send('sound:play', 'stop');
       });
     } else {
       const defaultTaskName = 'Quick Timer';
       TimerService.startTimer(defaultTaskName);
       // Send event to renderer to play sound
       BrowserWindow.getAllWindows().forEach((win) => {
         win.webContents.send('sound:play', 'start');
       });
     }

     refreshTrayDisplay();
   }
   ```

9. **Add sound event listener in SoundContext**
   Update `src/contexts/SoundContext.tsx`:

   ```typescript
   export function SoundProvider({ children }: { children: React.ReactNode }) {
     // ... existing state ...

     useEffect(() => {
       // Listen for sound events from main process
       const unsubscribe = window.electron.on('sound:play', (sound: string) => {
         if (sound === 'start') {
           startSound.play();
         } else if (sound === 'stop') {
           stopSound.play();
         }
       });

       return unsubscribe;
     }, [startSound, stopSound]);

     // ... rest of provider
   }
   ```

10. **Update preload to expose sound:play event**
    Update `electron/preload.ts`:

    ```typescript
    const validChannels = [
      'timer:updated',
      'config:updated',
      'tray:clicked',
      'sound:play', // Add this
    ];
    ```

11. **Test sound playback**

    ```bash
    npm run dev
    ```

    Test:
    - Start a timer → should hear start sound
    - Stop timer → should hear stop sound
    - Use global shortcut → should hear appropriate sound
    - Test with sound disabled in config

## Acceptance Criteria

- [ ] start.wav plays when timer starts
- [ ] stop.wav plays when timer stops
- [ ] Sounds play via global shortcut
- [ ] Sounds respect config.soundEnabled setting
- [ ] Audio files properly bundled with app
- [ ] No errors if audio fails to play
- [ ] Sounds are short and non-intrusive
- [ ] Works on macOS

## Sound Specifications

- **Format:** WAV (uncompressed)
- **Sample rate:** 44.1kHz or 48kHz
- **Duration:** 0.1-0.5 seconds (short)
- **Volume:** Moderate (not jarring)
- **Character:**
  - Start: Upward tone, encouraging
  - Stop: Downward tone, completion

## Troubleshooting

- **No sound:** Check browser console for errors
- **Sound too loud/quiet:** Edit WAV files in audio editor
- **Playback blocked:** Some browsers block autoplay, but user interaction (button click) should work
- **Build issues:** Ensure Vite config includes .wav in assetsInclude

## Alternative Sound Sources

If you don't have audio files:

1. **Generate online:**
   - https://www.beepbox.co/
   - https://www.bfxr.net/

2. **Use system sounds (fallback):**
   ```typescript
   // Fallback if WAV not available
   const beep = () => {
     const audioContext = new AudioContext();
     const oscillator = audioContext.createOscillator();
     oscillator.frequency.value = 800;
     oscillator.connect(audioContext.destination);
     oscillator.start();
     oscillator.stop(audioContext.currentTime + 0.1);
   };
   ```

## References

- project_init.md lines 57, 152-156 (SoundService requirements)
- project_init.md lines 206-212 (Audio files section)
