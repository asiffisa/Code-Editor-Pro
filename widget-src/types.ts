/**
 * Type Definitions for Code Editor Pro
 * Centralized type definitions for better maintainability and reusability
 */

/**
 * Supported block types in the widget
 * Currently only 'code' is supported
 */
export type BlockType = 'code';

/**
 * Represents a single syntax-highlighted token
 */
export interface HighlightedToken {
    /** The text content of the token */
    text: string;
    /** The color to render the token (hex format) */
    color: string;
}

/**
 * Represents a code block in the widget
 */
export interface Block {
    /** Unique identifier for the block */
    id: string;
    /** Type of block */
    type: BlockType;
    /** Raw code content */
    content: string;
    /** Programming language for syntax highlighting */
    language?: string;
    /** Syntax-highlighted token data, organized by line */
    highlightedLines?: HighlightedToken[][];
}

/**
 * Available theme options
 */
export type Theme = 'dark' | 'light';

/**
 * Theme color configuration
 */
export interface ThemeColors {
    /** Background color for the entire widget */
    widgetBg: string;
    /** Background color for individual blocks */
    blockBg: string;
    /** Primary text color */
    textPrimary: string;
    /** Secondary/placeholder text color */
    textSecondary: string;
}

/**
 * Message types sent from the UI to the widget
 */
export type UIMessage =
    | {
        type: 'UPDATE_CODE';
        code: string;
        highlightedLines?: HighlightedToken[][];
    }
    | {
        type: 'UPDATE_LANGUAGE';
        language: string;
        highlightedLines?: HighlightedToken[][];
    }
    | {
        type: 'COPY_SUCCESS';
    };

/**
 * Property menu event data
 */
export interface PropertyMenuEvent {
    propertyName: string;
    propertyValue?: string;
}
