# Code Editor Pro

A Figma widget for editing and displaying code with syntax highlighting.

## Features

- 🎨 **Syntax Highlighting**: Supports multiple programming languages with color-coded syntax
- 🌓 **Theme Support**: Toggle between light and dark themes
- 📏 **Adjustable Width**: Switch between 360px and 480px widget widths
- ✏️ **Code Editor**: Click to open a full-featured code editor
- 💾 **Real-time Sync**: Changes in the editor sync back to the widget instantly

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the widget:
   ```bash
   npm run build
   ```
4. In Figma, go to Plugins → Development → Import plugin from manifest
5. Select the `manifest.json` file from this project

## Development

```bash
# Build the widget
npm run build

# Watch for changes (if configured)
npm run watch
```

## Project Structure

```
├── widget-src/
│   ├── code.tsx       # Main widget code
│   ├── ui.tsx         # Code editor UI
│   └── ui.html        # Code editor HTML
├── dist/              # Built files
├── manifest.json      # Figma plugin manifest
└── package.json       # Project dependencies
```

## Usage

1. Add the widget to your Figma canvas
2. Click on the code block to open the editor
3. Write or paste your code
4. Use the theme toggle to switch between light/dark mode
5. Use the width toggle to adjust the widget size

## Technologies

- **Figma Widget API**: For creating the widget interface
- **TypeScript**: For type-safe development
- **esbuild**: For fast bundling

## License

MIT

## Author

Built with ❤️ for the Figma community
