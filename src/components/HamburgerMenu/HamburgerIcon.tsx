import React from 'react';

interface HamburgerIconProps {
    toggleMenu: () => void;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({toggleMenu}) => {
    return (
        <div onClick={toggleMenu} className="hamburger-icon">
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default HamburgerIcon;
