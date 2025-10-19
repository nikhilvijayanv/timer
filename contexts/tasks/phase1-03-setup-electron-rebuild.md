# Task 03: Configure electron-rebuild for better-sqlite3

**Phase:** 1 - Project Setup & Infrastructure
**Dependencies:** Task 02 (Vite configuration)

## Description

Set up electron-rebuild to properly compile native Node modules (specifically better-sqlite3) for the Electron runtime.

## Implementation Steps

1. **Install better-sqlite3 and rebuild tools**

   ```bash
   npm install better-sqlite3
   npm install --save-dev electron-rebuild @electron/rebuild
   ```

2. **Add postinstall script to package.json**

   ```json
   {
     "scripts": {
       "postinstall": "electron-rebuild -f -w better-sqlite3"
     }
   }
   ```

3. **Run postinstall manually to test**

   ```bash
   npm run postinstall
   ```

   Should see output about rebuilding better-sqlite3 for Electron

4. **Update vite.config.ts to externalize native modules**
   In the electron plugin config, ensure better-sqlite3 is external:

   ```typescript
   rollupOptions: {
     external: ['electron', 'better-sqlite3'];
   }
   ```

5. **Create test file to verify better-sqlite3 works**
   Create `electron/test-db.ts`:

   ```typescript
   import Database from 'better-sqlite3';
   import path from 'path';
   import { app } from 'electron';

   export function testDatabase() {
     const dbPath = path.join(app.getPath('userData'), 'test.db');
     const db = new Database(dbPath);

     db.exec(`
       CREATE TABLE IF NOT EXISTS test (
         id INTEGER PRIMARY KEY,
         value TEXT
       )
     `);

     const insert = db.prepare('INSERT INTO test (value) VALUES (?)');
     insert.run('Hello from better-sqlite3!');

     const rows = db.prepare('SELECT * FROM test').all();
     console.log('Database test successful:', rows);

     db.close();
   }
   ```

6. **Call testDatabase from main.ts**
   Add to electron/main.ts after imports:

   ```typescript
   import { testDatabase } from './test-db';

   app.whenReady().then(() => {
     testDatabase();
     createWindow();
   });
   ```

7. **Test in development**
   ```bash
   npm run dev
   ```
   Check console for "Database test successful" message

## Acceptance Criteria

- [ ] better-sqlite3 installed and rebuilt for Electron
- [ ] postinstall script runs successfully
- [ ] Test database operations work in Electron
- [ ] No native module errors when running `npm run dev`
- [ ] better-sqlite3 properly externalized in Vite config

## References

- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
- [electron-rebuild](https://github.com/electron/rebuild)
- project_init.md lines 10, 93-100
