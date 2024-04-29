import React, {useEffect, useState} from "react";
import {getListGames} from "../../services/Api";
import GameLink from "../../components/GameLink";
import {useUserId} from "../../context/UserContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const ListGames: React.FC = () => {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const userId = useUserId();

    useEffect(() => {
        if (userId) {
            setIsLoading(true);
            getListGames(userId).then(resp => {
                setGames(resp.data.data ?? []);
                setIsLoading(false)
            });
        }
    }, [userId]);

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {isLoading && <div className={'game-loading-wrapper'}>
                    <LoadingSpinner></LoadingSpinner>
                </div>}
                {games.length > 0 && games.map((game: any) => {
                    return <GameLink game={game}/>
                })}
            </div>
        </div>
    )
}

export default ListGames