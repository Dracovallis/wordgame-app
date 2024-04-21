import React, {useEffect, useState} from "react";
import {GuessedWords} from "../types/Types";

type NotebookProps = {
    guessedWords: GuessedWords
}
const Notebook: React.FC<NotebookProps> = ({guessedWords}: NotebookProps) => {
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
        setTotalScore(guessedWords.reduce((accumulator, item) => accumulator + item.score, 0));
    }, [guessedWords]);

    return (
        <div className="notebook">
            <div className="page left-page">
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
                <table>
                    <tbody>
                    <tr>
                        <th>Word</th>
                        <th>Score</th>
                    </tr>
                    {guessedWords.map(el => {
                        return <tr>
                            <td>{el.word}</td>
                            <td>{el.score}</td>
                        </tr>
                    })}
                    <tr>
                        <th>Total</th>
                        <th>{totalScore}</th>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="page right-page">
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
                {/*<p>More text here...</p>*/}
            </div>
        </div>
    )
}

export default Notebook;