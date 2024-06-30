import React from 'react';
import LetterBox, {LetterProps} from "./LetterBox";
import {SelectedLetters} from "../types/Types";
import {faClose, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


type LetterBoardProps = {
    letterBoxes: LetterProps[],
    onLetterClick?: (letter: string, index: number) => void,
    selectedLetters: SelectedLetters;
    disabled?: boolean;
}
const LetterPicker: React.FC<LetterBoardProps> = ({letterBoxes, onLetterClick, selectedLetters, disabled = false}: LetterBoardProps) => {
    const handleOnClick = (letter: string | undefined, index: number) => {
        if (letter && onLetterClick) {
            return onLetterClick(letter, index);
        }
    }

    return (
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '0 20px'}}>
            {
                letterBoxes.map((box: LetterProps, index: number) => {
                    return <LetterBox key={index}
                                      letter={disabled ? <FontAwesomeIcon size={'xs'} icon={faEyeSlash}></FontAwesomeIcon> : box.letter}
                                      onClick={(letter: string | undefined) => handleOnClick(letter, index)}
                                      disabled={!!selectedLetters.find(el => el.index === index)}/>
                })
            }
        </div>
    );
};

export default LetterPicker;
