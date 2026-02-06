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

## Project Structure

```
├── widget-src/
│   ├── code.tsx           # Main widget entry point
│   ├── types.ts           # TypeScript type definitions
│   ├── constants.ts       # Constants, theme colors, and icons
│   ├── utils.ts           # Utility functions
│   ├── components/        # UI components
│   │   ├── MainHeading.tsx
│   │   ├── BlockComponent.tsx
│   │   ├── CloseButton.tsx
│   │   └── index.ts
│   ├── ui.html            # CodeMirror editor HTML
│   ├── ui.tsx             # UI entry point (minimal)
│   └── tsconfig.json      # TypeScript configuration
├── dist/                  # Built files (generated)
│   ├── code.js            # Bundled widget code
│   ├── ui.js              # Bundled UI code
│   └── ui.html            # Copied UI HTML
├── manifest.json          # Figma plugin manifest
├── package.json           # Project dependencies and scripts
└── README.md              # This file
```

## Usage

1. Add the Code Editor Pro widget to your Figma canvas
2. Optionally add a header/title in the text input at the top
3. Click on the code block to open the editor
4. Write or paste your code
5. Select the programming language from the dropdown
6. Your code will be syntax-highlighted automatically
7. Close the editor - changes are saved automatically
8. Use the theme toggle in the Figma toolbar to switch between light/dark mode

## Technologies

- **Figma Widget API**: For creating the widget interface
- **TypeScript**: For type-safe development
- **esbuild**: For fast bundling
- **CodeMirror 5**: For the code editor UI (loaded from CDN)

## Code Architecture

The project follows a modular architecture:

- **Types** (`types.ts`): Centralized type definitions for better maintainability
- **Constants** (`constants.ts`): Configuration values, theme colors, and UI icons
- **Utils** (`utils.ts`): Reusable utility functions with comprehensive error handling
- **Components** (`components/`): Modular UI components for better organization
- **Main Widget** (`code.tsx`): Orchestrates state management and component composition

## Performance Optimizations

- **Debounced Updates**: Editor changes are debounced (150ms) to reduce message frequency
- **Efficient Rendering**: Only re-renders changed blocks
- **Smart Width Calculation**: Dynamically calculates minimum required width

## Error Handling

The widget includes comprehensive error handling:
- Validation of all user inputs
- Graceful degradation when CodeMirror fails to load
- User-friendly error messages
- Detailed console logging for debugging

## License

MIT

## Author

Built with ❤️ for the Figma community

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
