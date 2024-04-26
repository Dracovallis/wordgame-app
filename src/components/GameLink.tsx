import React, {useState} from "react";
import LetterBox, {LetterBoxSizes} from "./LetterBox";
import {getUserId} from "../utilities/UUID";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan, faTrophy} from "@fortawesome/free-solid-svg-icons";

type GameLinkProps = {
    game: any
}
const GameLink: React.FC<GameLinkProps> = ({game}: GameLinkProps) => {
    const userId = getUserId();
    const calculateGameScore = (game: any) => {
        return game.guessed_words.reduce((accumulator: { player: number; opponent: number }, guessedWord: any) => {
            if (guessedWord.player_id === userId) {
                accumulator.player += parseInt(guessedWord.score, 10) || 0;
            } else {
                accumulator.opponent += parseInt(guessedWord.score, 10) || 0;
            }
            return accumulator;
        }, {player: 0, opponent: 0});
    };
    const [score, setScore] = useState<{ player: number, opponent: number }>(() => calculateGameScore(game));

    return (
        <a href={`./game/${game.game_id}`} style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
            <div style={{display: 'flex', gap: '2px'}}>
                {(game.shuffled_letters).split('').map((letter: string) => {
                    return <LetterBox width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}
                                      letter={letter}/>
                })}
            </div>
            <LetterBox
                letter={
                    <>
                        <b>{`${score.player} vs ${score.opponent}`}</b>

                        <i> {`${new Date(game.started).toISOString().split('T')[0]}`}</i>
                    </>
                }
                width={LetterBoxSizes.BLOCK} height={LetterBoxSizes.SMALL}/>
        </a>
    )
}

export default GameLink;