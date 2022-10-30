import React from 'react';

interface myCheckboxProps{
    inputName: string;
    forId: string;
    id: string;
    children: React.ReactNode;
    onClickHandler?: () => void
}

const MyCheckbox:React.FC<myCheckboxProps> = ({forId, id, inputName, children, onClickHandler}) => {
    return (
        <>
            <input 
                type='checkbox'
                className='custom-checkbox'
                name={inputName}
                id={forId}
                value={id}
                onClick={() => onClickHandler && onClickHandler()}
            />
            <label htmlFor={forId}>{children}</label>  
        </>
    );
};

export default MyCheckbox;