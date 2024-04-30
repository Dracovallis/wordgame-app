import React, {createContext, useContext, useEffect, useState} from 'react';
import {getUserId} from "../utilities/UUID";
import Modal from "../components/Modal";
import {getUserData, setUserData} from "../services/Api";
import LetterBox, {LetterBoxSizes} from "../components/LetterBox";

interface UserData {
    nickname?: string,
}

export const UserContext = createContext<{
    userId: string | undefined,
    userData: UserData | undefined
} | undefined>(undefined);

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}: UserProviderProps) => {
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [playerData, setPlayerData] = useState<UserData | undefined>();
    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        async function loadUserId() {
            const id = await getUserId();
            setUserId(id);

            getUserData(id).then((resp) => {
                setPlayerData(resp.data.data);

                if (!resp.data?.data?.nickname) {
                    setNicknameModalOpen(true);
                }
            });
        }

        loadUserId();
    }, []);

    const updateUserData = () => {
        if (userId) {
            setUserData(userId, nickname).then(resp => {
                setPlayerData(resp.data.data);
                setNicknameModalOpen(false);
            });
        }
    }

    useEffect(() => {
        if (playerData?.nickname) {
            setNickname(playerData?.nickname);
        }
    }, [playerData])

    return (
        <UserContext.Provider value={{userId, userData: playerData}}>
            {children}
            <Modal isOpen={nicknameModalOpen && !!userId}
                   title={'Nickname'}
                   onCloseModal={() => setNicknameModalOpen(false)}>
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
        </UserContext.Provider>
    );
};

export const useUserId = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserId must be used within a UserProvider');
    }
    return context.userId;
};

export const useUserData = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserId must be used within a UserProvider');
    }
    return context.userData;
}
