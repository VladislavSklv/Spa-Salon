import React, { useState, useEffect, useRef } from 'react';
import { IService } from '../api/mainApi';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { addService, removeService } from '../redux/redux';
import MyButton from './UI/MyButton';

interface serviceProps {
    service: IService;
    categoryName: string;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    setDetailsId: React.Dispatch<React.SetStateAction<number>>;
}

const Service:React.FC<serviceProps> = ({service, setIsDetails, setIsOpacity, setDetailsId, categoryName}) => {
    const [isActive, setIsActive] = useState(false);
    const descrRef = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();
    const {services} = useAppSelector(state => state.mainSlice);

    useEffect(() => {
        services.forEach(item => {
            if(item.id === service.id) setIsActive(true);
        });
    }, [services]);

    /* Handlers */
    const activateDetails = () => {
        setDetailsId(service.id);
        setIsDetails(true);
        setIsOpacity(true);
    }

    return (
        <div className={isActive ? (service.isActive ? 'service-card service-card_active' : 'service-card service-card_active service-card_blured') : (service.isActive ? 'service-card' : 'service-card service-card_blured')} key={service.id}>
            {service.images !== undefined && service.images.length > 0 && 
                <div className='service-card__img'><img src={service.images[0]} alt="service preview" /></div>
            }
            <div className='service-card__content'>
                <h3 className='service-card__title'>{service.name}</h3>
                <h4 ref={descrRef} className='service-card__descr'>{service.description}</h4>
                {(descrRef.current !== null && descrRef.current.offsetHeight < descrRef.current.scrollHeight) &&
                    <a 
                        className='show-more' 
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            activateDetails();
                        }}
                    >Подробнее</a>
                }
                <div className='service-card__bottom'>
                    <div className='button-with-price'>
                        <MyButton isMinus={isActive} onClickHandler={() => {
                            if(service.isActive){
                                if(!isActive) dispatch(addService({...service, categoryName}));
                                else dispatch(removeService(service.id));
                                setIsActive(prev => !prev);
                            }
                        }}/>
                        <p className='price'>
                            {((service.priceMin !== undefined && service.priceMax !== undefined) && (service.priceMin !== 0 && service.priceMax !== 0))
                                ? (service.priceMax === service.priceMin ? (service.priceMax + '₽') : (service.priceMax > service.priceMin ? `${service.priceMin} - ${service.priceMax}₽` : service.priceMin + '₽'))
                                : 'Цена не указана'}
                        </p>
                    </div>
                    <div 
                        onClick={() => activateDetails()}
                        className='service-card__info'
                    ><img src="../images/info.svg" alt="i" /></div>
                </div>
            </div>
        </div>
    );
};

export default Service;