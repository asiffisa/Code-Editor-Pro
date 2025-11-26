/**
 * ===================================
 * SECTION 1: IMPORTS & CONFIGURATION
 * ===================================
 */
const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Input, Text: WidgetText, SVG, useEffect } = widget;

/**
 * ===================================
 * SECTION 2: TYPE DEFINITIONS
 * ===================================
 */

// Types
type BlockType = 'code';

interface HighlightedToken {
  text: string;
  type: string; // Token type for theme-aware coloring
}

interface Block {
  id: string;
  type: BlockType;
  content: string;
  language?: string;
  highlightedLines?: HighlightedToken[][];
}


/**
 * ===================================
 * SECTION 4: UTILITY FUNCTIONS
 * ===================================
 */

// Generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function escapeXML(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}



function calculateRequiredWidth(blocks: Block[]): number {
  let maxLineWidth = 0;

  blocks.forEach(block => {
    if (block.type === 'code' && block.highlightedLines) {
      block.highlightedLines.forEach(line => {
        const lineLength = line.reduce((acc, token) => acc + token.text.length, 0);
        const lineWidth = lineLength * CONSTANTS.LAYOUT.CODE_CHAR_WIDTH;
        if (lineWidth > maxLineWidth) {
          maxLineWidth = lineWidth;
        }
      });
    }
  });

  // Total padding: 24px (Root) + 24px (Block) = 48px
  const totalPadding = 48;
  const requiredWidth = maxLineWidth + totalPadding;

  return Math.max(CONSTANTS.LAYOUT.MIN_WIDTH, requiredWidth);
}

/**
 * ===================================
 * SECTION 3: CONSTANTS & THEME
 * ===================================
 */


// Constants
const CONSTANTS = {
  LAYOUT: {
    MIN_WIDTH: 400,
    BLOCK_PADDING: 24,
    CODE_CHAR_WIDTH: 8.55,
  },
  FONTS: {
    HEADING: 'Inter',
    CODE: 'Source Code Pro',
    TEXT: 'Inter',
  },
  SIZES: {
    HEADING: 16,
    CODE: 14,
    TEXT: 14,
    SMALL: 10,
  },
} as const;

// Icons
const ICONS = {
  lightTheme: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 1.33333V2.66667M8 13.3333V14.6667M14.6667 8H13.3333M2.66667 8H1.33333M12.7133 3.28667L11.7733 4.22667M4.22667 11.7733L3.28667 12.7133M12.7133 12.7133L11.7733 11.7733M4.22667 4.22667L3.28667 3.28667M10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8Z" stroke="#98B3B5" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  darkTheme: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.8867 10.5133C13.7867 10.5267 13.6867 10.5333 13.58 10.5333C10.82 10.5333 8.58 8.29333 8.58 5.53333C8.58 4.34667 9.00667 3.25333 9.72 2.4C9.28 2.22667 8.8 2.13333 8.29333 2.13333C5.05333 2.13333 2.42667 4.76 2.42667 8C2.42667 11.24 5.05333 13.8667 8.29333 13.8667C11.16 13.8667 13.5467 11.8267 14.0867 9.12C14.06 9.12 14.0267 9.12 14 9.12C13.96 9.12 13.9267 9.12 13.8867 10.5133Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
};

// Theme colors for UI elements
const themeColors = {
  dark: {
    widgetBg: '#000000',
    blockBg: '#1F1F1F',
    textPrimary: '#FFFFFF',
    textSecondary: '#505050',
  },
  light: {
    widgetBg: '#B8D9DC',
    blockBg: '#D4E8EA',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B8285',
  }
};

// Syntax highlighting color mappings
const syntaxColors = {
  dark: {
    'keyword': '#569CD6',
    'atom': '#CE9178',
    'number': '#B5CEA8',
    'def': '#DCDCAA',
    'variable': '#9CDCFE',
    'variable-2': '#9CDCFE',
    'variable-3': '#4EC9B0',
    'property': '#9CDCFE',
    'operator': '#D4D4D4',
    'comment': '#6A9955',
    'string': '#CE9178',
    'string-2': '#CE9178',
    'meta': '#C586C0',
    'builtin': '#4EC9B0',
    'tag': '#569CD6',
    'attribute': '#9CDCFE',
    'header': '#569CD6',
    'quote': '#6A9955',
    'link': '#569CD6',
    'qualifier': '#DCDCAA',
    'type': '#4EC9B0',
    'default': '#D4D4D4'
  },
  light: {
    'keyword': '#7F0055',
    'atom': '#0000FF',
    'number': '#0000FF',
    'def': '#000000',
    'variable': '#000000',
    'variable-2': '#0000FF',
    'variable-3': '#0000FF',
    'property': '#000000',
    'operator': '#000000',
    'comment': '#3F7F5F',
    'string': '#2A00FF',
    'string-2': '#2A00FF',
    'meta': '#7F7F9F',
    'builtin': '#7F0055',
    'tag': '#3F7F7F',
    'attribute': '#7F007F',
    'header': '#7F0055',
    'quote': '#000000',
    'link': '#0000FF',
    'qualifier': '#7F0055',
    'type': '#000000',
    'default': '#000000'
  }
};


