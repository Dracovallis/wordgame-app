import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarO } from '@fortawesome/free-regular-svg-icons';
import {SizeProp} from "@fortawesome/fontawesome-svg-core";

interface StarRatingProps {
    rating: number;
    total: number;
    size?: SizeProp
}

const StarRating: React.FC<StarRatingProps> = ({ rating, total, size }) => {
    const normalizedRating = (rating / total) * 5;
    const fullStars = Math.floor(normalizedRating);
    const halfStar = (normalizedRating % 1) >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
        <div>
            <style>
                {`
                    @keyframes pop {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.3); }
                        100% { transform: scale(1); }
                    }
                    .pop-animation {
                        animation: pop 0.5s ease;
                    }
                `}
            </style>
            {Array.from({ length: fullStars }).map((_, index) => (
                <FontAwesomeIcon size={size} key={`full-${index}`} icon={faStar} className="pop-animation" />
            ))}
            {halfStar > 0 && <FontAwesomeIcon size={size} icon={faStarHalfStroke} />}
            {Array.from({ length: emptyStars }).map((_, index) => (
                <FontAwesomeIcon size={size} key={`empty-${index}`} icon={faStarO} />
            ))}
        </div>
    );
}

export default StarRating;
