import React, { useEffect, useState } from 'react';
import { IEmployee, useLazyGetEmployeeScheduleQuery } from '../api/mainApi';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { setEmployee } from '../redux/redux';
import ErrorBlock from './ErrorBlock';
import Loader from './Loader';

interface employeeProps {
    chosenEmployee: IEmployee;
    setChosenEmployee: React.Dispatch<React.SetStateAction<IEmployee>>;
    employee: IEmployee;
    companyId: string;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setDetailsId: React.Dispatch<React.SetStateAction<number>>;
}

const Employee:React.FC<employeeProps> = ({employee, companyId, setDetailsId, setIsDetails, setIsOpacity, chosenEmployee, setChosenEmployee}) => {
    const [shceduleTrigger, {data: schedule, isError, isLoading, isFetching}] = useLazyGetEmployeeScheduleQuery();
    const starBlurWidth = 68 - (employee.rating * (68 / 5));
    const [isActive, setIsActive] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [scheduleDate, setScheduleDate] = useState('');
    const [date, setDate] = useState({date: '', time: ''});

    const {services, dateAndTime} = useAppSelector(state => state.mainSlice);

    /* Setting schedule date */
    useEffect(() => {
        if(schedule !== undefined){
            let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
            let date = new Date(new Date(schedule.date).getFullYear(), new Date(schedule.date).getMonth(), new Date(schedule.date).getDate());
            if(today.toLocaleString('ru-RU', {year: 'numeric', month: 'numeric', day: 'numeric'}) === date.toLocaleString('ru-RU', {year: 'numeric', month: 'numeric', day: 'numeric'})) setScheduleDate('сегодня');
            else if(date.toLocaleString('ru-RU', {year: 'numeric', month: 'numeric', day: 'numeric'}) === new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toLocaleString('ru-RU', {year: 'numeric', month: 'numeric', day: 'numeric'})) setScheduleDate('завтра');
            else if(date.toLocaleString('ru-RU', {year: 'numeric', month: 'numeric', day: 'numeric'}) === new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toLocaleString('ru-RU', {year: 'numeric', month: 'numeric', day: 'numeric'})) setScheduleDate('послезавтра');
            else setScheduleDate(date.toLocaleString('ru-RU', {year: 'numeric', month: 'numeric', day: 'numeric'}));
        }
    }, [schedule]);

    /* Fetching employee schedule */
    useEffect(() => {
        if(employee.isActive && dateAndTime.time === '' && dateAndTime.date === '') {
            if(services.length > 0){
                let serviceIds: number[] = [];
                services.forEach(service => serviceIds.push(service.id));
                shceduleTrigger({companyId, serviceIds, employeeId: employee.id.toString()});
            } else shceduleTrigger({companyId, employeeId: employee.id.toString()});
        }
    }, [employee, services, dateAndTime]);

    useEffect(() => {
        if(employee.commentsCount % 10 === 1) {
            if(employee.commentsCount % 100 > 10 && employee.commentsCount % 100 < 20) setCommentText('отзывов');
            else setCommentText('отзыв');
        } else if(employee.commentsCount % 10 >= 2 && employee.commentsCount % 10 < 5) {
            if(employee.commentsCount % 100 > 10 && employee.commentsCount % 100 < 20) setCommentText('отзывов');
            else setCommentText('отзыва');
        }
        else setCommentText('отзывов');
    }, []);

    useEffect(() => {
        if(chosenEmployee.id === employee.id) setIsActive(true);
        else setIsActive(false);
    }, [chosenEmployee]);

    /* Handlers */
    const activateDetails = () => {
        setDetailsId(employee.id);
        setIsOpacity(true);
        setTimeout(() => {
            setIsDetails(true);
        }, 200);
    }

    return (
        <div 
            onClick={() => employee.isActive && setChosenEmployee(employee)}
            className={employee.isActive ? (isActive ? 'employee-card employee-card_active' : 'employee-card') : 'employee-card employee-card_blured'}
        >
            <div className='employee-card__content'>
                <div className={employee.images !== undefined ? 'employee-card__img' : 'employee-card__img employee-card__img_icon'}>
                    <img src={employee.images !== undefined ? employee.images.tiny : "../images/specialist-icon.svg"} alt="image" />
                </div>
                <div>
                    <p className='employee-card__specialization'>{employee.specialization}</p>
                    <h2 className='employee-card__name'>{employee.name}</h2>
                    {employee.commentsCount > 0 &&
                        <div className='employee-card__rating'>
                            <div className='employee-card__stars'><div style={{width: `${starBlurWidth}px`}} className='employee-card__bluring-stars'></div><img src="../images/stars.svg" alt="stars" /></div>
                            <span className='employee-card__number-of-comments'>{employee.commentsCount} {commentText !== '' && commentText}</span>
                        </div>
                    }
                </div>
            </div>
            {employee.isActive &&
                        <>
                            {isError && <ErrorBlock/>}
                            {(isLoading || isFetching) && <Loader/>}
                            {schedule !== undefined && scheduleDate !== '' &&
                                <>
                                    <h4 className="schedule-date">Ближайшее время для записи {scheduleDate}</h4>
                                    <div className='schedule'>
                                        {schedule.seances.map((seance, i) => (
                                            i < 3 && <div onClick={() => setDate({date: schedule.date, time: seance.time})} key={seance.time + Date.now()} className='schedule__item'>{seance.time}</div>
                                        ))}
                                    </div>
                                </>
                            }
                        </>
                    }
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    activateDetails();
                }}
                className='info'
            ><img src="../images/info.svg" alt="info" /></div>
        </div>
    );
};

export default Employee;