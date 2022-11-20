import React, { useEffect, useState } from 'react';
import MyButton from './UI/MyButton';


export interface mainCardItem {
    subtitle: string;
    title: string;
    imgSrc?: string;
}
interface mainCardProps{
    onClickHandler: () => void;
    onMinusClickHandler: () => void;
    mainItem: mainCardItem | undefined;
    title: string;
    imgSrc: string;
    ifImgFull?: boolean;
    rating?: number;
    commentsCount?: number;
}

const MainCard:React.FC<mainCardProps> = ({mainItem, onClickHandler, imgSrc, title, onMinusClickHandler, ifImgFull, rating, commentsCount}) => {
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        if(commentsCount !== undefined){
            if(commentsCount % 10 === 1) {
                if(commentsCount % 100 > 10 && commentsCount % 100 < 20) setCommentText('отзывов');
                else setCommentText('отзыв');
            } else if(commentsCount % 10 >= 2 && commentsCount % 10 < 5) {
                if(commentsCount % 100 > 10 && commentsCount % 100 < 20) setCommentText('отзывов');
                else setCommentText('отзыва');
            }
            else setCommentText('отзывов');
        }
    }, []);

    return (
        <div onClick={onClickHandler} className="menu-item">
            {mainItem !== undefined
                ?<>
                    <div className={(mainItem.imgSrc !== undefined && ifImgFull) ? "menu-item__img menu-item__img_full" : "menu-item__img"}><img src={mainItem.imgSrc !== undefined ? mainItem.imgSrc : imgSrc} alt="icon" /></div>
                    <div style={mainItem.subtitle === '' ? {justifyContent: 'center'} : {}} className='menu-item__content'>
                        <p className='menu-item__category'>{mainItem.subtitle}</p>
                        <h2 className="menu-item__title">{mainItem.title}</h2>
                        {(rating !== undefined && commentsCount !== undefined && rating > 0 && commentsCount > 0) &&
                            <div className='employee-card__rating'>
                                <div className='employee-card__stars'><div style={{width: `${68 - (rating * (68 / 5))}px`}} className='employee-card__bluring-stars'></div><img src="../images/stars.svg" alt="stars" /></div>
                                <span className='employee-card__number-of-comments'>{commentsCount} {commentText !== '' && commentText}</span>
                            </div>
                        }
                        <MyButton isMinus={true} onClickHandler={() => onMinusClickHandler()} />
                    </div>
                </>
                :<>
                    <div className="menu-item__img"><img src={imgSrc} alt="services" /></div>
                    <h2 className="menu-item__title">{title}</h2>
                </>
            }   
        </div>
    );
};

export default MainCard;