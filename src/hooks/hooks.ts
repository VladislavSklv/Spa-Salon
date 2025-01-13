import { useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from ".."
import { IDates } from "../api/mainApi";
import { datesObj } from "../pages/DateAndTimePage";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


// Date And Time page
interface useTransformFormatOfDatesProps{
    setMonths: React.Dispatch<React.SetStateAction<datesObj[]>>;
    dates: {data: IDates} | undefined;
}

const numberOfMonths = 3;

const getLastDate = ({year, month}: {year: number; month: number}) => {
    let date = new Date(year, month, 0);
    date = new Date(date.setDate(date.getDate() + 1));
    return date;
}

export const useTransformFormatOfDates = ({setMonths, dates}: useTransformFormatOfDatesProps) => {
    useEffect(() => {
        if(dates !== undefined){
            /* Getting all dates */
            let D = new Date();
            let Till = new Date();
            Till = new Date(Till.setMonth(Till.getMonth() + numberOfMonths));
            Till = getLastDate({year: Till.getFullYear(), month: Till.getMonth()});
            let allDates = [];

            const padd = (s: any) => { return ('00' + s).slice(-2)}

            while(D.getTime() < Till.getTime()) {
                allDates.push( '' + D.getFullYear() +'-'+ padd(D.getMonth()+1) +'-'+ padd(D.getDate()));
                D.setDate( D.getDate()+1);
            }

            /* Converting all dates into months objects array */
            let thisMonths: datesObj[] = [];
            allDates.forEach(thisDate => {
                let date = new Date(thisDate);
                let checker = true;
                thisMonths.forEach(month => {
                    if(checker && month.month === date.toLocaleString('ru-RU', {month: 'long'})){
                        month.days.push({date: thisDate, day: date.getDate().toLocaleString(), weekDay: date.toLocaleString('ru-RU', {weekday: 'short'}), isActive: false});
                        checker = false;
                    }
                })
                if(checker) {
                    thisMonths.push({
                        month: date.toLocaleString('ru-RU', {month: 'long'}),
                        days: [{date: thisDate, day: date.getDate().toLocaleString(), weekDay: date.toLocaleString('ru-RU', {weekday: 'short'}), isActive: false}]
                    });
                }
            });

            thisMonths.forEach(month => {
                month.days.forEach(day => {
                    dates.data.bookingDates.forEach(bookingDate => {
                        if(day.date === bookingDate) day.isActive = true;
                    });
                });
            });

            setMonths(thisMonths);
        }
    }, [dates]);
}