/**
 * ===================================
 * SECTION 5: MAIN WIDGET
 * ===================================
 */

/**
 * Main Widget Component
 * Manages the state and layout of the Code Editor Pro widget.
 */
function CodeEditorProWidget() {
  const [mainHeading, setMainHeading] = useSyncedState<string>('mainHeading', '');
  const [blocks, setBlocks] = useSyncedState<Block[]>('blocks', [
    {
      id: 'initial-block',
      type: 'code',
      content: '',
      language: 'javascript',
    },
  ]);
  const [focusedBlockId, setFocusedBlockId] = useSyncedState<string | null>('focusedBlockId', 'initial-block');
  const [theme, setTheme] = useSyncedState<'dark' | 'light'>('theme', 'dark');

  // Property Menu for native Figma toolbar
  usePropertyMenu(
    [
      {
        itemType: 'action' as const,
        tooltip: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
        propertyName: 'toggle-theme',
        icon: theme === 'dark' ? ICONS.lightTheme : ICONS.darkTheme,
      },
    ],
    ({ propertyName }) => {
      if (propertyName === 'toggle-theme') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }
    }
  );

  // Handle block deletion
  const deleteBlock = (blockId: string) => {
    if (focusedBlockId === blockId) {
      setFocusedBlockId(null);
    }
    const newBlocks = blocks.filter((b) => b.id !== blockId);
    setBlocks(newBlocks);
  };

  // Update block content
  const updateBlockContent = (blockId: string, content: string, highlightedLines?: HighlightedToken[][]) => {
    setBlocks(blocks.map((b) => b.id === blockId ? { ...b, content, highlightedLines } : b));
  };

  // Handle messages from UI
  useEffect(() => {
    figma.ui.onmessage = (msg) => {
      try {
        console.log('Widget received message:', msg);
        if (msg.type === 'UPDATE_CODE') {
          const { code, highlightedLines } = msg;
          console.log('Updating code for block:', focusedBlockId, 'Code length:', code?.length);
          if (focusedBlockId) {
            updateBlockContent(focusedBlockId, code, highlightedLines);
          }
        } else if (msg.type === 'UPDATE_LANGUAGE') {
          const { language, highlightedLines } = msg;
          if (focusedBlockId) {
            setBlocks((prev) =>
              prev.map((b) => (b.id === focusedBlockId ? { ...b, language, highlightedLines } : b))
            );
          }
        }
      } catch (error) {
        console.error('Error handling UI message:', error);
        figma.notify('An error occurred while updating the code.');
      }
    };
  });

  const openCodeEditor = (blockId: string, content: string, language: string = 'javascript') => {
    return new Promise<void>(() => {
      try {
        figma.showUI(__html__, { width: 800, height: 500 });
        setTimeout(() => {
          figma.ui.postMessage({
            type: 'INIT',
            payload: { code: content, language, theme }
          });
        }, 100);
      } catch (error) {
        console.error('Error opening code editor:', error);
        figma.notify('Failed to open code editor');
      }
    });
  };

  const colors = themeColors[theme];
  const requiredWidth = calculateRequiredWidth(blocks);

  return (
    <AutoLayout
      direction="vertical"
      spacing={0}
      width={requiredWidth}
      fill={colors.widgetBg}
      cornerRadius={20}
      overflow="visible"
    >
      <AutoLayout
        direction="vertical"
        spacing={0}
        width="fill-parent"
        padding={12}
        fill={colors.widgetBg}
        cornerRadius={20}
        overflow="visible"
      >
        <MainHeading
          value={mainHeading}
          onChange={setMainHeading}
          theme={theme}
          onFocus={() => {
            setFocusedBlockId(null);
          }}
        />

        {blocks.map((block, index) => (
          <BlockComponent
            key={block.id}
            block={block}
            isFirst={index === 0}
            isFocused={focusedBlockId === block.id}
            theme={theme}
            onFocus={() => {
              if (focusedBlockId !== block.id) {
                setFocusedBlockId(block.id);
              }
            }}
            onOpenEditor={() => openCodeEditor(block.id, block.content, block.language)}
            onDelete={() => deleteBlock(block.id)}
          />
        ))}
      </AutoLayout>
    </AutoLayout>
  );
}

