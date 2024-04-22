import React, {useEffect, useState} from "react";
import {GuessedWords} from "../types/Types";
import {Scrollbars} from 'react-custom-scrollbars';
import {fetchWordMeaningChitanka} from "../services/Api";
import {parseWordMeaningFromChitanka} from "../helpers/Functions";

type NotebookProps = {
    guessedWords: GuessedWords
}
const Notebook: React.FC<NotebookProps> = ({guessedWords}: NotebookProps) => {
    const [totalScore, setTotalScore] = useState(0);
    const [wordMeaning, setWordMeaning] = useState<{ word: string, meaning: string }>({word: '', meaning: ''})

    const searchForWordMeaning = (word: string) => {
        if (wordMeaning?.word === word) {
            return;
        }
        fetchWordMeaning(word);
    }

    const fetchWordMeaning = async (word: string) => {

        fetchWordMeaningChitanka(word).then(resp => {
            const cleanHTML = parseWordMeaningFromChitanka(resp.data);
            if (cleanHTML) {
                setWordMeaning({word: word, meaning: cleanHTML});
            }
        })
    };


    useEffect(() => {
        setTotalScore(guessedWords.reduce((accumulator, item) => accumulator + item.score, 0));
    }, [guessedWords]);

    return (
        <div style={{margin: '0 20px'}}>
            <div className="notebook">
                <div className="page left-page">
                    <Scrollbars>
                        <div className={'page-rows'}>
                            <hr/>
                            <hr/>
                            <hr/>
                            <hr/>
                            <hr/>
                            <hr/>
                            <hr/>
                            <hr/>
                            <hr/>
                        </div>
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
                        </table>
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
                        {wordMeaning?.word &&
                            <div style={{position: 'sticky', lineHeight: '26px'}}>
                                <div style={{fontWeight: 'bold'}}>{wordMeaning?.word}</div>
                                <div dangerouslySetInnerHTML={{__html: wordMeaning?.meaning}}/>
                                <div>
                                    <a href={`https://rechnik.chitanka.info/w/${encodeURIComponent(wordMeaning?.word)}`}
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