import React, {useEffect, useRef, useState} from "react";
import {GuessedWords} from "../types/Types";
import {Scrollbars} from 'react-custom-scrollbars';
import {getWordMeaning} from "../services/Api";
import Modal from "./Modal";
import LetterBox, {LetterBoxSizes} from "./LetterBox";
import Swal from 'sweetalert2';
import {useUserData} from "../context/UserContext";

type WordRefs = {
    [key: string]: HTMLTableRowElement | null;
};
type NotebookProps = {
    guessedWords: GuessedWords,
    guessedWordsOpponent: GuessedWords,
    opponentNickname?: string,
    highlightedWord?: string,
}
const Notebook: React.FC<NotebookProps> = ({guessedWords, guessedWordsOpponent, opponentNickname, highlightedWord}: NotebookProps) => {
    const [totalScore, setTotalScore] = useState(0);
    const [totalScoreOpponent, setTotalScoreOpponent] = useState(0);
    const [wordMeaning, setWordMeaning] = useState<{ word: string, meaning: string }>({word: '', meaning: ''})
    const [inviteFriendModalOpen, setInviteFriendModalOpen] = useState(false);
    const playerNickname = useUserData()?.nickname;
    const isMultiplayer = guessedWordsOpponent.length > 0;
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

    useEffect(() => {
        if (Array.isArray(guessedWords)) {
            setTotalScore(guessedWords.reduce((accumulator, item) => accumulator + item.score, 0));
        }
        if (Array.isArray(guessedWordsOpponent)) {
            setTotalScoreOpponent(guessedWordsOpponent.reduce((accumulator, item) => accumulator + item.score, 0));
        }
    }, [guessedWords, guessedWordsOpponent]);

    return (
        <div style={{margin: '0px 20px 70px 20px'}}>
            <div className="notebook">
                <div className={'page-header'}>{playerNickname ?? 'You'}</div>
                <div className="page left-page">
                    <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                        <div>Word</div>
                        <div>Score</div>
                    </div>
                    <div style={{width: '100%', height: '85%'}}>
                        <Scrollbars>
                            {guessedWords.length > 0 &&
                                <table style={{position: 'sticky', overflow: 'hidden'}}>
                                    <tbody>
                                    {guessedWords.map(el => {
                                        return <tr onClick={() => searchForWordMeaning(el.word)} ref={ref => wordRefs.current[el.word] = ref}
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
                {isMultiplayer && <div className={'page-header opponent'}>{opponentNickname ?? 'Opponent'}</div>}
                <div className="page right-page">
                    {!isMultiplayer &&
                        <div style={{position: 'sticky', padding: '10px'}}>
                            <LetterBox letter={'Invite a friend'}
                                       width={LetterBoxSizes.BLOCK}
                                       height={LetterBoxSizes.SMALL}
                                       onClick={() => setInviteFriendModalOpen(true)}
                            />
                        </div>
                    }
                    {isMultiplayer &&
                        <>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                                <div>Word</div>
                                <div>Score</div>
                            </div>
                            <div style={{width: '100%', height: '85%'}}>
                                <Scrollbars>
                                    <table style={{position: 'sticky'}}>
                                        <tbody>
                                        {guessedWordsOpponent.map(el => {
                                            return <tr onClick={() => searchForWordMeaning(el.word)} ref={ref => wordRefs.current[el.word] = ref}
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
                </div>
            </div>
            <Modal isOpen={inviteFriendModalOpen} onCloseModal={() => setInviteFriendModalOpen(false)}
                   title={'Invite a friend'}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '10px'}}>
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