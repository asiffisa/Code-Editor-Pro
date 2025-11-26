/**
 * Block Component
 * Renders a code block with syntax highlighting support
 */

const { widget } = figma;
const { AutoLayout, SVG, Text: WidgetText } = widget;

import { Block, Theme } from '../types';
import { CONSTANTS, themeColors } from '../constants';
import { escapeXML } from '../utils';

/**
 * Props for the BlockComponent
 */
interface BlockComponentProps {
    /** The block data to render */
    block: Block;
    /** Whether this is the first block (affects top padding) */
    isFirst: boolean;
    /** Whether this block is currently focused */
    isFocused: boolean;
    /** Current theme (dark/light) */
    theme: Theme;
    /** Callback when block is focused */
    onFocus: () => void;
    /** Callback when block delete is requested */
    onDelete: () => void;
    /** Callback to open the code editor */
    onOpenEditor: () => Promise<void> | void;
}

/**
 * Code Block Component
 * 
 * Renders a code block with syntax highlighting if available.
 * Clicking opens the code editor for editing.
 * 
 * Features:
 * - Syntax highlighting via SVG rendering
 * - Fallback to plain text display
 * - Click to open editor
 * - Theme-aware styling
 * 
 * @param props - Component props
 * @returns JSX element for the code block
 */
export function BlockComponent({
    block,
    isFirst,
    isFocused,
    theme,
    onFocus,
    onDelete,
    onOpenEditor,
}: BlockComponentProps) {
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
                                            height={CONSTANTS.LAYOUT.SVG_LINE_HEIGHT}
                                            src={`
                        <svg width="${svgWidth}" height="${CONSTANTS.LAYOUT.SVG_LINE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                          <text x="0" y="14" style="font-family: '${CONSTANTS.FONTS.CODE}', monospace; font-size: ${CONSTANTS.SIZES.CODE}px; white-space: pre;">
                            ${line
                                                    .filter(token => token && typeof token.text === 'string' && typeof token.color === 'string')
                                                    .map(token => `<tspan fill="${token.color}">${escapeXML(token.text)}</tspan>`)
                                                    .join('')}
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
                                            height={CONSTANTS.LAYOUT.SVG_LINE_HEIGHT}
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
