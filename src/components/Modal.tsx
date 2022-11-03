import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

interface modalProps {
    children: React.ReactNode;
    isOpened: boolean;
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<modalProps> = ({children, isOpened, setIsOpacity, setIsOpened}) => {
    const [isScrolledTop, setIsScrolledTop] = useState(true);
    const [isSwiped, setIsSwiped] = useState(true);

    /* Swipe Handlers */
    const handlers = useSwipeable({
        onSwipedDown: () =>{
            if(isScrolledTop){
                setIsSwiped(true);
                if(isSwiped){
                    setIsOpened(false);
                    setIsOpacity(false);
                }
            }
        }
    })

    return (
        <div
            data-scroll-lock-scrollable
            {...handlers}
            onScroll={(e: any) => {
                if(e.target.scrollTop === 0) {
                    setIsScrolledTop(true);
                }
                else {
                    setIsScrolledTop(false);
                    setIsSwiped(false);
                };
            }}
            style={isOpened ? {transform: 'none'} : {transform: 'translateY(250%)'}} 
            className='modal'
        >
            {children}
        </div>
    );
};

export default Modal;