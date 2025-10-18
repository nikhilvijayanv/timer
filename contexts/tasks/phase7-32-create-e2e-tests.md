# Task 32: Create E2E Tests with Playwright

**Phase:** 7 - Testing, Build & Polish
**Dependencies:** Task 29 (Integration testing complete)

## Description
Create basic end-to-end tests using Playwright to verify the timer flow works correctly in the actual Electron app.

## Implementation Steps

1. **Install Playwright**
   ```bash
   npm install --save-dev @playwright/test
   npm install --save-dev playwright-electron
   ```

2. **Create Playwright config**
   Create `playwright.config.ts`:
   ```typescript
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './e2e',
     timeout: 30000,
     fullyParallel: false,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     workers: 1, // Electron tests should run sequentially
     reporter: 'html',
     use: {
       trace: 'on-first-retry',
       screenshot: 'only-on-failure',
     },
   });
   ```

3. **Create E2E test directory structure**
   ```bash
   mkdir -p e2e
   ```

4. **Create E2E test helper**
   Create `e2e/helpers.ts`:
   ```typescript
   import { _electron as electron, ElectronApplication, Page } from 'playwright';
   import path from 'path';

   export async function launchElectronApp(): Promise<{
     app: ElectronApplication;
     page: Page;
   }> {
     // Launch Electron app
     const app = await electron.launch({
       args: [path.join(__dirname, '../dist-electron/main.js')],
       env: {
         ...process.env,
         NODE_ENV: 'test',
       },
     });

     // Wait for window
     const page = await app.firstWindow();

     // Wait for app to be ready
     await page.waitForLoadState('domcontentloaded');

     return { app, page };
   }

   export async function cleanDatabase(page: Page) {
     // Clear database via IPC
     await page.evaluate(() => {
       // This would need an IPC method to clear the database
       // For now, tests should use a separate test database
     });
   }
   ```

5. **Create timer flow E2E test**
   Create `e2e/timer-flow.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';
   import { launchElectronApp } from './helpers';
   import { ElectronApplication, Page } from 'playwright';

   let app: ElectronApplication;
   let page: Page;

   test.beforeAll(async () => {
     const launched = await launchElectronApp();
     app = launched.app;
     page = launched.page;
   });

   test.afterAll(async () => {
     await app.close();
   });

   test.describe('Timer Flow', () => {
     test('should start and stop a timer', async () => {
       // Wait for app to load
       await page.waitForSelector('input[placeholder*="working on"]', { timeout: 10000 });

       // Enter task name
       const input = page.locator('input[placeholder*="working on"]');
       await input.fill('E2E Test Task');

       // Click Start button
       const startButton = page.locator('button:has-text("Start")');
       await startButton.click();

       // Wait for CompactTimerView to appear
       await page.waitForSelector('text=E2E Test Task', { timeout: 5000 });

       // Verify timer is running
       const timerDisplay = page.locator('.tabular-nums');
       await expect(timerDisplay).toBeVisible();

       // Wait for 2 seconds
       await page.waitForTimeout(2000);

       // Verify time has incremented (should show at least 0:01 or 0:02)
       const timeText = await timerDisplay.textContent();
       expect(timeText).toMatch(/0:0[1-9]|0:[1-5][0-9]/);

       // Click stop button
       const stopButton = page.locator('button:has([class*="Square"])');
       await stopButton.click();

       // Verify timer stopped (QuickTaskEntry should reappear)
       await page.waitForSelector('input[placeholder*="working on"]', { timeout: 5000 });

       // Verify entry appears in TodayEntries
       await expect(page.locator('text=E2E Test Task')).toBeVisible();
     });

     test('should switch between tabs', async () => {
       // Click Tasks tab
       await page.click('button:has-text("Tasks")');
       await expect(page.locator('h2:has-text("Tasks")')).toBeVisible();

       // Click Timer tab
       await page.click('button:has-text("Timer")');
       await expect(page.locator('input[placeholder*="working on"]')).toBeVisible();
     });

     test('should open settings dialog', async () => {
       // Click settings button (has Settings icon)
       const settingsButton = page.locator('button:has([class*="Settings"])').first();
       await settingsButton.click();

       // Verify settings dialog opens
       await expect(page.locator('text=Settings')).toBeVisible();
       await expect(page.locator('text=Theme')).toBeVisible();

       // Close dialog (click Cancel)
       await page.click('button:has-text("Cancel")');
     });
   });
   ```

