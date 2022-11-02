import React from 'react';

interface myButtonProps {
    isMinus: boolean;
    onClickHandler: () => void;
}

const MyButton:React.FC<myButtonProps> = ({isMinus, onClickHandler}) => {
    return (
        <button 
            className={isMinus ? "button button_minus" : "button button_plus"}
            onClick={(e) => {
                e.stopPropagation();
                onClickHandler();
            }}
        ><span></span><span></span></button>
    );
};

export default MyButton;