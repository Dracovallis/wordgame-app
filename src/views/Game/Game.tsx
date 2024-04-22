import React, {useEffect, useState} from 'react';
import {checkWord, fetchWordMeaningChitanka, getGame} from "../../services/Api";
import LetterBox, {LetterBoxSizes, LetterProps} from "../../components/LetterBox";
import LetterPicker from "../../components/LetterPicker";
import LetterSlots from "../../components/LetterSlots";
import {GuessedWords, SelectedLetters} from "../../types/Types";
import {useParams} from "react-router-dom";
import '../../assets/56-font.otf';
import Notebook from "../../components/Notebook";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashCan, faLevelDown, faQuestion} from '@fortawesome/free-solid-svg-icons';
import {parseWordMeaningFromChitanka} from "../../helpers/Functions";

const Game: React.FC = () => {
    const [drawnLetters, setDrawnLetters] = useState<Array<string>>([]);
    const [selectedLetters, setSelectedLetters] = useState<SelectedLetters>([]);
    const [wordMeaning, setWordMeaning] = useState<string | boolean>(false);
    const [isSubmitWrong, setIsSubmitWrong] = useState<boolean>(false);
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const {hash} = useParams();
    const [guessedWords, setGuessedWords] = useState<GuessedWords>([]);

    useEffect(() => {
        console.log('TEST', selectedLetters);
    }, [selectedLetters]);

    useEffect(() => {
        if (hash) {
            getGame(hash)
                .then((resp: any) => {
                    if (resp.data.success) {
                        const letters = resp.data.data.shuffled_letters;
                        setDrawnLetters(letters.split(''));
                        resetSelectedLetters(letters.length);
                        setGuessedWords(resp.data.data.guessed_words ?? []);
                    }
                }).catch(err => console.log(err))
        }
    }, []);

    const handleCheckWord = () => {
        setCanSubmit(false);
        if (hash) {
            checkWord(hash, selectedLetters.map(item => item.letter).join('')).then((resp: any) => {
                if (resp.data.success) {
                    resetSelectedLetters(drawnLetters.length);
                    setGuessedWords(resp.data.data.guessed_words ?? []);
                } else {
                    setIsSubmitWrong(true);
                }
            })
        }
    }

    useEffect(() => {
        setCanSubmit(selectedLetters.filter(el => el.letter != null).length > 2)
    }, [selectedLetters]);

    const resetSelectedLetters = (length?: number) => {
        setSelectedLetters((Array(length).fill({letter: null, index: -1})));
    }

    const handleLetterPick = (letter: string, index: number) => {
        const updatedLetters = [...selectedLetters];
        const firstEmptyIndex = updatedLetters.findIndex(slot => slot.letter === null);
        if (firstEmptyIndex !== -1) {
            updatedLetters[firstEmptyIndex] = {letter, index};
            setSelectedLetters(updatedLetters);
        }

        setIsSubmitWrong(false);
    };

    const handleLetterRemove = (letter: string | undefined, index: number) => {
        const updatedLetters = [...selectedLetters];
        updatedLetters[index] = {letter: null, index: -1};
        setSelectedLetters(updatedLetters);
        setIsSubmitWrong(false);
    };

    const checkWordOnline = () => {
        const word = selectedLetters.map(item => item.letter).join('');

        fetchWordMeaningChitanka(word).then(resp => {
            const cleanHTML = parseWordMeaningFromChitanka(resp.data);
            if (cleanHTML) {
                setWordMeaning(cleanHTML);
            }
        }).catch(err => console.log(err));
    };

    useEffect(() => {
        console.log('TEST', wordMeaning);
    }, [wordMeaning])


    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <LetterPicker letterBoxes={drawnLetters.map((el) => ({letter: el})) as LetterProps[]}
                              selectedLetters={selectedLetters}
                              onLetterClick={handleLetterPick}/>
                <div style={{display: 'flex', gap: '10px', margin: '0 20px'}}>
                    <LetterSlots selectedLetters={selectedLetters}
                                 totalSlots={drawnLetters.length}
                                 onLetterClick={handleLetterRemove}
                                 isSubmitWrong={isSubmitWrong}
                    />

                    <LetterBox letter={<FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon>}
                               height={LetterBoxSizes.SMALL}
                               width={LetterBoxSizes.SMALL}

                               onClick={checkWordOnline}/>

                </div>
                <div style={{display: 'flex', gap: '10px', margin: '0 20px'}}>
                    <LetterBox letter={<FontAwesomeIcon icon={faLevelDown}></FontAwesomeIcon>}
                               height={LetterBoxSizes.SMALL}
                               width={LetterBoxSizes.BLOCK}
                               disabled={!canSubmit}
                               onClick={handleCheckWord}/>
                    <LetterBox letter={<FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>}
                               height={LetterBoxSizes.SMALL}
                               width={LetterBoxSizes.BLOCK}
                               onClick={() => resetSelectedLetters(selectedLetters.length)}/>
                </div>


                <Notebook guessedWords={guessedWords}/>
            </div>
        </div>
    );
};

export default Game;
