import React from 'react';
import { IFilteredSeances } from '../pages/DateAndTimePage';

interface seancesListProps{
    filteredSeances: IFilteredSeances[];
    setTime: React.Dispatch<React.SetStateAction<string>>;
    time: string;
}

const SeancesList:React.FC<seancesListProps> = ({filteredSeances, setTime, time}) => {
    return (
        <>
            {filteredSeances.map(seanceBlock => 
                <div key={seanceBlock.partOfDay} className='seance'>
                    <h2 className="seance__title">{seanceBlock.partOfDay}</h2>
                    <ul className='seance__wrapper'>
                        {seanceBlock.seances.map(seance => 
                            <li key={seance.time} onClick={() => setTime(seance.time)} className={time === seance.time ? 'seance__item seance__item_active' : 'seance__item'}>{seance.time}</li>   
                        )}
                    </ul>
                </div>
            )}   
        </>
    );
};

export default SeancesList;