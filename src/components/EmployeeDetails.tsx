import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { enablePageScroll } from 'scroll-lock';
import { IEmployee, useLazyGetCommentsQuery } from '../api/mainApi';
import { useAppDispatch } from '../hooks/hooks';
import { IDateAndTime, setEmployee } from '../redux/redux';
import Comment from './Comment';
import ErrorBlock from './ErrorBlock';
import Loader from './Loader';
import Modal from './Modal';
import SkeletonComment from './skeletons/SkeletonComment';

interface employeeDetailsProps{
    setChosenEmployee: React.Dispatch<React.SetStateAction<IEmployee>>;
    employees: IEmployee[];
    isEmployee: boolean;
    companyId: string;
    detailsId: number;
    isEmployeeDetails: boolean;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEmployeeDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmployeeDetails:React.FC<employeeDetailsProps> = ({isEmployeeDetails, setIsEmployeeDetails, setIsOpacity, employees, detailsId, companyId, isEmployee, setChosenEmployee}) => {
    const [thisEmployee, setThisEmployee] = useState<IEmployee>(employees[0]);
    const [commentText, setCommentText] = useState('');
    /* const {data: comments, isError, isLoading, isFetching} = useGetCommentsQuery({companyId, employeeId: thisEmployee.id.toString()}); */
    const [trigger, {data: comments, isError, isLoading, isFetching}] = useLazyGetCommentsQuery();
    const [canPlayVideo, setCanPlayVideo] = useState(false);

    /* Enable scroll */
    useEffect(() => {
        if(isEmployeeDetails){
            enablePageScroll();
        }
    }, [isEmployeeDetails]);

    useEffect(() => {
        employees.forEach(employee => {
            if(employee.id === detailsId) setThisEmployee(employee);
        });
    }, [detailsId]);

    useEffect(() => {
        trigger({companyId, employeeId: thisEmployee.id.toString()});
    }, [thisEmployee]);

    useEffect(() => {
        if(thisEmployee.commentsCount % 10 === 1) {
            if(thisEmployee.commentsCount % 100 > 10 && thisEmployee.commentsCount % 100 < 20) setCommentText('отзывов');
            else setCommentText('отзыв');
        } else if(thisEmployee.commentsCount % 10 >= 2 && thisEmployee.commentsCount % 10 < 5) {
            if(thisEmployee.commentsCount % 100 > 10 && thisEmployee.commentsCount % 100 < 20) setCommentText('отзывов');
            else setCommentText('отзыва');
        }
        else setCommentText('отзывов');
    }, [thisEmployee]);

    useEffect(() => {
        if(!isEmployeeDetails){
            setCanPlayVideo(false);
        }
    }, [isEmployeeDetails]);

    /* Setting Telegram */
    const onMainBtnClick = () => {
        if(isEmployeeDetails && isEmployee && thisEmployee !== undefined){
            if(thisEmployee.isActive) setChosenEmployee(thisEmployee);
            setIsEmployeeDetails(false);
            setIsOpacity(false);
        }
    };

    useEffect(() => {
        window.Telegram.WebApp.onEvent('mainButtonClicked', onMainBtnClick);
        return () => {
            window.Telegram.WebApp.offEvent('mainButtonClicked', onMainBtnClick);
        }
    }, [onMainBtnClick, isEmployeeDetails, isEmployee, thisEmployee]);

    useEffect(() => {
        if(isEmployeeDetails && isEmployee){
            if(thisEmployee.isActive === true) window.Telegram.WebApp.MainButton.setParams({text: 'Выбрать', color: '#3F3133', text_color: '#ffffff', is_active: true, is_visible: true}).show();
            else window.Telegram.WebApp.MainButton.setParams({text: 'Продолжить', color: '#3F3133', text_color: '#ffffff', is_active: true, is_visible: true}).show();
        }
    }, [isEmployeeDetails, isEmployee]);

    return (
        <Modal isOpened={isEmployeeDetails} setIsOpened={setIsEmployeeDetails} setIsOpacity={setIsOpacity}>
            <>
                {thisEmployee !== undefined &&
                    <div className='employee-details'>
                        <div className='employee-details__top'>
                            <div className='employee-details__wrapper'>
                                {/* <CSSTransition
                                    in={thisEmployee.video === undefined || !isEmployeeDetails}
                                    classNames='details-img'
                                    timeout={300}
                                    unmountOnExit
                                    mountOnEnter
                                >
                                    <div style={canPlayVideo ? {opacity: 0, position: 'absolute', width: 0} : {opacity: 1, position: 'relative'}} className={thisEmployee.images !== undefined ? 'employee-details__img' : 'employee-details__img employee-details__img_icon'}>
                                        <img src={thisEmployee.images !== undefined ? thisEmployee.images.full : "../images/specialist-icon.svg"} alt="avatar" />
                                    </div>
                                </CSSTransition> */}

                                {thisEmployee.video === undefined &&
                                    <div className={thisEmployee.images !== undefined ? 'employee-details__img' : 'employee-details__img employee-details__img_icon'}>
                                        <img src={thisEmployee.images !== undefined ? thisEmployee.images.full : "../images/specialist-icon.svg"} alt="avatar" />
                                    </div>
                                }

                                {thisEmployee.video !== undefined &&
                                    <video poster={thisEmployee.images !== undefined ? thisEmployee.images.full : "../images/specialist-icon.svg"} className='employee-details__video' playsInline muted loop controls autoPlay>
                                        <source src={thisEmployee.video} type='video/mp4'/>
                                    </video>
                                }

                                {/* <CSSTransition
                                    in={thisEmployee.video !== undefined && isEmployeeDetails}
                                    classNames='details-img'
                                    timeout={300}
                                    unmountOnExit
                                    mountOnEnter
                                >
                                    <video className='employee-details__video' playsInline muted autoPlay loop controls>
                                        <source src={thisEmployee.video} type='video/mp4'/>
                                    </video>
                                </CSSTransition>
 */}
                                {/* {isEmployeeDetails === true && thisEmployee.video !== undefined &&
                                    <div >
                                        <video className='employee-details__video' playsInline onLoadedData={() => setCanPlayVideo(true)} muted autoPlay loop controls>
                                            <source src={thisEmployee.video} type='video/mp4'/>
                                        </video>
                                    </div>
                                } */}
                                {/* {thisEmployee.video !== undefined &&
                                <video autoPlay loop muted controls>
                                    <source src={thisEmployee.video} type='video/mp4'/>
                                </video>
                                } */}
                                <div className='employee-details__about'>
                                    <p className='employee-details__specialization'>{thisEmployee.specialization}</p>
                                    <h2 className='employee-details__name'>{thisEmployee.name}</h2>
                                    {thisEmployee.commentsCount > 0 &&
                                        <div className='employee-details__rating'>
                                            <div className='employee-details__stars'><div style={{width: `${90 - (thisEmployee.rating * (90 / 5))}px`}} className='employee-details__bluring-stars'></div><img src="../images/stars.svg" alt="stars" /></div>
                                            <span className='employee-details__number-of-comments'>{thisEmployee.commentsCount} {commentText !== '' && commentText}</span>
                                        </div>    
                                    }
                                </div>
                            </div>
                            <div className='employee-details__descr'>{thisEmployee.description}</div>
                        </div>
                            <div className='comments'> 
                                <h3 className='comments__title'>Отзывы</h3>
                                {(isLoading || isFetching) && 
                                <>
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <SkeletonComment key={i}/>
                                    ))}
                                </>}
                                {isError && <ErrorBlock/>}
                                {comments !== undefined && comments.length > 0 && (!isLoading && !isFetching) 
                                    &&
                                   <>
                                        {comments.map(comment => 
                                            <Comment isEmployeeDetails={isEmployeeDetails} comment={comment} key={comment.id}/>
                                        )}
                                   </>
                                }
                                {!isLoading && !isFetching && (comments === undefined || comments?.length === 0) &&
                                    <div className='no-comments'>
                                        <div className='no-comments__img'><img src="../images/no-comments.svg" alt="no comments" /></div>
                                        <h3 className="no-comments__title">Здесь пока ничего нет</h3>
                                    </div>
                                }
                            </div>
                    </div>
                }
            </>
        </Modal>
    );
};

export default EmployeeDetails;