/**
 * ===================================
 * SECTION 6: UI COMPONENTS
 * ===================================
 */

// Main Heading Component
function MainHeading({ value, onChange, theme, onFocus }: { value: string; onChange: (v: string) => void; theme: 'dark' | 'light'; onFocus?: () => void }) {
  const colors = themeColors[theme];

  return (
    <AutoLayout
      direction="horizontal"
      spacing={6}
      padding={{ top: 0, bottom: 12, left: 0, right: 0 }}
      width="fill-parent"
      onClick={onFocus}
    >
      <Input
        inputBehavior="multiline"
        value={value}
        placeholder="Header"
        onTextEditEnd={(e) => onChange(e.characters)}
        fontSize={CONSTANTS.SIZES.HEADING}
        fontFamily={CONSTANTS.FONTS.HEADING}
        fontWeight={600}
        fill={colors.textPrimary}
        width="fill-parent"
        inputFrameProps={{
          fill: '#00000000',
          padding: 0,
        }}
      />
    </AutoLayout>
  );
}

/**
 * Code Block Component
 * Renders a code block with syntax highlighting support.
 */
function BlockComponent({
  block,
  isFirst,
  isFocused,
  theme,
  onFocus,
  onDelete,
  onOpenEditor,
}: {
  block: Block;
  isFirst: boolean;
  isFocused: boolean;
  theme: 'dark' | 'light';
  onFocus: () => void;
  onDelete: () => void;
  onOpenEditor: () => Promise<void> | void;
}) {
  const colors = themeColors[theme];

  return (
    <AutoLayout
      direction="horizontal"
      spacing={0}
      width="fill-parent"
      padding={{ top: isFirst ? 0 : 8, bottom: 2, left: 0, right: 0 }}
      overflow="visible"
    >
      <AutoLayout
        direction="vertical"
        spacing={4}
        width="fill-parent"
        padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
        fill={colors.blockBg}
        cornerRadius={10}
        overflow="visible"
        onClick={() => {
          onFocus();
          if (onOpenEditor) {
            return onOpenEditor();
          }
        }}
      >
        {block.highlightedLines ? (
          <AutoLayout
            direction="vertical"
            spacing={2}
            width="fill-parent"
          >
            {block.highlightedLines.map((line, lineIndex) => {
              const lineWidth = line.reduce((acc, token) => acc + token.text.length, 0) * CONSTANTS.LAYOUT.CODE_CHAR_WIDTH;
              const svgWidth = Math.max(lineWidth, 1);

              return (
                <AutoLayout
                  key={`line-${lineIndex}`}
                  direction="horizontal"
                  spacing={0}
                  width="fill-parent"
                  height="hug-contents"
                >
                  {line.length > 0 ? (
                    <SVG
                      width={svgWidth}
                      height={18}
                      src={`
                        <svg width="${svgWidth}" height="18" xmlns="http://www.w3.org/2000/svg">
                          <text x="0" y="14" style="font-family: '${CONSTANTS.FONTS.CODE}', monospace; font-size: ${CONSTANTS.SIZES.CODE}px; white-space: pre;">
                            ${line.map(token => {
                        const themeColorMap = syntaxColors[theme] as Record<string, string>;
                        const color = themeColorMap[token.type] || themeColorMap['default'];
                        return `<tspan fill="${color}">${escapeXML(token.text)}</tspan>`;
                      }).join('')}
                          </text>
                        </svg>
                      `}
                    />
                  ) : (
                    <WidgetText
                      fontSize={CONSTANTS.SIZES.CODE}
                      fontFamily={CONSTANTS.FONTS.CODE}
                      fontWeight={400}
                      fill={colors.textSecondary}
                      height={18}
                    >
                      {' '}
                    </WidgetText>
                  )}
                </AutoLayout>
              );
            })}
          </AutoLayout>
        ) : (
          <WidgetText
            fontSize={CONSTANTS.SIZES.TEXT}
            fontFamily={CONSTANTS.FONTS.CODE}
            fontWeight={400}
            fill={block.content ? colors.textPrimary : colors.textSecondary}
            width="fill-parent"
          >
            {block.content || '<Type code>'}
          </WidgetText>
        )}
      </AutoLayout>
    </AutoLayout>
  );
}

/**
 * ===================================
 * SECTION 7: REGISTRATION
 * ===================================
 */

widget.register(CodeEditorProWidget);
