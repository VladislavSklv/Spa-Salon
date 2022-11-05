import React from 'react';
import { IFilteredSeances } from '../pages/DateAndTimePage';
import Seance from './Seance';

interface seancesListProps{
    filteredSeances: IFilteredSeances[];
    setTime: React.Dispatch<React.SetStateAction<string>>;
    time: string;
    date: string;
}

const SeancesList:React.FC<seancesListProps> = ({filteredSeances, setTime, time, date}) => {
    return (
        <>
            {filteredSeances.map(seanceBlock => 
                <div key={seanceBlock.partOfDay} className='seance'>
                    <h2 className="seance__title">{seanceBlock.partOfDay}</h2>
                    <ul className='seance__wrapper'>
                        {seanceBlock.seances.map(seance => 
                            <Seance key={seance.time} date={date} seance={seance} setTime={setTime} time={time}/>   
                        )}
                    </ul>
                </div>
            )}   
        </>
    );
};

export default SeancesList;