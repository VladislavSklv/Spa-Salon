import React, { useEffect } from 'react';
import { ISeance } from '../api/mainApi';
import { IDateAndTime } from '../redux/redux';

interface seanceProps{
    setChosenDateAndTime: React.Dispatch<React.SetStateAction<IDateAndTime>>;
    seance: ISeance;
    chosenDateAndTime: IDateAndTime;
    setTime: React.Dispatch<React.SetStateAction<string>>;
    time: string;
    date: string;
}

const Seance: React.FC<seanceProps> = ({date, seance, setTime, time, chosenDateAndTime, setChosenDateAndTime}) => {

    useEffect(() => {
        if(date === chosenDateAndTime.date && seance.time === chosenDateAndTime.time) setTime(seance.time);
    }, [chosenDateAndTime, date]);

    return (
        <li 
            key={seance.time} 
            onClick={() => {
                setTime(seance.time);
                setChosenDateAndTime({time: seance.time, date});
            }} 
            className={(time === seance.time && date === chosenDateAndTime.date) ? 'seance__item seance__item_active' : 'seance__item'}
        >{seance.time}</li>   
    );
};

export default Seance;