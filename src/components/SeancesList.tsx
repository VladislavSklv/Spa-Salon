import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { IFilteredSeances } from '../pages/DateAndTimePage';
import { IDateAndTime } from '../redux/redux';
import Seance from './Seance';

interface seancesListProps{
    chosenDateAndTime: IDateAndTime;
    setChosenDateAndTime: React.Dispatch<React.SetStateAction<IDateAndTime>>;
    filteredSeances: IFilteredSeances[];
    setTime: React.Dispatch<React.SetStateAction<string>>;
    time: string;
    date: string;
}

const SeancesList:React.FC<seancesListProps> = ({filteredSeances, setTime, time, date, chosenDateAndTime, setChosenDateAndTime}) => {
    return (
        <>
            {filteredSeances.map(seanceBlock => 
                <div key={seanceBlock.partOfDay} className='seance'>
                    <h2 className="seance__title">{seanceBlock.partOfDay}</h2>
                    <ul className='seance__wrapper'>
                        {seanceBlock.seances.map(seance => 
                            <Seance key={seance.time} setChosenDateAndTime={setChosenDateAndTime} chosenDateAndTime={chosenDateAndTime} date={date} seance={seance} setTime={setTime} time={time}/>
                        )}
                    </ul>
                </div>
            )}   
        </>
    );
};

export default SeancesList;