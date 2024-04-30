import React from "react";
import Modal from "../Modal";
import LetterBox, {LetterBoxSizes} from "../LetterBox";
import {useNavigate} from "react-router-dom";
import {createGame} from "../../services/Api";
import {GAME_TYPES} from "../../constants/Constants";

type NewGameModalProps = {
    isOpen: boolean,
    onCloseModal: () => void
}
const NewGameModal: React.FC<NewGameModalProps> = ({isOpen, onCloseModal}: NewGameModalProps) => {
    const navigate = useNavigate();

    const startGame = (type: string) => {
        createGame(type)
            .then(resp => {
                if (resp.data.data.game_id) {
                    navigate(`/game/${resp.data.data.game_id}`);
                    window.location.reload();
                } else {
                    alert('Failed to start a new game. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error starting new game:', error);
                alert('An error occurred. Please try again.');
            });
    };


    return (
        <Modal isOpen={isOpen} onCloseModal={onCloseModal} title={'New Game'}>
            <div className={'container'}>
                <div>
                    <LetterBox letter={'Daily Challenge'}
                               width={LetterBoxSizes.BLOCK}
                               height={LetterBoxSizes.SMALL}
                               onClick={() => startGame(GAME_TYPES.daily)}
                    />
                    <i>Play alone</i>
                </div>
                <div>
                    <LetterBox letter={'Single Player'}
                               width={LetterBoxSizes.BLOCK}
                               height={LetterBoxSizes.SMALL}
                               onClick={() => startGame(GAME_TYPES.single_player)}
                    />
                    <i>Play alone</i>
                </div>
                <div>
                    <LetterBox letter={'Multiplayer'}
                               width={LetterBoxSizes.BLOCK}
                               height={LetterBoxSizes.SMALL}
                               onClick={() => startGame(GAME_TYPES.multiplayer)}
                    />
                    <i>Send a link to a friend</i>
                </div>
            </div>
        </Modal>)
}

export default NewGameModal;