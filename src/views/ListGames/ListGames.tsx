import React, {useEffect, useState} from "react";
import {getListGames} from "../../services/Api";
import GameLink from "../../components/GameLink";
import {useUserId} from "../../context/UserContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import {Scrollbars} from "react-custom-scrollbars";
import LetterBox, {LetterBoxSizes} from "../../components/LetterBox";

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
        <div className={'container-wrapper'}>
            <div className={'container center'}>
                <LetterBox letter={'Previous Games'} width={LetterBoxSizes.BLOCK} height={LetterBoxSizes.SMALL} />
                {isLoading && <div className={'game-loading-wrapper'}>
                    <LoadingSpinner></LoadingSpinner>
                </div>}
                <div className={'container'} style={{width: '300px', height: '600px'}}>
                    <Scrollbars>
                        <div className={'container'}>
                            {games.length > 0 && games.map((game: any, index) => {
                                return <GameLink game={game} key={index}/>
                            })}
                        </div>
                    </Scrollbars>
                </div>

            </div>
        </div>
    )
}

export default ListGames