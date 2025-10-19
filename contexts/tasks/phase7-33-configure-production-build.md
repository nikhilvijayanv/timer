# Task 33: Configure electron-builder for macOS Production Build

**Phase:** 7 - Testing, Build & Polish
**Dependencies:** Task 05 (electron-builder initial config)

## Description

Finalize electron-builder configuration for production-ready macOS builds, including proper app metadata, icons, and DMG creation.

## Implementation Steps

1. **Update package.json with app metadata**

   ```json
   {
     "name": "timer",
     "productName": "Timer",
     "version": "1.0.0",
     "description": "macOS menu bar timer app for tracking billable hours",
     "author": {
       "name": "Your Name",
       "email": "your.email@example.com"
     },
     "license": "MIT",
     "repository": {
       "type": "git",
       "url": "https://github.com/yourusername/timer.git"
     },
     "main": "dist-electron/main.js"
   }
   ```

2. **Update electron-builder configuration**

   ```json
   {
     "build": {
       "appId": "com.yourdomain.timer",
       "productName": "Timer",
       "copyright": "Copyright © 2025 Your Name",
       "directories": {
         "output": "release",
         "buildResources": "build"
       },
       "files": ["dist/**/*", "dist-electron/**/*", "package.json"],
       "mac": {
         "target": [
           {
             "target": "dmg",
             "arch": ["x64", "arm64"]
           }
         ],
         "category": "public.app-category.productivity",
         "icon": "build/icon.icns",
         "type": "distribution",
         "hardenedRuntime": true,
         "gatekeeperAssess": false,
         "entitlements": "build/entitlements.mac.plist",
         "entitlementsInherit": "build/entitlements.mac.plist",
         "minimumSystemVersion": "10.15.0"
       },
       "dmg": {
         "title": "${productName} ${version}",
         "icon": "build/icon.icns",
         "background": "build/dmg-background.png",
         "contents": [
           {
             "x": 130,
             "y": 220
           },
           {
             "x": 410,
             "y": 220,
             "type": "link",
             "path": "/Applications"
           }
         ],
         "window": {
           "width": 540,
           "height": 400
         }
       },
       "extraMetadata": {
         "main": "dist-electron/main.js"
       }
     }
   }
   ```

