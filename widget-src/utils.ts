/**
 * Utility Functions for Code Editor Pro
 * Reusable helper functions for the widget
 */

import { Block } from './types';
import { CONSTANTS } from './constants';

/**
 * Counter for generating unique IDs
 * Incremented with each ID generation to ensure uniqueness
 */
let idCounter = 0;

/**
 * Generates a unique identifier for blocks
 * Format: block-{timestamp}-{counter}-{random}
 * 
 * @returns A unique string identifier
 * 
 * @example
 * const id = generateId(); // "block-1700000000000-1-abc123def"
 */
export function generateId(): string {
    return `block-${Date.now()}-${++idCounter}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Escapes XML/HTML special characters to prevent injection attacks
 * Converts: & < > " ' to their XML entity equivalents
 * 
 * @param str - The string to escape
 * @returns Escaped string safe for XML/SVG embedding
 * 
 * @example
 * escapeXML('<script>alert("XSS")</script>');
 * // Returns: "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
 */
export function escapeXML(str: string): string {
    if (!str || typeof str !== 'string') {
        return '';
    }

    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Calculates the required widget width based on code content
 * Analyzes all blocks to find the longest line and calculates appropriate width
 * 
 * @param blocks - Array of code blocks to analyze
 * @returns Required width in pixels (minimum: CONSTANTS.LAYOUT.MIN_WIDTH)
 * 
 * @example
 * const width = calculateRequiredWidth(blocks); // 650
 */
export function calculateRequiredWidth(blocks: Block[]): number {
    if (!Array.isArray(blocks) || blocks.length === 0) {
        return CONSTANTS.LAYOUT.MIN_WIDTH;
    }

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

    const requiredWidth = maxLineWidth + CONSTANTS.LAYOUT.TOTAL_PADDING;

    return Math.max(CONSTANTS.LAYOUT.MIN_WIDTH, requiredWidth);
}
