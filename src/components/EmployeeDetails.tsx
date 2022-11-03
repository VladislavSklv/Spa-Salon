import React, { useEffect, useState } from 'react';
import { enablePageScroll } from 'scroll-lock';
import { IEmployee, useGetCommentsQuery } from '../api/mainApi';
import { useAppDispatch } from '../hooks/hooks';
import { setEmployee } from '../redux/redux';
import Comment from './Comment';
import ErrorBlock from './ErrorBlock';
import Loader from './Loader';
import Modal from './Modal';

interface employeeDetailsProps{
    employees: IEmployee[];
    companyId: string;
    detailsId: number;
    isDetails: boolean;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmployeeDetails:React.FC<employeeDetailsProps> = ({isDetails, setIsDetails, setIsOpacity, employees, detailsId, companyId}) => {
    const [thisEmployee, setThisEmployee] = useState<IEmployee>(employees[0]);
    const {data: comments, isError, isLoading, isFetching} = useGetCommentsQuery({companyId, employeeId: thisEmployee.id.toString()});

    const dispatch = useAppDispatch();

    /* Enable scroll */
    useEffect(() => {
        if(isDetails){
            enablePageScroll();
        }
    }, [isDetails])

    useEffect(() => {
        employees.forEach(employee => {
            if(employee.id === detailsId) setThisEmployee(employee);
        });
    }, [detailsId]);

    return (
        <Modal isOpened={isDetails} setIsOpened={setIsDetails} setIsOpacity={setIsOpacity}>
            <>
                {thisEmployee !== undefined &&
                    <div className='employee-details'>
                        <div className='employee-details__top'>
                            <div className='employee-details__wrapper'>
                                <div className={thisEmployee.images !== undefined ? 'employee-details__img' : 'employee-details__img employee-details__img_icon'}>
                                    <img src={thisEmployee.images !== undefined ? thisEmployee.images.full : "../images/specialist-icon.svg"} alt="avatar" />
                                </div>
                                <div className='employee-details__about'>
                                    <p className='employee-details__specialization'>{thisEmployee.specialization}</p>
                                    <h2 className='employee-details__name'>{thisEmployee.name}</h2>
                                    <div className='employee-details__rating'>
                                        <div className='employee-details__stars'><div style={{width: `${90 - (thisEmployee.rating * (90 / 5))}px`}} className='employee-details__bluring-stars'></div><img src="../images/stars.svg" alt="stars" /></div>
                                        <span className='employee-details__number-of-comments'>{thisEmployee.commentsCount} отзыва</span>
                                    </div>
                                </div>
                            </div>
                            <div className='employee-details__descr'>{thisEmployee.description}</div>
                            <button 
                                onClick={() => {
                                    if(thisEmployee.isActive) {
                                        dispatch(setEmployee(thisEmployee));
                                        setIsDetails(false);
                                        setIsOpacity(false);
                                    }
                                }}
                            >add</button>
                        </div>
                        {isLoading && <Loader/>}
                        {isError && <ErrorBlock/>}
                        {comments !== undefined && comments.length > 0 && (!isLoading && !isFetching) && 
                            <div className='comments'> 
                                <h3 className='comments__title'>Отзывы</h3>
                                {comments.map(comment => 
                                    <Comment comment={comment} key={comment.id}/>
                                )}
                            </div>
                        }
                    </div>
                }
            </>
        </Modal>
    );
};

export default EmployeeDetails;