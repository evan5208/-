# 老驴 Application Icons

This directory contains the application icons for all supported platforms.

## Required Files

| File | Platform | Description |
|------|----------|-------------|
| `icon-source.png` | Source | Master source image for all generated app icons |
| `icon.icns` | macOS | Apple Icon Image format |
| `icon.ico` | Windows | Windows ICO format |
| `icon.png` | All | 512x512 PNG fallback |
| `16x16.png` - `512x512.png` | Linux | PNG set for Linux |
| `32x32.png` | Tray | Branded tray icon source used by the app |

## Generating Icons

### Using the Script

```bash
node scripts/generate-icons.mjs
```

### Prerequisites

**macOS:**
```bash
brew install imagemagick librsvg
```

**Linux:**
```bash
apt install imagemagick librsvg2-bin
```

**Windows:**
Install ImageMagick from https://imagemagick.org/

## Design Guidelines

### Application Icon
- **Corner Radius**: ~20% of width (200px on 1024px canvas)
- **Foreground**: Donkey mascot illustration centered within the rounded square
- **Safe Area**: Keep 10% margin from edges

### macOS Tray Icon
- **Format**: 32x32 PNG generated from the main brand image
- **Design**: Keep the same mascot and warm orange palette as the main app icon
- **Usage**: The app currently loads `32x32.png` directly for the tray icon

## Updating the Icon

1. Replace or update `icon-source.png`
2. Run `node scripts/generate-icons.mjs`
3. Verify `icon.icns`, `icon.ico`, `icon.png`, and size variants look correct
4. Commit all generated files
