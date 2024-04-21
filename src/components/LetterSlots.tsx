import React from 'react';
import LetterBox, {LetterBoxSizes, LetterBoxTypes} from "./LetterBox";
import {SelectedLetters} from "../types/Types";

type LetterSlotsProps = {
    selectedLetters: SelectedLetters;
    totalSlots?: number,
    size?: LetterBoxSizes,
    onLetterClick: (letter: string, index: number) => void,
    isSubmitWrong?: boolean
}
const LetterSlots: React.FC<LetterSlotsProps> = ({
                                                     selectedLetters,
                                                     totalSlots = 7,
                                                     size = LetterBoxSizes.SMALL,
                                                     onLetterClick,
                                                     isSubmitWrong = false,
                                                 }: LetterSlotsProps) => {
    const emptySlotsCount = totalSlots - selectedLetters.length;
    let index = 0;

    const handleOnClick = (letter: string, index: number) => {
        onLetterClick(letter, index);
    }
    return (
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            {selectedLetters.map(({letter}, index: number) => {
                return <LetterBox letter={letter} key={index} width={size} height={size} type={LetterBoxTypes.FOR_PLACING}
                                  onClick={(letter: string) => handleOnClick(letter, index++)} danger={letter != null && isSubmitWrong}/>
            })}
            {Array.from({length: emptySlotsCount}, (_, i) => (
                <LetterBox key={index++} width={size} height={size} type={LetterBoxTypes.FOR_PLACING}/>
            ))}
        </div>
    )
}

export default LetterSlots;