6. **Create separate test for global shortcut** Create `e2e/shortcuts.spec.ts`:
   ```typescript
   import { test, expect } from '@playwright/test';
   import { launchElectronApp } from './helpers';
   import { ElectronApplication, Page } from 'playwright';

   let app: ElectronApplication;
   let page: Page;

   test.beforeAll(async () => {
     const launched = await launchElectronApp();
     app = launched.app;
     page = launched.page;
   });

   test.afterAll(async () => {
     await app.close();
   });

   test.describe('Global Shortcuts', () => {
     test.skip('should toggle timer with global shortcut', async () => {
       // This test is skipped because global shortcuts are hard to test in headless mode
       // Requires OS-level keyboard simulation

       // Press global shortcut (Cmd+Alt+Shift+.)
       await page.keyboard.press('Meta+Alt+Shift+Period');

       // Verify timer started
       await page.waitForSelector('text=Quick Timer', { timeout: 5000 });

       // Press again to stop
       await page.keyboard.press('Meta+Alt+Shift+Period');

       // Verify timer stopped
       await page.waitForSelector('input[placeholder*="working on"]', { timeout: 5000 });
     });
   });
   ```

7. **Add E2E test script to package.json**
   ```json
   {
     "scripts": {
       "test:e2e": "playwright test",
       "test:e2e:ui": "playwright test --ui",
       "test:e2e:debug": "playwright test --debug"
     }
   }
   ```

8. **Build app before running E2E tests**
   ```bash
   npm run build
   npm run test:e2e
   ```

9. **Create E2E test documentation**
   Create `e2e/README.md`:
   ```markdown
   # E2E Tests

   End-to-end tests for the Timer app using Playwright.

   ## Running Tests

   ```bash
   # Build app first
   npm run build

   # Run E2E tests
   npm run test:e2e

   # Run with UI
   npm run test:e2e:ui

   # Debug mode
   npm run test:e2e:debug
   ```

   ## Test Coverage

   - **timer-flow.spec.ts:** Core timer start/stop functionality
   - **shortcuts.spec.ts:** Global keyboard shortcuts (mostly skipped - hard to test)

   ## Limitations

   - Global shortcuts are difficult to test in headless mode
   - Tests require a built version of the app
   - Tests run sequentially (Electron limitation)

   ## Future Tests

   - Task management flow
   - Settings persistence
   - Tray icon interactions (not testable with Playwright)
   - Window hide/show behavior
   ```

## Acceptance Criteria
- [ ] Playwright installed and configured
- [ ] Basic timer flow test passes
- [ ] Tab switching test passes
- [ ] Settings dialog test passes
- [ ] Tests run on built version of app
- [ ] Test reports generated

## Test Scenarios Covered
1. **Timer Flow:**
   - Start timer with task name
   - Verify timer counting
   - Stop timer
   - Verify entry in list

2. **Navigation:**
   - Switch between tabs
   - Verify correct views load

3. **Settings:**
   - Open settings dialog
   - Verify settings displayed

## Known Limitations
- **Global shortcuts:** Hard to test in headless mode
- **Tray interactions:** Not testable with Playwright
- **System notifications:** Not testable
- **Menu bar behavior:** Limited testing capability

## Manual Testing Still Required
- Global shortcut functionality
- Tray icon click behavior
- Window positioning
- macOS-specific behavior
- Multi-display scenarios

## References
- [Playwright Electron](https://playwright.dev/docs/api/class-electron)
- project_init.md line 228 (Playwright test for timer flow)
