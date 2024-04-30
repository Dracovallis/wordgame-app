import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {createGame, setUserData} from "../../services/Api";
import LetterBox, {LetterBoxSizes} from "../LetterBox";
import Modal from "../Modal";
import {useUserData, useUserId} from "../../context/UserContext";
import NewGameModal from "../Modals/NewGameModal";

interface MenuProps {
    isOpen: boolean;
    toggleMenu: () => void;  // Added to close the menu
}

const Menu: React.FC<MenuProps> = ({isOpen, toggleMenu}) => {
    const [changeNicknameModal, setChangeNicknameModal] = useState(false);
    const userData = useUserData();
    const [nickname, setNickname] = useState<string | undefined>();
    const userId = useUserId();
    const [newGameModal, setNewGameModal] = useState(false);

    useEffect(() => {
        setNickname(userData?.nickname);
    }, [userData])


    const updateUserData = () => {
        if (userId && nickname) {
            setUserData(userId, nickname).then(resp => {
                setChangeNicknameModal(false);
                window.location.reload();

            });
        }
    }

    return (
        <>
            {isOpen && <div className={'menu-wrapper'} onClick={toggleMenu}>
                <div className="menu">
                    <ul>
                        <div style={{fontWeight: 'bold', color: 'black', marginBottom: '5px'}}>{nickname}</div>
                        <hr/>
                        <a href="#" onClick={() => {
                            setNewGameModal(true);
                            toggleMenu();
                        }}>
                            <li>New Game</li>
                        </a>
                        <a href="/list" onClick={toggleMenu}>
                            <li>Previous Games</li>
                        </a>
                        <a href="#" onClick={() => {
                            setChangeNicknameModal(true);
                        }}>
                            <li>Settings</li>
                        </a>
                    </ul>
                </div>
            </div>}
            <Modal isOpen={changeNicknameModal}
                   title={'Nickname'}
                   onCloseModal={() => setChangeNicknameModal(false)}>
                <div className={'container'}>
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
            <NewGameModal isOpen={newGameModal} onCloseModal={() => setNewGameModal(false)}/>
        </>
    );
};

export default Menu;