3. **Create entitlements file for macOS**
   Create `build/entitlements.mac.plist`:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
     <dict>
       <key>com.apple.security.cs.allow-jit</key>
       <true/>
       <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
       <true/>
       <key>com.apple.security.cs.debugger</key>
       <true/>
       <key>com.apple.security.cs.disable-library-validation</key>
       <true/>
     </dict>
   </plist>
   ```

4. **Create app icon**
   Create a 1024x1024 PNG icon, then convert to .icns:

   ```bash
   # Install iconutil (comes with Xcode)
   # Or use online converter: https://cloudconvert.com/png-to-icns

   # Create icon set
   mkdir icon.iconset
   sips -z 16 16     icon-1024.png --out icon.iconset/icon_16x16.png
   sips -z 32 32     icon-1024.png --out icon.iconset/icon_16x16@2x.png
   sips -z 32 32     icon-1024.png --out icon.iconset/icon_32x32.png
   sips -z 64 64     icon-1024.png --out icon.iconset/icon_32x32@2x.png
   sips -z 128 128   icon-1024.png --out icon.iconset/icon_128x128.png
   sips -z 256 256   icon-1024.png --out icon.iconset/icon_128x128@2x.png
   sips -z 256 256   icon-1024.png --out icon.iconset/icon_256x256.png
   sips -z 512 512   icon-1024.png --out icon.iconset/icon_256x256@2x.png
   sips -z 512 512   icon-1024.png --out icon.iconset/icon_512x512.png
   sips -z 1024 1024 icon-1024.png --out icon.iconset/icon_512x512@2x.png

   # Convert to icns
   iconutil -c icns icon.iconset -o build/icon.icns
   ```

   Or use an online tool:
   - Upload 1024x1024 PNG to https://cloudconvert.com/png-to-icns
   - Download and save to `build/icon.icns`

5. **Create tray icon (template)**
   Create `build/iconTemplate.png` and `build/iconTemplate@2x.png`:
   - 16x16 for 1x
   - 32x32 for 2x
   - Simple, monochrome design
   - Black on transparent background

6. **Create DMG background (optional)**
   Create `build/dmg-background.png`:
   - 540x400 pixels
   - Simple branded background for DMG installer

7. **Update build scripts**

   ```json
   {
     "scripts": {
       "prebuild": "npm run lint && npm run test:run",
       "build": "npm run prebuild && tsc && vite build && electron-builder",
       "build:mac": "npm run prebuild && tsc && vite build && electron-builder --mac",
       "build:dir": "npm run prebuild && tsc && vite build && electron-builder --dir",
       "build:universal": "npm run prebuild && tsc && vite build && electron-builder --mac --x64 --arm64"
     }
   }
   ```

8. **Test directory build (faster)**

   ```bash
   npm run build:dir
   ```

   Verify:
   - App launches from `release/mac/Timer.app`
   - Menu bar icon appears
   - All features work
   - No console errors

9. **Build DMG for distribution**

   ```bash
   npm run build:mac
   ```

   This creates:
   - `release/Timer-1.0.0.dmg` (Intel)
   - `release/Timer-1.0.0-arm64.dmg` (Apple Silicon)

   Or universal:

   ```bash
   npm run build:universal
   ```

   Creates: `release/Timer-1.0.0-universal.dmg`

10. **Test DMG installer**
    - Mount the DMG
    - Drag app to Applications
    - Launch from Applications
    - Verify all functionality works

11. **Document build process**
    Create `docs/BUILD.md`:

    ````markdown
    # Build Instructions

    ## Prerequisites

    - Node.js 20.19+ or 22.12+
    - macOS (for macOS builds)
    - Xcode Command Line Tools

    ## Development Build

    ```bash
    npm install
    npm run dev
    ```
    ````

    ## Production Build

    ### Quick Directory Build (Testing)

    ```bash
    npm run build:dir
    ```

    Output: `release/mac/Timer.app`

    ### DMG Build (Distribution)

    ```bash
    npm run build:mac
    ```

    Output: `release/Timer-1.0.0.dmg`

    ### Universal Binary (Intel + Apple Silicon)

    ```bash
    npm run build:universal
    ```

    Output: `release/Timer-1.0.0-universal.dmg`

    ## Build Output
    - `release/Timer-1.0.0.dmg` - DMG installer
    - `release/mac/Timer.app` - macOS app bundle
    - `release/latest-mac.yml` - Update metadata

    ## Code Signing (Optional)

    For distribution outside the App Store, you need:
    1. Apple Developer account
    2. Developer ID certificate
    3. Update build config with signing identity

    ## Troubleshooting
    - **Build fails:** Check Node.js version, run `npm install`
    - **App won't open:** Check Gatekeeper settings
    - **Native module errors:** Run `npm run postinstall`

    ```

    ```

## Acceptance Criteria

- [ ] App metadata complete
- [ ] Icons created and configured
- [ ] electron-builder config finalized
- [ ] Directory build works
- [ ] DMG build succeeds
- [ ] Built app launches and works correctly
- [ ] No missing dependencies
- [ ] Proper app identity and branding

## Build Outputs

```
release/
├── Timer-1.0.0.dmg              # DMG installer (Intel)
├── Timer-1.0.0-arm64.dmg        # DMG installer (Apple Silicon)
├── Timer-1.0.0-universal.dmg    # Universal binary
├── mac/
│   └── Timer.app                # App bundle
└── latest-mac.yml               # Auto-update metadata
```

## App Size Targets

- **.app bundle:** ~200-300MB
- **DMG:** ~100-150MB (compressed)

## Code Signing (Future)

To distribute outside App Store:

1. Get Developer ID certificate
2. Add to build config:
   ```json
   "mac": {
     "identity": "Developer ID Application: Your Name (TEAM_ID)"
   }
   ```
3. Notarize with Apple

## References

- [electron-builder Documentation](https://www.electron.build/)
- project_init.md lines 168-225 (macOS Build section)
