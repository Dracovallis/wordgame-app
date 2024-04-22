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
    letter?: React.ReactNode,
    width?: LetterBoxSizes,
    height?: LetterBoxSizes,
    onClick?: (letter: string | undefined) => void,
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
    const handleOnClick = () => {
        if (onClick) {
            if (!disabled) {
                onClick(typeof letter === 'string' ? letter : undefined);
            }
        }
    };
    return (
        <div
            className={`letter-box ${letter ? '' : 'empty'} width-${width} height-${height} ${danger ? 'danger' : ''} ${type} ${disabled ? 'disabled' : ''}`}
            onClick={handleOnClick}>
            {typeof letter === 'string' ? letter?.toUpperCase() : letter}
        </div>
    );
};

export default LetterBox;
