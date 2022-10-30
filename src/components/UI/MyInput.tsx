import React from 'react';

interface inputProps {
    placeholder: string;
    type: string;
    id: string;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

const MyInput:React.FC<inputProps> = ({id, inputValue, placeholder, setInputValue, type}) => {
    return (
        <div className='input__wrapper'>
            <input value={inputValue} onChange={e => setInputValue(e.target.value)} id={id} className='input' type={type} placeholder=" " />
            <label htmlFor={id} className='placeholder'>{placeholder}</label>
        </div>
    );
};

export default MyInput;