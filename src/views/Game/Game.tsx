import React, {useEffect, useState} from 'react';
import {checkWord, getGame} from "../../services/Api";
import LetterBox, {LetterBoxSizes, LetterProps} from "../../components/LetterBox";
import LetterPicker from "../../components/LetterPicker";
import LetterSlots from "../../components/LetterSlots";
import {GuessedWords, SelectedLetters} from "../../types/Types";
import {useParams} from "react-router-dom";
import Notebook from "../../components/Notebook";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLevelDown, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {WebSocketService} from "../../utilities/WebSocket";
import {useUserId} from '../../context/UserContext';
import LoadingSpinner from "../../components/LoadingSpinner";

declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

const Game: React.FC = () => {
    const [drawnLetters, setDrawnLetters] = useState<Array<string>>([]);
    const [selectedLetters, setSelectedLetters] = useState<SelectedLetters>([]);
    const [isSubmitWrong, setIsSubmitWrong] = useState<boolean>(false);
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const {hash} = useParams();
    const [guessedWords, setGuessedWords] = useState<GuessedWords>([]);
    const [guessedWordsOpponent, setGuessedWordsOpponent] = useState<GuessedWords>([]);
    const wsUrl = process.env.REACT_APP_WS_URL;
    const userId = useUserId();
    const [opponentNickname, setOpponentNickname] = useState<string | undefined>(undefined);
    const [checkWordLoading, setCheckWordLoading] = useState(false);
    const [getGameLoading, setGetGameLoading] = useState(false);
    const [highlightedWord, setHighlightedWord] = useState<string | undefined>();


    useEffect(() => {
        if (!userId) {
            return;
        }
        const ws = new WebSocketService();

        ws.onMessage((data) => {
            console.log('Received data:', data.guessed_words);

            if (data.player_id !== userId) {
                setGuessedWordsOpponent(data.guessed_words ?? [])
            }
        });

        ws.onError((event) => {
            console.error('WebSocket error:', event);
        });

        ws.onClose((event) => {
            console.log('WebSocket closed:', event);
        });

        ws.connect(`${wsUrl}?room=${hash}`);

        return () => {
            ws.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        if (hash && userId) {
            setGetGameLoading(true);
            getGame(hash, userId)
                .then((resp: any) => {
                    if (resp.data.success) {
                        const letters = resp.data.data.shuffled_letters;
                        setDrawnLetters(letters.split(''));
                        resetSelectedLetters(letters.length);
                        setGuessedWords(resp.data.data.guessed_words ?? []);
                        setGuessedWordsOpponent(resp.data.data.guessed_words_opponent ?? []);
                        setOpponentNickname(resp.data.data.player_2_nickname ?? undefined);
                        setGetGameLoading(false);
                    }
                }).catch(err => {
                console.log(err);
                setGetGameLoading(false);
            });
        }
    }, [userId]);

    function handleMessengerShare() {
        window.FB.ui({
            method: 'send',
            link: `https://pikami.se/game/${hash}`,
        }, (response: any) => {
            if (response) {
                console.log('Share successful', response);
            } else {
                console.log('Error while sharing');
            }
        });
    }

    const handleCheckWord = () => {
        if (hash && userId) {
            const wordToCheck = selectedLetters.map(item => item.letter).join('')
            if (guessedWords.some(guessedWord => guessedWord.word === wordToCheck) ||
                guessedWordsOpponent.some(guessedWord => guessedWord.word === wordToCheck)) {
                resetSelectedLetters(drawnLetters.length);

                setHighlightedWord(wordToCheck);
                setTimeout(() => setHighlightedWord(undefined), 800);
                return;
            }

            setCheckWordLoading(true);
            setCanSubmit(false);
            checkWord(hash, userId, wordToCheck).then((resp: any) => {
                if (resp.data.success) {
                    resetSelectedLetters(drawnLetters.length);
                } else {
                    setIsSubmitWrong(true);
                }

                setGuessedWords(resp.data.data.guessed_words ?? []);
                setGuessedWordsOpponent(resp.data.data.guessed_words_opponent ?? []);
                setCheckWordLoading(false);
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

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {getGameLoading ?
                    <div className={'game-loading-wrapper'}>
                        <LoadingSpinner></LoadingSpinner>
                    </div> :
                    <>
                        <LetterPicker letterBoxes={drawnLetters.map((el) => ({letter: el})) as LetterProps[]}
                                      selectedLetters={selectedLetters}
                                      onLetterClick={handleLetterPick}/>
                        <div style={{display: 'flex', gap: '10px', margin: '0 20px'}}>
                            <LetterSlots selectedLetters={selectedLetters}
                                         totalSlots={drawnLetters.length}
                                         onLetterClick={handleLetterRemove}
                                         isSubmitWrong={isSubmitWrong}
                            />
                        </div>
                        <div style={{display: 'flex', gap: '10px', margin: '0 20px'}}>
                            <LetterBox letter={<FontAwesomeIcon size={'lg'} icon={faTrashCan}></FontAwesomeIcon>}
                                       height={LetterBoxSizes.SMALL}
                                       width={LetterBoxSizes.BLOCK}
                                       onClick={() => resetSelectedLetters(selectedLetters.length)}/>
                            <LetterBox letter={<FontAwesomeIcon size={'lg'} icon={faLevelDown}></FontAwesomeIcon>}
                                       isLoading={checkWordLoading}
                                       height={LetterBoxSizes.SMALL}
                                       width={LetterBoxSizes.BLOCK}
                                       disabled={!canSubmit}
                                       onClick={handleCheckWord}/>
                        </div>
                        <Notebook guessedWords={guessedWords}
                                  guessedWordsOpponent={guessedWordsOpponent}
                                  highlightedWord={highlightedWord}
                                  opponentNickname={opponentNickname}/>
                    </>
                }


            </div>
        </div>
    );
};

export default Game;
