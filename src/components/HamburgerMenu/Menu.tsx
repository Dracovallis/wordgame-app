import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {createGame, setUserData} from "../../services/Api";
import LetterBox, {LetterBoxSizes} from "../LetterBox";
import Modal from "../Modal";
import {useUserData, useUserId} from "../../context/UserContext";

interface MenuProps {
    isOpen: boolean;
    toggleMenu: () => void;  // Added to close the menu
}

const Menu: React.FC<MenuProps> = ({isOpen, toggleMenu}) => {
    const [changeNicknameModal, setChangeNicknameModal] = useState(false);
    const navigate = useNavigate();
    const userData = useUserData();
    const [nickname, setNickname] = useState<string | undefined>();
    const userId = useUserId();


    useEffect(() => {
        setNickname(userData?.nickname);
    }, [userData])

    if (!isOpen) return null;

    const updateUserData = () => {
        if (userId && nickname) {
            setUserData(userId, nickname).then(resp => {
                setChangeNicknameModal(false);
                window.location.reload();

            });
        }
    }

    const startGame = () => {
        createGame()
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

        toggleMenu();
    };

    return (
        <>
            <div className="menu">
                <ul>
                    <div style={{fontWeight: 'bold', color: 'black'}}>{nickname}</div>
                    <a href="#" onClick={startGame}>
                        <li>New Game</li>
                    </a>
                    <a href="/list" onClick={toggleMenu}>
                        <li>List</li>
                    </a>
                    <a href="#" onClick={() => setChangeNicknameModal(true)}>
                        <li>Settings</li>
                    </a>
                </ul>


            </div>

            <Modal isOpen={changeNicknameModal}
                   title={'Nickname'}
                   onCloseModal={() => setChangeNicknameModal(false)}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <h4 style={{marginBottom: 0}}>Give yourself a fancy nickname</h4>
                    <input type="text"
                           value={nickname}
                           placeholder={'PussyDestroyer'}
                           onChange={(event) => {
                               if (event.target.value.length > 15) {
                                   return;
                               }
                               setNickname(event.target.value)
                           }}/>
                    <LetterBox letter={'Save'}
                               width={LetterBoxSizes.BLOCK}
                               height={LetterBoxSizes.SMALL}
                               onClick={updateUserData}/>
                </div>

            </Modal>
        </>
    );
};

export default Menu;
