import React, {useEffect, useState} from "react";
import {getListGames} from "../../services/Api";
import GameLink from "../../components/GameLink";
import {useUserId} from "../../context/UserContext";

const ListGames: React.FC = () => {
    const [games, setGames] = useState([]);
    const userId = useUserId();

    useEffect(() => {
        if (userId) {
            getListGames(userId).then(resp => {
                setGames(resp.data.data ?? []);
            })
        }
    }, [userId]);

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {games.length > 0 && games.map((game: any) => {
                    return <GameLink game={game}/>
                })}
            </div>
        </div>
    )
}

export default ListGames