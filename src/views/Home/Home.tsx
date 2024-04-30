import React, {useState} from 'react';
import LetterBox, {LetterBoxSizes} from "../../components/LetterBox";
import NewGameModal from "../../components/Modals/NewGameModal";

const Home: React.FC = () => {
    const [newGameModal, setNewGameModal] = useState(false);

    return (
        <div className={'container-wrapper'}>
            <div className={'container'} style={{width: '300px'}}>
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
            <NewGameModal isOpen={newGameModal} onCloseModal={() => setNewGameModal(false)}></NewGameModal>
        </div>
    );
};

export default Home;
