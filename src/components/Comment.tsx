import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { IComment } from '../api/mainApi';

interface commentProps{
    comment: IComment;
    isEmployeeDetails: boolean;
}

const Comment:React.FC<commentProps> = ({comment, isEmployeeDetails}) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isTextFull, setIsTextFull] = useState(false);
    const [isRef, setIsRef] = useState(false);

    useEffect(() => {
        if(!isEmployeeDetails) setIsTextFull(false);
    }, [isEmployeeDetails]);

    useEffect(() => {
        if(textRef.current !== null) setIsRef(true);
        else setIsRef(false);
    }, [textRef.current]);

    // Calculating the time difference between two dates
    const diffInTime = new Date(Date.now()).getTime() - new Date(comment.date).getTime();
    let timeToShow = '';

    const inclineWords = ({number, text1, text2, text3}: {number: number, text1: string, text2: string, text3: string}) =>{
        let time = Math.round(number);
        let words = text1;
        if(time % 10 === 1) words = text2;
        if(time % 10 > 1 && time % 10 < 5) words = text3;
        if(time % 100 > 10 && time % 100 < 20) words = text1;
        return `${time} ${words}`;
    }

    if(diffInTime > 1000){
        timeToShow = inclineWords({number: diffInTime / (1000), text1: 'секунд назад', text2: 'секунду назад', text3: 'секунд назад'});
    } 
    if(diffInTime > (1000 * 60)){
        timeToShow = inclineWords({number: diffInTime / (1000 * 60), text1: 'минут назад', text2: 'минуту назад', text3: 'минуты назад'});
    } 
    if(diffInTime > (1000 * 60 * 60)){
        timeToShow = inclineWords({number: diffInTime / (1000 * 60 * 60), text1: 'часов назад', text2: 'час назад', text3: 'часа назад'});
    } 
    if(diffInTime > (1000 * 60 * 60 * 24)){
        timeToShow = inclineWords({number: diffInTime / (1000 * 60 * 60 * 24), text1: 'дней назад', text2: 'день назад', text3: 'дня назад'});
    } 
    if(diffInTime > (1000 * 60 * 60 * 24 * 30)){
        timeToShow = inclineWords({number: diffInTime / (1000 * 60 * 60 * 24 * 30), text1: 'месяцев назад', text2: 'месяц назад', text3: 'месяца назад'});
    } 
    if(diffInTime > (1000 * 60 * 60 * 24 * 30 * 12)){
        timeToShow = inclineWords({number: diffInTime / (1000 * 60 * 60 * 24 * 30 * 12), text1: 'лет назад', text2: 'год назад', text3: 'года назад'});
    }

    return (
        <div key={comment.id} className='comment'>
            <div className='comment__content'>
                <div className={comment.userImage !== undefined ? 'comment__img' : 'comment__img comment__img_icon'}>
                    <img src={comment.userImage !== undefined ? comment.userImage : "../images/specialist-icon.svg"} alt="avatar" />
                </div>
                <div>
                    <h2 className='comment__name'>{comment.userName}</h2>
                    <div className='comment__rating'>
                        <div className='comment__stars'><div style={{width: `${72 - (comment.rating * (72 / 5))}px`}} className='comment__bluring-stars'></div><img src="../images/stars.svg" alt="stars" /></div>
                        <span className='comment__number-of-comments'>{timeToShow}</span>
                    </div>
                </div>
            </div>
            {comment.text !== undefined && <div style={isTextFull ? {maxHeight: '10000000px'} : {maxHeight: '53px'}} ref={textRef} className='comment__text'>{comment.text}</div>}
            {isRef && textRef.current !== null && (comment.text !== undefined && !isTextFull && (textRef.current.offsetHeight < textRef.current.scrollHeight)) 
                ?<>
                    <a 
                        className='show-more' 
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsTextFull(true);
                        }}
                    >Читать полностью</a>
                </>
                : <div></div>
            }
        </div>
    );
};

export default Comment;