import React, {useEffect, useState} from 'react';
import {checkWord, getGame} from "../../services/Api";
import LetterBox, {LetterBoxSizes, LetterProps} from "../../components/LetterBox";
import LetterPicker from "../../components/LetterPicker";
import LetterSlots from "../../components/LetterSlots";
import {GameState, GuessedWords, SelectedLetters} from "../../types/Types";
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
    const [gameState, setGameState] = useState<GameState>();
    const [drawnLetters, setDrawnLetters] = useState<Array<string>>([]);

    const [selectedLetters, setSelectedLetters] = useState<SelectedLetters>([]);
    const [isSubmitWrong, setIsSubmitWrong] = useState<boolean>(false);
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const [checkWordLoading, setCheckWordLoading] = useState(false);
    const [getGameLoading, setGetGameLoading] = useState(false);
    const [highlightedWord, setHighlightedWord] = useState<string | undefined>();

    const {hash} = useParams();
    const wsUrl = process.env.REACT_APP_WS_URL;
    const userId = useUserId();


    useEffect(() => {
        if (!userId) {
            return;
        }
        const ws = new WebSocketService();

        ws.onMessage((data) => {
            console.log('Received data:', data);

            if (data.type === 'wordGuessed' && data.player_id !== userId) {
                setGameState((prevState: GameState | undefined): GameState | undefined => {
                    if (!prevState) return undefined;
                    return {
                        ...prevState,
                        guessed_words_opponent: data.guessed_words ?? prevState.guessed_words,
                    };
                });
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

                        setGetGameLoading(false);

                        setGameState(resp.data?.data);
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
            if (gameState?.guessed_words && gameState?.guessed_words.some(guessedWord => guessedWord.word === wordToCheck) ||
                gameState?.guessed_words_opponent && gameState?.guessed_words_opponent.some(guessedWord => guessedWord.word === wordToCheck)) {
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

                if (gameState) {
                    setGameState({
                        ...gameState,
                        guessed_words: resp.data.data.guessed_words ?? [],
                        guessed_words_opponent: resp.data.data.guessed_words_opponent ?? []
                    })
                }

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
        <div className={'container-wrapper'}>
            <div className={'container'}>
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
                        <Notebook gameState={gameState}
                                  highlightedWord={highlightedWord}/>
                    </>
                }
            </div>
        </div>
    );
};

export default Game;
