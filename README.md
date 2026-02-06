# Code Editor Pro

![Figma Widget](https://img.shields.io/badge/Figma-Widget-0ACF83?logo=figma&logoColor=white)

A Figma widget for editing and displaying code with syntax highlighting.


![Code editor pro](assests/Code%20editor%20pro.jpg)

## Features

- 🎨 **Syntax Highlighting**: Supports multiple programming languages with color-coded syntax (JavaScript, TypeScript, Python, HTML, CSS, JSON, SQL, Markdown, XML)
- 🌓 **Theme Support**: Toggle between light and dark themes
- ✏️ **Full-Featured Code Editor**: Click to open a CodeMirror-based editor with line numbers, bracket matching, and auto-completion
- 💾 **Real-time Sync**: Changes in the editor sync back to the widget instantly with debouncing for performance
- 🎯 **Smart Width Adjustment**: Widget automatically adjusts width based on code content
- ⚡ **Performance Optimized**: Debounced updates and efficient rendering

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
4. In Figma, go to **Plugins → Development → Import plugin from manifest**
5. Select the `manifest.json` file from this project

## Development

```bash
# Build everything
npm run build

# Build widget only
npm run build:widget

# Build UI only
npm run build:ui

# Type check without building
npm run tsc

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Watch for changes (auto-rebuild)
npm run watch
```

## Usage

1. Add the Code Editor Pro widget to your Figma canvas
2. Click a code block to open the editor
3. Write or paste code and choose language
4. Close editor to sync changes automatically

## Tech Stack

- Figma Widget API
- TypeScript
- esbuild
- CodeMirror 5

## License

MIT License © Asif Ali

## Resources

- [Figma Widget Documentation](https://www.figma.com/widget-docs/)
- [Figma Widget Setup Guide](https://www.figma.com/widget-docs/setup/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Author

Created with ❤️ for Figma by Asif

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
