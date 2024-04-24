import React, {useEffect, useState} from "react";
import {GuessedWords} from "../types/Types";
import {Scrollbars} from 'react-custom-scrollbars';
import {getWordMeaning} from "../services/Api";


type NotebookProps = {
    guessedWords: GuessedWords,
    guessedWordsOpponent: GuessedWords,
}
const Notebook: React.FC<NotebookProps> = ({guessedWords, guessedWordsOpponent}: NotebookProps) => {
    const [totalScore, setTotalScore] = useState(0);
    const [totalScoreOpponent, setTotalScoreOpponent] = useState(0);
    const [wordMeaning, setWordMeaning] = useState<{ word: string, meaning: string }>({word: '', meaning: ''})

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

    useEffect(() => {
        setTotalScore(guessedWords.reduce((accumulator, item) => accumulator + item.score, 0));
        setTotalScoreOpponent(guessedWordsOpponent.reduce((accumulator, item) => accumulator + item.score, 0));
    }, [guessedWords, guessedWordsOpponent]);

    return (
        <div style={{margin: '0px 20px 70px 20px'}}>
            <div className="notebook">
                <div className="page left-page">
                    <Scrollbars>
                        <div className={'page-rows'}>
                            {/*<hr/>*/}
                            {/*<hr/>*/}
                            {/*<hr/>*/}
                            {/*<hr/>*/}
                            {/*<hr/>*/}
                            {/*<hr/>*/}
                            {/*<hr/>*/}
                            {/*<hr/>*/}
                            {/*<hr/>*/}
                        </div>
                        <div style={{fontWeight: 'bold'}}>Your score</div>
                        {guessedWords.length > 0 &&
                            <table style={{position: 'sticky'}}>
                                <tbody>
                                <tr>
                                    <th>Word</th>
                                    <th>Score</th>
                                </tr>
                                {guessedWords.map(el => {
                                    return <tr onClick={() => searchForWordMeaning(el.word)}>
                                        <td style={{cursor: 'pointer'}}>{el.word}</td>
                                        <td>{el.score}</td>
                                    </tr>
                                })}
                                <tr>
                                    <th>Total</th>
                                    <th>{totalScore}</th>
                                </tr>
                                </tbody>
                            </table>}
                    </Scrollbars>
                </div>
                <div className="page right-page">
                    <Scrollbars>
                        {/*<div className={'page-rows'}>*/}
                        {/*    <hr/>*/}
                        {/*    <hr/>*/}
                        {/*    <hr/>*/}
                        {/*    <hr/>*/}
                        {/*    <hr/>*/}
                        {/*    <hr/>*/}
                        {/*    <hr/>*/}
                        {/*    <hr/>*/}
                        {/*    <hr/>*/}
                        {/*</div>*/}
                        <div style={{fontWeight: 'bold'}}>Opponent</div>
                        {guessedWordsOpponent.length > 0 &&
                            <table style={{position: 'sticky'}}>
                                <tbody>
                                <tr>
                                    <th>Word</th>
                                    <th>Score</th>
                                </tr>
                                {guessedWordsOpponent.map(el => {
                                    return <tr onClick={() => searchForWordMeaning(el.word)}>
                                        <td style={{cursor: 'pointer'}}>{el.word}</td>
                                        <td>{el.score}</td>
                                    </tr>
                                })}
                                <tr>
                                    <th>Total</th>
                                    <th>{totalScoreOpponent}</th>
                                </tr>
                                </tbody>
                            </table>}


                        {wordMeaning?.word &&
                            <div style={{position: 'sticky', lineHeight: '26px'}}>
                                {totalScoreOpponent > 0 && <hr/>}
                                <div style={{fontWeight: 'bold'}}>{wordMeaning?.word}</div>
                                <div dangerouslySetInnerHTML={{__html: wordMeaning?.meaning}}/>
                                <div>
                                    <a href={`http://rechnik.info/${encodeURIComponent(wordMeaning?.word)}`}
                                       target={'_blank'}>
                                        Go to definition
                                    </a>
                                </div>
                            </div>
                        }
                    </Scrollbars>
                </div>
            </div>
        </div>
    )
}

export default Notebook;