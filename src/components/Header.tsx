import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import LetterBox, {LetterBoxSizes} from "./LetterBox";
import HamburgerIcon from "./HamburgerMenu/HamburgerIcon";
import Menu from "./HamburgerMenu/Menu";

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header>
            <div className={'header-wrapper'}>
                <Link to="/" className={'logo'}>
                    <LetterBox letter={'P'} width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}/>
                    <LetterBox letter={'I'} width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}/>
                    <LetterBox letter={'K'} width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}/>
                    <LetterBox letter={'A'} width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}/>
                    <LetterBox letter={'M'} width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}/>
                    <LetterBox letter={'I'} width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}/>
                    <LetterBox letter={'.'} width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}/>
                    <LetterBox letter={'S'} width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}/>
                    <LetterBox letter={'E'} width={LetterBoxSizes.SMALL} height={LetterBoxSizes.SMALL}/>
                </Link>
                <div>
                    <HamburgerIcon toggleMenu={toggleMenu}/>

                </div>
            </div>
            <Menu isOpen={menuOpen} toggleMenu={toggleMenu} />
        </header>
    );
};

export default Header;
