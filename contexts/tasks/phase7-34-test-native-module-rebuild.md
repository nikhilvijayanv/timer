# Task 34: Test Native Module Rebuild and Production Build

**Phase:** 7 - Testing, Build & Polish
**Dependencies:** Task 33 (Production build configured)

## Description
Verify that native modules (better-sqlite3) rebuild correctly for Electron and work in both development and production builds.

## Implementation Steps

1. **Verify postinstall script**
   Check `package.json`:
   ```json
   {
     "scripts": {
       "postinstall": "electron-rebuild -f -w better-sqlite3"
     }
   }
   ```

2. **Test clean install**
   ```bash
   # Remove everything
   rm -rf node_modules dist dist-electron

   # Fresh install (should trigger postinstall)
   npm install
   ```

   Verify output shows:
   ```
   > postinstall
   > electron-rebuild -f -w better-sqlite3

   ✔ Rebuild Complete
   ```

3. **Test in development mode**
   ```bash
   npm run dev
   ```

   Verify:
   - App launches without errors
   - Can create database entries (start/stop timer)
   - No native module errors in console
   - Check console for "Database initialized"

4. **Test development database**
   ```bash
   # Start app
   npm run dev

   # Create some test data
   # - Start/stop a few timers
   # - Create some tasks

   # Check database file exists
   ls -lh ~/Library/Application\ Support/Electron/timer.db

   # Verify database can be read
   sqlite3 ~/Library/Application\ Support/Electron/timer.db "SELECT * FROM tasks;"
   ```

5. **Build for production**
   ```bash
   npm run build:dir
   ```

   Check build output for any native module warnings

6. **Test production build**
   ```bash
   # Launch built app
   open release/mac/Timer.app

   # Or from command line
   release/mac/Timer.app/Contents/MacOS/Timer
   ```

   Verify:
   - App launches
   - Menu bar icon appears
   - Can start/stop timers
   - Database operations work
   - No errors in Console.app

7. **Check native module in production bundle**
   ```bash
   # List better-sqlite3 in bundle
   find release/mac/Timer.app -name "*better_sqlite3*"
   ```

   Should find:
   - `better_sqlite3.node` (native module)

8. **Test on different macOS version (if possible)**
   Test on:
   - macOS 11 (Big Sur) - minimum supported
   - macOS 12 (Monterey)
   - macOS 13 (Ventura)
   - macOS 14 (Sonoma)
   - macOS 15 (Sequoia)

9. **Test Intel vs Apple Silicon**
   If you have access to both architectures:

   **Intel build:**
   ```bash
   electron-builder --mac --x64
   ```

   **Apple Silicon build:**
   ```bash
   electron-builder --mac --arm64
   ```

   **Universal build:**
   ```bash
   npm run build:universal
   ```

10. **Create native module test script**
    Create `scripts/test-native-modules.js`:
    ```javascript
    const Database = require('better-sqlite3');
    const path = require('path');
    const os = require('os');

    console.log('Testing better-sqlite3 native module...');
    console.log('Platform:', process.platform);
    console.log('Arch:', process.arch);
    console.log('Electron:', process.versions.electron);
    console.log('Node:', process.versions.node);

    try {
      // Create in-memory database
      const db = new Database(':memory:');

      // Create test table
      db.exec(`
        CREATE TABLE test (
          id INTEGER PRIMARY KEY,
          value TEXT
        )
      `);

      // Insert test data
      const insert = db.prepare('INSERT INTO test (value) VALUES (?)');
      insert.run('Hello from better-sqlite3!');

      // Query data
      const rows = db.prepare('SELECT * FROM test').all();
      console.log('Query result:', rows);

      db.close();

      console.log('✓ better-sqlite3 is working correctly!');
      process.exit(0);
    } catch (error) {
      console.error('✗ better-sqlite3 failed:', error);
      process.exit(1);
    }
    ```

    Run with:
    ```bash
    node scripts/test-native-modules.js
    ```

11. **Document troubleshooting**
    Create `docs/TROUBLESHOOTING.md`:
    ```markdown
    # Troubleshooting

    ## Native Module Issues

    ### Error: "Cannot find module 'better-sqlite3'"
    **Solution:**
    ```bash
    npm install
    npm run postinstall
    ```

    ### Error: "Module did not self-register"
    **Cause:** Native module built for wrong Electron version

    **Solution:**
    ```bash
    npm rebuild better-sqlite3
    # or
    npm run postinstall
    ```

    ### Error: "dlopen failed" or "dyld error"
    **Cause:** Architecture mismatch (Intel vs ARM)

    **Solution:**
    ```bash
    rm -rf node_modules
    npm install
    ```

    ### Development works but production fails
    **Solution:**
    1. Check Vite config externalizes better-sqlite3
    2. Ensure postinstall runs during build
    3. Verify native module in bundle: `find release -name "*.node"`

    ### Different Electron/Node versions
    **Solution:**
    Update electron-rebuild:
    ```bash
    npx electron-rebuild -f -w better-sqlite3
    ```

    ## Build Issues

    ### App won't open on other Macs
    **Cause:** Code signing required for distribution

    **Solution:**
    - Get Developer ID certificate
    - Sign and notarize app
    - Or: Right-click > Open (bypass Gatekeeper once)

    ### Database errors in production
    **Check:**
    1. Database path accessible
    2. Write permissions
    3. SQLite version compatible

    ### Missing icons
    **Solution:**
    Ensure `build/icon.icns` exists and is referenced in package.json

    ## Performance Issues

    ### High CPU usage
    **Check:**
    1. Tray update interval (should be 1 second)
    2. React re-renders (use React DevTools)
    3. Background processes

    ### Slow database queries
    **Solution:**
    1. Check indexes exist (see Task 10)
    2. Use EXPLAIN QUERY PLAN
    3. Optimize queries
    ```

## Acceptance Criteria
- [ ] postinstall script runs successfully
- [ ] better-sqlite3 works in development
- [ ] better-sqlite3 works in production build
- [ ] Native module included in app bundle
- [ ] Works on different macOS versions
- [ ] Works on both Intel and Apple Silicon (if tested)
- [ ] Database operations fast and reliable
- [ ] No native module errors

## Testing Checklist
- [ ] Clean install: `rm -rf node_modules && npm install`
- [ ] Development: `npm run dev` works
- [ ] Directory build: `npm run build:dir` works
- [ ] DMG build: `npm run build:mac` works
- [ ] Production app launches and runs
- [ ] Database operations in production
- [ ] Test on fresh Mac (if possible)

## Native Module Verification
```bash
# Check what's using better-sqlite3
lsof | grep better_sqlite3

# Check native module architecture
file node_modules/better-sqlite3/build/Release/better_sqlite3.node

# Output should show:
# Mach-O 64-bit bundle x86_64 (Intel)
# or
# Mach-O 64-bit bundle arm64 (Apple Silicon)
```

## Common Issues
1. **Module not rebuilt:** Run `npm run postinstall`
2. **Wrong architecture:** Rebuild on target architecture
3. **Electron version mismatch:** Check electron version in package.json
4. **Missing in bundle:** Check Vite externals config

## References
- project_init.md lines 93-100 (Native module requirements)
- project_init.md line 230 (Test native module rebuild)
