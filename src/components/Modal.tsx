import React from 'react';
import {Scrollbars} from "react-custom-scrollbars";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LetterBox, {LetterBoxSizes} from "./LetterBox";

type ModalProps = {
    isOpen: boolean,
    onCloseModal: () => void,
    children: React.ReactNode,
    footer?: React.ReactNode,
    title?: string,
}
const Modal: React.FC<ModalProps> = ({isOpen, onCloseModal, children, title, footer}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={'modal modal-wrapper'} onClick={onCloseModal}>
            <div className={'modal modal-content'} onClick={e => e.stopPropagation()}>
                <div className={'modal modal-header'}>
                    <h3>{title}</h3>
                    <LetterBox letter={<FontAwesomeIcon size={'xs'} icon={faClose}></FontAwesomeIcon>}
                               width={LetterBoxSizes.SMALL}
                               height={LetterBoxSizes.SMALL}
                               onClick={onCloseModal}
                    />
                </div>
                <hr/>
                <div className={'modal modal-body'}>
                    <Scrollbars>
                        {children}
                    </Scrollbars>
                </div>
                <hr/>
                {footer && <div className={'modal modal-footer'}>
                    {footer}
                </div>}
            </div>
        </div>
    );
};

export default Modal;
