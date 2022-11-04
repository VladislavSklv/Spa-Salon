import React from 'react';
import { useAppDispatch } from '../hooks/hooks';
import { IServiceInSlice, removeService } from '../redux/redux';
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
}

const MainCard:React.FC<mainCardProps> = ({mainItem, onClickHandler, imgSrc, title, onMinusClickHandler, ifImgFull}) => {
    return (
        <div onClick={onClickHandler} className="menu-item">
            {mainItem !== undefined
                ?<>
                    <div className={(mainItem.imgSrc !== undefined && ifImgFull) ? "menu-item__img menu-item__img_full" : "menu-item__img"}><img src={mainItem.imgSrc !== undefined ? mainItem.imgSrc : imgSrc} alt="icon" /></div>
                    <div className='menu-item__content'>
                        <div>
                            <p className='menu-item__category'>{mainItem.subtitle}</p>
                            <h2 className="menu-item__title">{mainItem.title}</h2>
                        </div>
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