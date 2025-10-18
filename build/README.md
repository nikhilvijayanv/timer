# Build Assets

This directory contains assets needed for building the application with electron-builder.

## Icon File

Place the app icon at `build/icon.icns` for macOS builds.

The icon should be created from a 1024x1024 PNG image and converted to .icns format using tools like:
- iconutil (macOS built-in)
- png2icons
- Online converters

Until a proper icon is created, the build will use Electron's default icon.
