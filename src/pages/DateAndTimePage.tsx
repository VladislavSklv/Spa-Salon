import React, { useEffect, useState } from 'react';
import { ISeance, useLazyGetDatesQuery, useLazyGetSeancesQuery } from '../api/mainApi';
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
    const [triggerDates, {data: dates, isLoading, isFetching, isError}] = useLazyGetDatesQuery();
    const [months, setMonths] = useState<datesObj[]>([]);
    const [indexOfMonths, setIndexOfMonths] = useState(0);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [filteredSeances, setFilteredSeances] = useState<IFilteredSeances[]>();
    const [triggerSeances, {data: seances, isError: isSeancesError, isLoading: isSeancesLoading, isFetching: isSeancesFetching}] = useLazyGetSeancesQuery();
    const [isNoSeances, setIsNoSeances] = useState(false);
    
    const {dateAndTime, employee, services} = useAppSelector(state => state.mainSlice); 
    const navigate = useNavigate();

    useEffect(() => {
        if(dateAndTime.date !== '' && date !== dateAndTime.date) setDate(dateAndTime.date);
    }, [dateAndTime.date, indexOfMonths]);

    useEffect(() => {
        console.log(date);
        console.log(time);
    }, [dateAndTime]);

    /* Fetching dates */
    useEffect(() => {
        if(employee.id >= 0 && services.length > 0) {
            let serviceIds: number[] = [];
            services.forEach(service => serviceIds.push(service.id));
            triggerDates({companyId, employeeId: employee.id, serviceIds});
        } else if(services.length > 0){
            let serviceIds: number[] = [];
            services.forEach(service => serviceIds.push(service.id));
            triggerDates({companyId, serviceIds});
        } else if(employee.id >= 0) triggerDates({companyId, employeeId: employee.id});
        else triggerDates({companyId});
    }, [employee, services]);

    /* Fetching seances */
    useEffect(() => {
        if(date.length > 0 && employee.id >= 0 && services.length > 0) {
            let serviceIds: number[] = [];
            services.forEach(service => serviceIds.push(service.id));
            triggerSeances({companyId, date, employeeId: employee.id, serviceIds});
        } else if(date.length > 0 && services.length > 0){
            let serviceIds: number[] = [];
            services.forEach(service => serviceIds.push(service.id));
            triggerSeances({companyId, date, serviceIds});
        } else if(date.length > 0 && employee.id >= 0) triggerSeances({companyId, date, employeeId: employee.id});
        else if(date.length > 0) triggerSeances({companyId, date});
    }, [date, employee, services]);

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

    /* Setting first date active */
    useEffect(() => {
        console.log(initialMonth)
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
            if(checker && checker1) {
                setIsNoSeances(true);
                setDate('');
            } else {
                setIsNoSeances(false);
            }
        }
    }, [dates, indexOfMonths, months]);

    /* Main logic */
    useTransformFormatOfDates({dates, setMonths});

    /* Setting Telegram */
    const onMainBtnClick = () => {
        if(isDate && dateAndTime.date !== '' && dateAndTime.time !== ''){
            setIsDate(false);
            navigate(`/?companyId=${companyId}`);
        }
    }

    useEffect(() => {
        window.Telegram.WebApp.onEvent('mainButtonClicked', onMainBtnClick);
        return () => {
            window.Telegram.WebApp.offEvent('mainButtonClicked', onMainBtnClick);
        }
    }, [onMainBtnClick, isDate, dateAndTime.date, dateAndTime.time]);

    useEffect(() => {
        if(isDate && dateAndTime.date !== '' && dateAndTime.time !== ''){
            if(!window.Telegram.WebApp.MainButton.isVisible){
                window.Telegram.WebApp.MainButton.setParams({text: 'Записаться', color: '#3F3133', text_color: '#ffffff'});
                window.Telegram.WebApp.MainButton.enable().show();
            }
        } else {
            window.Telegram.WebApp.MainButton.disable().hide();
        }
    }, [isDate, dateAndTime.date, dateAndTime.time]);

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
                                {isNoSeances && 
                                <div className='no-seances'>
                                    <div className='no-seances__img'><img src="../images/date-icon.svg" alt="date" /></div>    
                                    <h2 className="no-seances__title">На выбранную дату<br/> нет доступных таймслотов</h2>
                                </div>}
                            </div>
                        </>  
                    }
                </div>
            }
        </>
    );
};

export default DateAndTimePage;