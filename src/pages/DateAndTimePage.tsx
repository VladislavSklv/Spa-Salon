import React, { useEffect, useState } from 'react';
import { ISeance, useGetDatesQuery, useLazyGetSeancesQuery } from '../api/mainApi';
import ErrorBlock from '../components/ErrorBlock';
import Loader from '../components/Loader';
import DatesBlock from '../components/DatesBlock';
import SeancesList from '../components/SeancesList';
import { useAppSelector, useTransformFormatOfDates } from '../hooks/hooks';
import { useNavigate } from 'react-router-dom';

interface dateAndTimePageProps {
    companyId: string;
    isDate: boolean;
    setIsDate: React.Dispatch<React.SetStateAction<boolean>>;
    firstOpened: boolean;
    setFirstOpened: React.Dispatch<React.SetStateAction<boolean>>;
    initialMonth: string;
}

export interface IFilteredSeances {
    partOfDay: string;
    seances: ISeance[];
}

interface IDay {
    weekDay: string;
    day: string;
    date: string; /* Y-M-D */
    isActive: boolean;
}

export interface datesObj {
    month: string; /* Month */
    days: IDay[];
}

const DateAndTimePage: React.FC<dateAndTimePageProps> = ({companyId, isDate, setIsDate, firstOpened, setFirstOpened, initialMonth}) => {
    const {data: dates, isLoading, isFetching, isError} = useGetDatesQuery({companyId});
    const [months, setMonths] = useState<datesObj[]>([]);
    const [indexOfMonths, setIndexOfMonths] = useState(0);
    const [date, setDate] = useState(dates !== undefined ? dates.bookingDates[0] : '');
    const [time, setTime] = useState('');
    const [filteredSeances, setFilteredSeances] = useState<IFilteredSeances[]>();
    const [triggerSeances, {data: seances, isError: isSeancesError, isLoading: isSeancesLoading, isFetching: isSeancesFetching}] = useLazyGetSeancesQuery();
    
    const {date: chosenDate, time: chosenTime} = useAppSelector(state => state.mainSlice.dateAndTime); 
    const navigate = useNavigate();

    useEffect(() => {
        if(chosenDate !== '' && date !== chosenDate) setDate(chosenDate);
    }, [chosenDate, indexOfMonths]);

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

    /* Fetching seances */
    useEffect(() => {
        if(date.length > 0) triggerSeances({companyId, date});
    }, [date]);

    /* Setting first date active */
    useEffect(() => {
        if(dates !== undefined && firstOpened === true && indexOfMonths === 0) {
            setDate(dates.bookingDates[0]);
            setFirstOpened(false);
        } 
        if(dates !== undefined && firstOpened === false && months.length > 0){
            let checker = true;
            let checker1 = true;
            months[indexOfMonths].days.forEach(day => {
                if(day.isActive && checker) {
                    if(new Date(day.date).toLocaleString('ru-RU', {month: 'long'}) !== initialMonth){
                        setDate(day.date);
                        checker = false;
                    } else {
                        checker1 = false;
                    }
                }
            })
            if(checker && checker1) setDate('');
        }
    }, [dates, indexOfMonths]);

    /* Main logic */
    useTransformFormatOfDates({dates, setMonths});

    /* Setting Telegram */
    const onMainBtnClick = () => {
        if(isDate && chosenDate !== '' && chosenTime !== ''){
            setIsDate(false);
            navigate(`/?companyId=${companyId}`);
        }
    }

    useEffect(() => {
        window.Telegram.WebApp.onEvent('mainButtonClicked', onMainBtnClick);
        return () => {
            window.Telegram.WebApp.offEvent('mainButtonClicked', onMainBtnClick);
        }
    }, [onMainBtnClick, isDate, chosenDate, chosenTime]);

    useEffect(() => {
        if(isDate && chosenDate !== '' && chosenTime !== ''){
            if(!window.Telegram.WebApp.MainButton.isVisible){
                window.Telegram.WebApp.MainButton.setParams({text: 'Записаться', color: '#3F3133', text_color: '#ffffff'});
                window.Telegram.WebApp.MainButton.enable().show();
            }
        } else {
            window.Telegram.WebApp.MainButton.disable().hide();
        }
    }, [isDate, chosenDate, chosenTime]);

    return (
        <>
            {isError && <ErrorBlock/>}
            {(isLoading && isFetching) && <Loader/>}
            {dates !== undefined &&
                <div className='dates-seances'>
                    {months.length > 0 &&
                        <>
                            <DatesBlock initialMonth={initialMonth} setIndexOfMonths={setIndexOfMonths} date={date} months={months} setTime={setTime} setDate={setDate}/>
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