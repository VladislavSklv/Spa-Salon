import React from 'react';
import { useAppDispatch } from '../hooks/hooks';
import { IServiceInSlice, removeService } from '../redux/redux';
import MyButton from './UI/MyButton';

interface mainCardProps{
    onClickHandler: () => void;
    array: IServiceInSlice[];
    isArray: boolean;
}

const MainCard:React.FC<mainCardProps> = ({array, isArray, onClickHandler}) => {

    const dispatch = useAppDispatch();

    return (
        <div onClick={onClickHandler} className="menu-item">
            {array.length > 0
                ?<>
                    <div className="menu-item__img"><img src="../images/services-icon.svg" alt="services" /></div>
                    <div className='menu-item__content'>
                        <div>
                            <p className='menu-item__category'>{array[array.length - 1].categoryName}</p>
                            <h2 className="menu-item__title">{array[array.length - 1].name}</h2>
                        </div>
                        <MyButton isMinus={true} onClickHandler={() => {dispatch(removeService(array[array.length - 1].id))}} />
                    </div>
                </>
                :<>
                    <div className="menu-item__img"><img src="../images/services-icon.svg" alt="services" /></div>
                    <h2 className="menu-item__title">Выберите услуги</h2>
                </>
            }   
        </div>
    );
};

export default MainCard;