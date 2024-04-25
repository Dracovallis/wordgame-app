import React, {useEffect, useState} from "react";
import LetterBox, {LetterBoxSizes} from "../../components/LetterBox";
import {getListGames} from "../../services/Api";
import {getUserId} from "../../utilities/UUID";

const ListGames: React.FC = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        getListGames().then(resp => {
            setGames(resp.data.data ?? []);
        })
    }, [])

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {games.length > 0 && games.map((game: any) => {
                    return (
                        <a href={`./game/${game.game_id}`}>
                            <div style={{display: 'flex', gap: '2px'}}>
                                {(game.shuffled_letters).split('').map((letter: string) => {
                                    return <LetterBox width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL} letter={letter}/>
                                })}
                            </div>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

export default ListGames