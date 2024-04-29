import React from 'react';
import LoadingSpinner from "./LoadingSpinner";

export enum LetterBoxSizes {
    SMALL = 'small-size',
    NORMAL = 'normal-size',
    BLOCK = 'block'
}

export enum LetterBoxTypes {
    FOR_PICKING = 'for-picking',
    FOR_PLACING = 'for-placing'
}

export type LetterProps = {
    letter?: React.ReactNode,
    width?: LetterBoxSizes,
    height?: LetterBoxSizes,
    onClick?: (letter: string | undefined) => void,
    type?: LetterBoxTypes,
    disabled?: boolean,
    danger?: boolean,
    isLoading?: boolean,
}
const LetterBox: React.FC<LetterProps> = ({
                                              letter = null,
                                              width = LetterBoxSizes.NORMAL,
                                              height = LetterBoxSizes.NORMAL,
                                              onClick = undefined,
                                              type = LetterBoxTypes.FOR_PICKING,
                                              disabled = false,
                                              danger = false,
                                              isLoading = false,
                                          }: LetterProps) => {
    const handleOnClick = () => {
        if (onClick) {
            if (!disabled) {
                onClick(typeof letter === 'string' ? letter : undefined);
            }
        }
    };

    const content = typeof letter === 'string' ? (letter.length > 1 ? letter : letter?.toUpperCase()) : letter;

    return (
        <div
            className={`letter-box ${letter ? '' : 'empty'} width-${width} height-${height} ${danger ? 'danger' : ''} ${type} ${disabled ? 'disabled' : ''}`}
            onClick={handleOnClick}>
            {isLoading ? <LoadingSpinner></LoadingSpinner> : content}
        </div>
    );
};

export default LetterBox;
