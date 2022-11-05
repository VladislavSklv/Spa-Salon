import React, { useEffect, useState } from 'react';
import { ISeance, useGetDatesQuery, useLazyGetSeancesQuery } from '../api/mainApi';
import ErrorBlock from '../components/ErrorBlock';
import Loader from '../components/Loader';
import DatesBlock from '../components/DatesBlock';
import SeancesList from '../components/SeancesList';
import { useAppSelector } from '../hooks/hooks';

interface dateAndTimePageProps {
    companyId: string;
}

export interface IFilteredSeances {
    partOfDay: string;
    seances: ISeance[];
}

interface IDay {
    weekDay: string;
    day: string;
    date: string; /* Y-M-D */
}

export interface datesObj {
    month: string; /* Month */
    days: IDay[];
}

const DateAndTimePage: React.FC<dateAndTimePageProps> = ({companyId}) => {
    const {data: dates, isLoading, isFetching, isError} = useGetDatesQuery({companyId});
    const [months, setMonths] = useState<datesObj[]>([]);
    const [date, setDate] = useState(dates !== undefined ? dates.bookingDates[0] : '');
    const [time, setTime] = useState('');
    const [filteredSeances, setFilteredSeances] = useState<IFilteredSeances[]>();
    const [triggerSeances, {data: seances, isError: isSeancesError, isLoading: isSeancesLoading, isFetching: isSeancesFetching}] = useLazyGetSeancesQuery();
    
    const {date: chosenDate, time: chosenTime} = useAppSelector(state => state.mainSlice.dateAndTime); 

    useEffect(() => {
        if(chosenDate !== '' && date !== chosenDate) setDate(chosenDate);
    }, [chosenDate]);

    /* Splitting seances by part of a day */
    const checkPartOfaDay = ({part, thisSeances, seance}: {part: string; thisSeances: IFilteredSeances[]; seance: ISeance}) => {
        let checker = true;
        thisSeances.forEach(thisSeance => {
            if(thisSeance.partOfDay === part) {
                thisSeance.seances.push(seance);
                checker = false;
            }
        })
        if(checker) thisSeances.push({partOfDay: part, seances: [seance]});
    };

    useEffect(() => {
        if(seances !== undefined){
            let thisSeances: IFilteredSeances[] = [];
            seances.map(seance => {
                if(parseInt(seance.time.split(':')[0]) >= 5 && parseInt(seance.time.split(':')[0]) < 12) checkPartOfaDay({part: 'Утро', seance, thisSeances});
                else if(parseInt(seance.time.split(':')[0]) >= 12 && parseInt(seance.time.split(':')[0]) < 17) checkPartOfaDay({part: 'День', seance, thisSeances});
                else if(parseInt(seance.time.split(':')[0]) >= 17 && parseInt(seance.time.split(':')[0]) < 24) checkPartOfaDay({part: 'Вечер', seance, thisSeances});
                else if(parseInt(seance.time.split(':')[0]) >= 0 && parseInt(seance.time.split(':')[0]) < 5) checkPartOfaDay({part: 'Ночь', seance, thisSeances});
            });
            setFilteredSeances(thisSeances);
        }
    }, [seances]);

    useEffect(() => {
        if(date.length > 0) triggerSeances({companyId, date});
    }, [date]);

    /* useEffect(() => {
        if(dates !== undefined && !isLoading && !isFetching) setDate(dates.bookingDates[0]);
    }, [isLoading, isFetching]); */

    useEffect(() => {
        if(dates !== undefined){
            let thisMonths: datesObj[] = [];
            dates.bookingDates.forEach(bookingDate => {
                let date = new Date(bookingDate);
                let checker = true;
                thisMonths.forEach(month => {
                    if(checker && month.month === date.toLocaleString('ru-RU', {month: 'long'})){
                        month.days.push({date: bookingDate, day: date.getDate().toLocaleString(), weekDay: date.toLocaleString('ru-RU', {weekday: 'short'})});
                        checker = false;
                    }
                })
                if(checker) {
                    thisMonths.push({
                        month: date.toLocaleString('ru-RU', {month: 'long'}),
                        days: [{date: bookingDate, day: date.getDate().toLocaleString(), weekDay: date.toLocaleString('ru-RU', {weekday: 'short'})}]
                    });
                }
            });
            setMonths(thisMonths);
        }
    }, [dates]);

    return (
        <>
            {isError && <ErrorBlock/>}
            {(isLoading && isFetching) && <Loader/>}
            {dates !== undefined &&
                <div className='dates-seances'>
                    {months.length > 0 &&
                        <>
                            <DatesBlock date={date} months={months} setTime={setTime} setDate={setDate}/>
                            <div className='dates-seances__seances'>
                                {isSeancesError && <ErrorBlock/>}
                                {(isSeancesLoading || isSeancesFetching) && <Loader/>}
                                {filteredSeances !== undefined && filteredSeances.length > 0 && date.length > 0 &&
                                    <SeancesList date={date} setTime={setTime} time={time} filteredSeances={filteredSeances}/>
                                }
                            </div>
                        </>  
                    }
                </div>
            }
        </>
    );
};

export default DateAndTimePage;