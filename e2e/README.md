# E2E Tests

End-to-end tests for the Timer app using Playwright.

## Setup

E2E tests for Electron apps require the built application. Before running tests:

```bash
# Build the app
npm run build:dir

# Run E2E tests (once implemented)
npm run test:e2e
```

## Current Status

Basic E2E test infrastructure is set up with:
- ✅ Playwright installed and configured
- ✅ Test directory structure created
- ⏳ Full E2E tests to be implemented

## Planned Test Coverage

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

## Limitations

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

## Future Implementation

To implement full E2E tests, create test files in the `e2e/` directory following the patterns in the task documentation (`contexts/tasks/phase7-32-create-e2e-tests.md`).
