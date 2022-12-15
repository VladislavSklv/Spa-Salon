import React, { useEffect, useState } from 'react';
import { IService } from '../api/mainApi';
import { useAppDispatch } from '../hooks/hooks';
import { removeService } from '../redux/redux';
import MyButton from './UI/MyButton';

interface mainMenuServiceItemProps{
    service: IService;
}

const MainMenuServiceItem:React.FC<mainMenuServiceItemProps> = ({service}) => {
    const dispatch = useAppDispatch();
    const [serviceLength, setServiceLength] = useState('');

    /* Converting service time */
    useEffect(() => {
        if(service?.length !== undefined){
            let fullLength = '';
            let minutes = 0;
            let hours = 0;
            if(service.length < 60) fullLength = `${service.length} сек.`
            else if(service.length >= 60) {
                minutes = Math.round(service.length / 60);
                fullLength = `${minutes} мин.`
                if(minutes >= 60){
                    if(minutes % 60 === 0){
                        let hoursStr = 'час';
                        hours = minutes / 60;
                        if(hours % 10 > 1 && hours % 10 < 5) hoursStr = 'часа';
                        else if(hours % 10 > 4 && hours % 10 <= 9 && hours % 10 === 0) hoursStr = 'часов';
                        fullLength = `${hours} ${hoursStr}`;
                    } else {
                        let hoursStr = 'час';
                        hours = Math.floor(minutes / 60);
                        let lastedMinutes = minutes - hours * 60;
                        if(hours % 10 > 1 && hours % 10 < 5) hoursStr = 'часа';
                        else if((hours % 10 > 4 && hours % 10 <= 9) || hours % 10 === 0) hoursStr = 'часов';
                        fullLength = `${hours} ${hoursStr} ${lastedMinutes} мин.`;
                    } 
                }
            }
            setServiceLength(fullLength);
        } else setServiceLength('');
    }, [service]);

    return (
        <div className='menu-service'>
            <p className='menu-service__title'>
                {((service.priceMin !== undefined && service.priceMax !== undefined) && (service.priceMin !== 0 && service.priceMax !== 0))
                ? (service.priceMax === service.priceMin ? (service.priceMax.toLocaleString() + '₽') : (service.priceMax > service.priceMin ? `${service.priceMin.toLocaleString()} - ${service.priceMax.toLocaleString()}₽` : service.priceMin.toLocaleString() + '₽'))
                : 'Цена не указана'}
                {serviceLength !== '' && <span><img src='../images/time.svg' alt='time'/> {serviceLength}</span>}
            </p>
            <h4 className='menu-service__subtitle'>{service.name}</h4>
            <MyButton isMinus={true} onClickHandler={() => dispatch(removeService(service.id))} />
        </div>
    );
};

export default MainMenuServiceItem;