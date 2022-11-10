import React, { useEffect } from 'react';
import { ISeance } from '../api/mainApi';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { setDateAndTime } from '../redux/redux';

interface seanceProps{
    seance: ISeance;
    setTime: React.Dispatch<React.SetStateAction<string>>;
    time: string;
    date: string;
}

const Seance: React.FC<seanceProps> = ({date, seance, setTime, time}) => {

    const dispatch = useAppDispatch();
    const {dateAndTime} = useAppSelector(state => state.mainSlice);

    useEffect(() => {
        if(date === dateAndTime.date && seance.time === dateAndTime.time) setTime(seance.time);
    }, [dateAndTime]);

    return (
        <li 
            key={seance.time} 
            onClick={() => {
                setTime(seance.time);
                dispatch(setDateAndTime({time: seance.time, date}))
            }} 
            className={(time === seance.time && date === dateAndTime.date) ? 'seance__item seance__item_active' : 'seance__item'}
        >{seance.time}</li>   
    );
};

export default Seance;