/**
 * Main Heading Component
 * Displays and manages the editable heading/title for the widget
 */

const { widget } = figma;
const { AutoLayout, Input } = widget;

import { Theme } from '../types';
import { CONSTANTS, themeColors } from '../constants';

/**
 * Props for the MainHeading component
 */
interface MainHeadingProps {
    /** Current heading value */
    value: string;
    /** Callback when heading value changes */
    onChange: (value: string) => void;
    /** Current theme (dark/light) */
    theme: Theme;
    /** Callback when heading is focused */
    onFocus: () => void;
}

/**
 * Main Heading Component
 * 
 * Renders an editable heading input at the top of the widget.
 * Clicking the heading triggers the onFocus callback.
 * 
 * @param props - Component props
 * @returns JSX element for the heading
 */
export function MainHeading({ value, onChange, theme, onFocus }: MainHeadingProps) {
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
