# Task 05: Configure electron-builder for macOS

**Phase:** 1 - Project Setup & Infrastructure
**Dependencies:** Task 01, 02 (Project initialized and Vite configured)

## Description
Set up electron-builder to package the app as a macOS .dmg installer, with proper configuration for a menu bar application.

## Implementation Steps

1. **Ensure electron-builder is installed**
   ```bash
   npm install --save-dev electron-builder
   ```

2. **Create build/ directory for assets**
   ```bash
   mkdir build
   ```

3. **Add electron-builder configuration to package.json**
   ```json
   {
     "build": {
       "appId": "com.timer.menubar",
       "productName": "Timer",
       "directories": {
         "output": "release"
       },
       "files": [
         "dist/**/*",
         "dist-electron/**/*",
         "package.json"
       ],
       "mac": {
         "target": ["dmg"],
         "category": "public.app-category.productivity",
         "icon": "build/icon.icns",
         "type": "distribution"
       },
       "dmg": {
         "title": "Timer Installer",
         "icon": "build/icon.icns"
       },
       "extraMetadata": {
         "main": "dist-electron/main.js"
       }
     }
   }
   ```

4. **Update build scripts in package.json**
   ```json
   {
     "scripts": {
       "build": "tsc && vite build && electron-builder",
       "build:mac": "tsc && vite build && electron-builder --mac",
       "build:dir": "tsc && vite build && electron-builder --dir"
     }
   }
   ```

5. **Create placeholder icon file**
   ```bash
   # Note: Will need actual .icns file later
   # For now, document where it should go
   echo "Place app icon at build/icon.icns" > build/README.md
   ```

6. **Update .gitignore**
   Add build output directories:
   ```
   release/
   ```

7. **Test directory build (faster than full DMG)**
   ```bash
   npm run build:dir
   ```
   Should create `release/mac/Timer.app`

## Acceptance Criteria
- [ ] electron-builder configured in package.json
- [ ] Build scripts added: `build`, `build:mac`, `build:dir`
- [ ] macOS-specific settings configured (category, DMG)
- [ ] Test build succeeds and creates .app bundle
- [ ] release/ directory in .gitignore

## Notes
- Universal binary (Intel + Apple Silicon) can be added later with `"target": ["dmg", "zip"]` and `"arch": ["x64", "arm64"]`
- Icon file (build/icon.icns) will need to be created from a 1024x1024 PNG
- Code signing can be added later if needed for distribution

## References
- [electron-builder Documentation](https://www.electron.build/)
- project_init.md lines 168-225 (macOS Build section)
