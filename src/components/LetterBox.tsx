import React from 'react';

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
    letter?: string | null,
    width?: LetterBoxSizes,
    height?: LetterBoxSizes,
    onClick?: (letter: string) => void,
    type?: LetterBoxTypes,
    disabled?: boolean,
    danger?: boolean,
}
const LetterBox: React.FC<LetterProps> = ({
                                              letter = null,
                                              width = LetterBoxSizes.NORMAL,
                                              height = LetterBoxSizes.NORMAL,
                                              onClick = undefined,
                                              type = LetterBoxTypes.FOR_PICKING,
                                              disabled = false,
                                              danger = false,
                                          }: LetterProps) => {
    const handleOnClick = (letter: string | null) => {
        if (letter && !disabled) {
            if (onClick) {
                onClick(letter);
            }
        }
    }
    return (
        <div
            className={`letter-box ${letter ? '' : 'empty'} width-${width} height-${height} ${danger ? 'danger' : ''} ${type} ${disabled ? 'disabled' : ''}`}
            onClick={() => handleOnClick(letter)}>
            {letter?.toUpperCase()}
        </div>
    );
};

export default LetterBox;
