/**
 * Constants and Configuration for Code Editor Pro
 * Centralized configuration values for easy customization
 */

import { ThemeColors } from './types';

/**
 * Layout, font, size, and timing constants
 */
export const CONSTANTS = {
    /** Layout-related constants */
    LAYOUT: {
        /** Minimum widget width in pixels */
        MIN_WIDTH: 500,
        /** Padding for code blocks in pixels */
        BLOCK_PADDING: 24,
        /** Average character width for monospace code font */
        CODE_CHAR_WIDTH: 7.8,
        /** Total padding: 24px (Root) + 24px (Block) */
        TOTAL_PADDING: 48,
        /** Height of each SVG line for syntax highlighting */
        SVG_LINE_HEIGHT: 18,
    },
    /** Font family constants */
    FONTS: {
        /** Font for headings */
        HEADING: 'Inter',
        /** Font for code blocks */
        CODE: 'Source Code Pro',
        /** Font for regular text */
        TEXT: 'Inter',
    },
    /** Font size constants */
    SIZES: {
        /** Heading font size */
        HEADING: 16,
        /** Code font size */
        CODE: 13,
        /** Regular text font size */
        TEXT: 14,
        /** Small text font size */
        SMALL: 10,
    },
    /** Timing-related constants */
    TIMING: {
        /** Delay before sending INIT message to UI (ms) */
        UI_INIT_DELAY: 100,
    },
} as const;

/**
 * SVG icons for UI elements
 */
export const ICONS = {
    /** Light theme toggle icon */
    lightTheme: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 1.33333V2.66667M8 13.3333V14.6667M14.6667 8H13.3333M2.66667 8H1.33333M12.7133 3.28667L11.7733 4.22667M4.22667 11.7733L3.28667 12.7133M12.7133 12.7133L11.7733 11.7733M4.22667 4.22667L3.28667 3.28667M10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8Z" stroke="#98B3B5" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    /** Dark theme toggle icon */
    darkTheme: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.8867 10.5133C13.7867 10.5267 13.6867 10.5333 13.58 10.5333C10.82 10.5333 8.58 8.29333 8.58 5.53333C8.58 4.34667 9.00667 3.25333 9.72 2.4C9.28 2.22667 8.8 2.13333 8.29333 2.13333C5.05333 2.13333 2.42667 4.76 2.42667 8C2.42667 11.24 5.05333 13.8667 8.29333 13.8667C11.16 13.8667 13.5467 11.8267 14.0867 9.12C14.06 9.12 14.0267 9.12 14 9.12C13.96 9.12 13.9267 9.12 13.8867 10.5133Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
};

/**
 * Theme color configurations
 * Maps theme names to their respective color palettes
 */
export const themeColors: Record<'dark' | 'light', ThemeColors> = {
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
    },
};
