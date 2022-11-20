import React from 'react';
import { IService } from '../api/mainApi';
import { useAppDispatch } from '../hooks/hooks';
import { removeService } from '../redux/redux';
import MyButton from './UI/MyButton';

interface mainMenuServiceItemProps{
    service: IService;
}

const MainMenuServiceItem:React.FC<mainMenuServiceItemProps> = ({service}) => {
    const dispatch = useAppDispatch();

    return (
        <div className='menu-service'>
            <p className='menu-service__title'>
                {((service.priceMin !== undefined && service.priceMax !== undefined) && (service.priceMin !== 0 && service.priceMax !== 0))
                ? (service.priceMax === service.priceMin ? (service.priceMax.toLocaleString() + '₽') : (service.priceMax > service.priceMin ? `${service.priceMin.toLocaleString()} - ${service.priceMax.toLocaleString()}₽` : service.priceMin.toLocaleString() + '₽'))
                : 'Цена не указана'}
                {service.length !== undefined && <span><img src='../images/time.svg' alt='time'/> {service.length}</span>}
            </p>
            <h4 className='menu-service__subtitle'>{service.name}</h4>
            <MyButton isMinus={true} onClickHandler={() => dispatch(removeService(service.id))} />
        </div>
    );
};

export default MainMenuServiceItem;