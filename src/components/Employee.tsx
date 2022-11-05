import React, { useEffect, useState } from 'react';
import { IEmployee, useGetEmployeeScheduleQuery } from '../api/mainApi';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { setEmployee } from '../redux/redux';
import ErrorBlock from './ErrorBlock';
import Loader from './Loader';

interface employeeProps {
    employee: IEmployee;
    companyId: string;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setDetailsId: React.Dispatch<React.SetStateAction<number>>;
}

const Employee:React.FC<employeeProps> = ({employee, companyId, setDetailsId, setIsDetails, setIsOpacity}) => {
    const {data: schedule, isError, isLoading, isFetching} = useGetEmployeeScheduleQuery({companyId, employeeId: employee.id.toString()});
    const starBlurWidth = 68 - (employee.rating * (68 / 5));
    const [isActive, setIsActive] = useState(false);
    const [commentText, setCommentText] = useState('');

    const {employee: chosenEmployee} = useAppSelector(state => state.mainSlice);
    const dispatch = useAppDispatch();

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
        setIsDetails(true);
        setIsOpacity(true);
    }

    return (
        <div 
            onClick={() => dispatch(setEmployee(employee))}
            className={employee.isActive ? (isActive ? 'employee-card employee-card_active' : 'employee-card') : 'employee-card employee-card_blured'}
        >
            <div className='employee-card__content'>
                <div className={employee.images !== undefined ? 'employee-card__img' : 'employee-card__img employee-card__img_icon'}>
                    <img src={employee.images !== undefined ? employee.images.tiny : "../images/specialist-icon.svg"} alt="image" />
                </div>
                <div>
                    <p className='employee-card__specialization'>{employee.specialization}</p>
                    <h2 className='employee-card__name'>{employee.name}</h2>
                    <div className='employee-card__rating'>
                        <div className='employee-card__stars'><div style={{width: `${starBlurWidth}px`}} className='employee-card__bluring-stars'></div><img src="../images/stars.svg" alt="stars" /></div>
                        <span className='employee-card__number-of-comments'>{employee.commentsCount} {commentText !== '' && commentText}</span>
                    </div>
                    {isError && <ErrorBlock/>}
                    {(isLoading || isFetching) && <Loader/>}
                    {schedule !== undefined &&
                        <div className='schedule'>
                            {schedule.seances.map((seance, i) => (
                                i < 3 && <div key={seance.time + Date.now()} className='schedule__item'>{seance.time}</div>
                            ))}
                        </div>
                    }
                </div>
            </div>
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