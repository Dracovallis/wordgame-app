import React, {useEffect, useRef, useState} from "react";
import {GameState, ScoreRow} from "../types/Types";
import {Scrollbars} from 'react-custom-scrollbars';
import {getWordMeaning} from "../services/Api";
import Modal from "./Modal";
import LetterBox, {LetterBoxSizes} from "./LetterBox";
import Swal from 'sweetalert2';
import {useUserData} from "../context/UserContext";
import {FIVE_STAR_SCORE, GAME_TYPES} from "../constants/Constants";
import StarRating from "./StarRating";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrophy} from "@fortawesome/free-solid-svg-icons";

type WordRefs = {
    [key: string]: HTMLTableRowElement | null;
};
type NotebookProps = {
    gameState?: GameState,
    highlightedWord?: string,
}
const Notebook: React.FC<NotebookProps> = ({
                                               gameState,
                                               highlightedWord,
                                           }: NotebookProps) => {
    const [totalScore, setTotalScore] = useState(0);
    const [totalScoreOpponent, setTotalScoreOpponent] = useState(0);
    const [wordMeaning, setWordMeaning] = useState<{ word: string, meaning: string }>({word: '', meaning: ''})
    const [inviteFriendModalOpen, setInviteFriendModalOpen] = useState(false);
    const wordRefs = useRef<WordRefs>({});

    useEffect(() => {
        if (highlightedWord) {
            setTimeout(() => {
                const wordRef = wordRefs.current[highlightedWord];
                if (wordRef) {
                    wordRef.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 100);
        }
    }, [highlightedWord])

    const searchForWordMeaning = (word: string) => {
        if (wordMeaning?.word === word) {
            return;
        }
        fetchWordMeaning(word);
    }

    const fetchWordMeaning = (word: string) => {
        getWordMeaning(word).then(resp => {
            setWordMeaning({
                word: resp.data.data.word,
                meaning: resp.data.data.meaning,
            })
        })
    };

    const onModalClose = () => {
        setWordMeaning({word: '', meaning: ''});
    }

    const handleOnCopyLink = async () => {
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);

            setInviteFriendModalOpen(false);

            Swal.fire({
                title: 'Link copied to clipboard',
                text: 'Send to a friend',
                icon: 'success',
                timer: 3000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
            });

        } catch (error) {

        }
    };

    const getOpponentHeaderText = () => {
        if (gameState?.type === GAME_TYPES.multiplayer) {
            return <>{gameState?.player_2?.nickname ?? 'Opponent'}</>
        } else if (gameState?.type === GAME_TYPES.single_player) {
            return <>{'Single Player'}</>
        } else {
            return <FontAwesomeIcon icon={faTrophy}/>
        }
    }

    useEffect(() => {
        if (gameState?.guessed_words) {
            setTotalScore(gameState?.guessed_words.reduce((accumulator, item) => accumulator + item.score, 0));
        }
        if (gameState?.guessed_words_opponent) {
            setTotalScoreOpponent(gameState?.guessed_words_opponent.reduce((accumulator, item) => accumulator + item.score, 0));
        }
    }, [gameState?.guessed_words, gameState?.guessed_words_opponent]);

    return (
        <div style={{margin: '0px 20px 70px 20px'}}>
            <div className="notebook">
                <div className={'page-header'}>{gameState?.player_1?.nickname ?? 'You'}</div>
                <div className="page left-page">
                    <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                        <div>Word</div>
                        <div>Score</div>
                    </div>
                    <div style={{width: '100%', height: '85%'}}>
                        <Scrollbars>
                            {gameState?.guessed_words &&
                                <table style={{position: 'sticky', overflow: 'hidden'}}>
                                    <tbody>
                                    {gameState?.guessed_words.map(el => {
                                        return <tr onClick={() => searchForWordMeaning(el.word)}
                                                   ref={ref => wordRefs.current[el.word] = ref}
                                                   key={el.word}
                                                   className={`${highlightedWord === el.word ? 'highlight' : ''} player`}>
                                            <td style={{cursor: 'pointer'}}>{el.word}</td>
                                            <td>{el.score}</td>
                                        </tr>
                                    })}
                                    </tbody>
                                </table>}
                        </Scrollbars>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                        <div>Total</div>
                        <div>{totalScore}</div>
                    </div>
                </div>
                {gameState?.type !== GAME_TYPES.single_player &&
                    <div className={'page-header opponent'}>
                        {getOpponentHeaderText()}
                    </div>}
                <div className="page right-page">
                    {gameState?.type === GAME_TYPES.multiplayer && !gameState?.player_2?.nickname &&
                        <div style={{position: 'sticky', padding: '10px'}}>
                            <LetterBox letter={'Invite a friend'}
                                       width={LetterBoxSizes.BLOCK}
                                       height={LetterBoxSizes.SMALL}
                                       onClick={() => setInviteFriendModalOpen(true)}
                            />
                        </div>
                    }
                    {gameState?.type !== GAME_TYPES.daily && gameState?.player_2?.nickname &&
                        <>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                                <div>Word</div>
                                <div>Score</div>
                            </div>
                            <div style={{width: '100%', height: '85%'}}>
                                <Scrollbars>
                                    <table style={{position: 'sticky'}}>
                                        <tbody>
                                        {gameState?.guessed_words_opponent && gameState?.guessed_words_opponent.map(el => {
                                            return <tr onClick={() => searchForWordMeaning(el.word)}
                                                       ref={ref => wordRefs.current[el.word] = ref}
                                                       key={el.word}
                                                       className={`${highlightedWord === el.word ? 'highlight' : ''} opponent`}
                                            >
                                                <td style={{cursor: 'pointer'}}>{el.word}</td>
                                                <td>{el.score}</td>
                                            </tr>
                                        })}
                                        </tbody>
                                    </table>
                                </Scrollbars>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                                <div>Total</div>
                                <div>{totalScoreOpponent}</div>
                            </div>
                        </>
                    }
                    {gameState?.type === GAME_TYPES.single_player &&
                        <div className={'container center'}>
                            <b>Progress</b>
                            <StarRating rating={totalScore} total={FIVE_STAR_SCORE} size={'lg'}/>
                        </div>
                    }
                    {gameState?.type === GAME_TYPES.daily &&
                        <>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                                <div>Rank</div>
                                <div>User</div>
                                <div>Score</div>
                            </div>
                            <div style={{width: '100%', height: '85%'}}>
                                <Scrollbars>
                                    <table style={{position: 'sticky'}}>
                                        <tbody>
                                        {gameState?.opponent_score_list && gameState?.opponent_score_list.map((el: ScoreRow, index: number) => {
                                            return <tr key={index}>
                                                <td>#{index + 1}</td>
                                                <td style={{borderRight: '2px solid #000'}}>{el.nickname ?? 'Unknown'}</td>
                                                <td>{el.total_score ?? 0}</td>
                                            </tr>
                                        })}
                                        </tbody>
                                    </table>
                                </Scrollbars>
                            </div>
                        </>
                    }
                </div>
            </div>
            <Modal isOpen={inviteFriendModalOpen} onCloseModal={() => setInviteFriendModalOpen(false)}
                   title={'Invite a friend'}>
                <div className={'container'} style={{paddingTop: '10px'}}>
                    <LetterBox letter={'Copy link'}
                               width={LetterBoxSizes.BLOCK}
                               height={LetterBoxSizes.SMALL}
                               onClick={handleOnCopyLink}/>
                    <a href={`https://wa.me/?text=${window.location.href}`}>
                        <LetterBox letter={'Share on WhatsApp'}
                                   width={LetterBoxSizes.BLOCK}
                                   height={LetterBoxSizes.SMALL}
                                   onClick={() => setInviteFriendModalOpen(false)}
                        /> </a>
                </div>
            </Modal>
            <Modal isOpen={!!wordMeaning?.word}
                   onCloseModal={onModalClose}
                   title={wordMeaning?.word}
                   footer={<>
                       <a href={`http://rechnik.info/${encodeURIComponent(wordMeaning?.word)}`} style={{width: '100%'}}
                          target={'_blank'}>
                           <LetterBox
                               width={LetterBoxSizes.BLOCK}
                               height={LetterBoxSizes.SMALL}
                               letter={
                                   'rechnik.info'
                               }/>
                       </a>
                       <a href={`https://rechnik.chitanka.info/w/${encodeURIComponent(wordMeaning?.word)}`}
                          style={{width: '100%'}}
                          target={'_blank'}>
                           <LetterBox
                               width={LetterBoxSizes.BLOCK}
                               height={LetterBoxSizes.SMALL}
                               letter={
                                   'rechnik.chitanka.info'
                               }/>
                       </a>
                   </>}
            >
                <div dangerouslySetInnerHTML={{__html: wordMeaning?.meaning}}/>
            </Modal>
        </div>
    )
}

export default Notebook;