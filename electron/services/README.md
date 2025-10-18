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
