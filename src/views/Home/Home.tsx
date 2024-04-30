import React, {useState} from 'react';
import LetterBox, {LetterBoxSizes} from "../../components/LetterBox";
import NewGameModal from "../../components/Modals/NewGameModal";

const Home: React.FC = () => {
    const [newGameModal, setNewGameModal] = useState(false);

    return (
        <div className={'container-wrapper'}>
            <div style={{width: '300px', height: '300px', display: 'flex', alignItems: 'center'}}>
                <div className={'container'}>
                    <LetterBox letter={'New Game'}
                               height={LetterBoxSizes.SMALL}
                               width={LetterBoxSizes.BLOCK}
                               onClick={() => setNewGameModal(true)}/>
                    <a href="./list">
                        <LetterBox letter={'Previous Games'}
                                   height={LetterBoxSizes.SMALL}
                                   width={LetterBoxSizes.BLOCK}
                        />
                    </a>
                </div>
            </div>
            <NewGameModal isOpen={newGameModal} onCloseModal={() => setNewGameModal(false)} ></NewGameModal>
        </div>
    );
};

export default Home;
