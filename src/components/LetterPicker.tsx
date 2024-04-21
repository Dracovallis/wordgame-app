import React from 'react';
import LetterBox, {LetterProps} from "./LetterBox";
import {SelectedLetters} from "../types/Types";


type LetterBoardProps = {
    letterBoxes: LetterProps[],
    onLetterClick?: (letter: string, index: number) => void,
    selectedLetters: SelectedLetters;
}
const LetterPicker: React.FC<LetterBoardProps> = ({letterBoxes, onLetterClick, selectedLetters}: LetterBoardProps) => {
    const handleOnClick = (letter: string, index: number) => {
        if (letter && onLetterClick) {
            return onLetterClick(letter, index);
        }
    }

    return (
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '0 20px'}}>
            {
                letterBoxes.map((box: LetterProps, index: number) => {
                    return <LetterBox key={index}
                                      letter={box.letter}
                                      onClick={(letter: string) => handleOnClick(letter, index)}
                                      disabled={!!selectedLetters.find(el => el.index === index)}/>
                })
            }
        </div>
    );
};

export default LetterPicker;
