/**
 * ===================================
 * SECTION 1: IMPORTS & CONFIGURATION
 * ===================================
 */
const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Input, Text: WidgetText, SVG, useEffect } = widget;
/**
 * ===================================
 * SECTION 2: TYPE DEF INITIONS
 * ===================================
 */

// Types
type BlockType = 'code';

interface HighlightedToken {
  text: string;
  color: string;
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
    MIN_WIDTH: 500,
    BLOCK_PADDING: 24,
    CODE_CHAR_WIDTH: 7.8,
  },
  FONTS: {
    HEADING: 'Inter',
    CODE: 'Source Code Pro',
    TEXT: 'Inter',
  },
  SIZES: {
    HEADING: 16,
    CODE: 13,
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

// Theme colors
const themeColors = {
  dark: {
    widgetBg: '#000000',
    blockBg: '#1A1A1A',
    textPrimary: '#FFFFFF',
    textSecondary: '#505050',
  },
  light: {
    widgetBg: '#D4E8EA',
    blockBg: '#B8D9DC',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B8285',
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

  // Get focused block
  const focusedBlock = blocks.find((b) => b.id === focusedBlockId);

  // Property Menu for native Figma toolbar
  // Note: The position of this menu is controlled by Figma and cannot be changed.
  usePropertyMenu(
    [
      // Theme toggle (always visible)
      {
        itemType: 'action' as const,
        tooltip: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
        propertyName: 'toggle-theme',
        icon: theme === 'dark' ? ICONS.lightTheme : ICONS.darkTheme,
      },
    ],
    ({ propertyName }) => {
      // Handle theme toggle
      if (propertyName === 'toggle-theme') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        return;
      }
    }
  );

  // Handle block deletion
  const deleteBlock = (blockId: string) => {
    // Clear focus state if the deleted block was focused
    if (focusedBlockId === blockId) {
      setFocusedBlockId(null);
    }

    // Then delete the block
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
        // Show UI using the html file from manifest
        figma.showUI(__html__, { width: 800, height: 500 });

        // Send initial data after a short delay to ensure UI is ready
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

  // Get current theme colors
  const colors = themeColors[theme];

  // Calculate required width based on content
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
      {/* Main Content Container */}
      <AutoLayout
        direction="vertical"
        spacing={0}
        width="fill-parent"
        padding={12}
        fill={colors.widgetBg}
        cornerRadius={20}
        overflow="visible"
      >
        {/* Main Heading */}
        <MainHeading
          value={mainHeading}
          onChange={setMainHeading}
          theme={theme}
          onFocus={() => {
            setFocusedBlockId(null);
          }}
        />

        {/* Blocks */}
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
          if (onOpenEditor) return onOpenEditor();
        }}
      >
        {block.highlightedLines ? (
          <AutoLayout
            direction="vertical"
            spacing={2}
            width="fill-parent"
          >
            {block.highlightedLines.map((line, lineIndex) => {
              // Calculate line width
              const lineWidth = line.reduce((acc, token) => acc + token.text.length, 0) * CONSTANTS.LAYOUT.CODE_CHAR_WIDTH;
              // Ensure min width so it's not 0
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
                            ${line.map(token => `<tspan fill="${token.color}">${escapeXML(token.text)}</tspan>`).join('')}
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


// Close Button Component
function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <AutoLayout
      width={16}
      height={16}
      fill="#00000000"
      positioning="absolute"
      x={{ type: 'right', offset: -6 }}
      y={-6}
      onClick={onClick}
      horizontalAlignItems="center"
      verticalAlignItems="center"
    >
      <SVG
        src={`<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="12" height="12" rx="6" fill="black"/>
<path d="M5.9999 6.70039L3.5499 9.15039C3.45824 9.24206 3.34157 9.28789 3.1999 9.28789C3.05824 9.28789 2.94157 9.24206 2.8499 9.15039C2.75824 9.05872 2.7124 8.94206 2.7124 8.80039C2.7124 8.65872 2.75824 8.54206 2.8499 8.45039L5.2999 6.00039L2.8499 3.55039C2.75824 3.45872 2.7124 3.34206 2.7124 3.20039C2.7124 3.05872 2.75824 2.94206 2.8499 2.85039C2.94157 2.75872 3.05824 2.71289 3.1999 2.71289C3.34157 2.71289 3.45824 2.75872 3.5499 2.85039L5.9999 5.30039L8.4499 2.85039C8.54157 2.75872 8.65824 2.71289 8.7999 2.71289C8.94157 2.71289 9.05824 2.75872 9.1499 2.85039C9.24157 2.94206 9.2874 3.05872 9.2874 3.20039C9.2874 3.34206 9.24157 3.45872 9.1499 3.55039L6.6999 6.00039L9.1499 8.45039C9.24157 8.54206 9.2874 8.65872 9.2874 8.80039C9.2874 8.94206 9.24157 9.05872 9.1499 9.15039C9.05824 9.24206 8.94157 9.28789 8.7999 9.28789C8.65824 9.28789 8.54157 9.24206 8.4499 9.15039L5.9999 6.70039Z" fill="white"/>
</svg>`}
      />
    </AutoLayout>
  );
}




/**
 * ===================================
 * SECTION 7: REGISTRATION
 * ===================================
 */

widget.register(CodeEditorProWidget);
