import React, {useState} from "react";
import LetterBox, {LetterBoxSizes} from "./LetterBox";
import {useUserId} from "../context/UserContext";
import {FIVE_STAR_SCORE, GAME_TYPES} from "../constants/Constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faLevelDown, faTrophy, faUser} from "@fortawesome/free-solid-svg-icons";
import StarRating from "./StarRating";


type GameLinkProps = {
    game: any
}
const GameLink: React.FC<GameLinkProps> = ({game}: GameLinkProps) => {
    const userId = useUserId();
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

    const getGameTypeIcon = (type: string): React.ReactNode => {
        switch (type) {
            case GAME_TYPES.single_player: {
                return <FontAwesomeIcon icon={faUser}/>
            }
            case GAME_TYPES.daily: {
                return <FontAwesomeIcon icon={faTrophy}/>
            }
            default:
                return <><FontAwesomeIcon icon={faUser}/><FontAwesomeIcon icon={faUser}/></>
        }
    }

    const getGameScore = (type: string, score: { player: number, opponent: number }) => {
        switch (type) {
            case GAME_TYPES.single_player: {
                return <StarRating size={'xs'} rating={score.player} total={FIVE_STAR_SCORE}/>;
            }
            case GAME_TYPES.daily: {
                return <b>{`${score.player}`}</b>;
            }
            default:
                return <b>{`${score.player} vs ${score.opponent}`}</b>;
        }
    }

    return (
        <a href={`./game/${game.game_id}`} style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                {(game.shuffled_letters).split('').map((letter: string, index: number) => {
                    return <LetterBox width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}
                                      key={`${game.game_id}-${index}`}
                                      letter={letter}/>
                })}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between',  gap: '2px'}}>
                <LetterBox
                    width={LetterBoxSizes.BLOCK} height={LetterBoxSizes.SMALL}
                    letter={getGameTypeIcon(game.type)}
                />
                <LetterBox
                    width={LetterBoxSizes.BLOCK} height={LetterBoxSizes.SMALL} style={{padding: '0 8px'}}
                    letter={getGameScore(game.type, score)}
                />
                <LetterBox
                    width={LetterBoxSizes.BLOCK} height={LetterBoxSizes.SMALL} style={{padding: '0 8px'}}
                    letter={
                        <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                            <FontAwesomeIcon icon={faCalendar}/>{new Date(game.started).toISOString().split('T')[0]}
                        </div>}
                />
            </div>
        </a>
    )
}

export default GameLink;