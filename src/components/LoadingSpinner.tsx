import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

type LoadingSpinnerProps = {
    size?: number
}
const LoadingSpinner: React.FC = () => {
    return (
        <FontAwesomeIcon className={'loading-spinner'}
                         size={'10x'}
                         icon={faSpinner}></FontAwesomeIcon>
    );
}

export default LoadingSpinner;