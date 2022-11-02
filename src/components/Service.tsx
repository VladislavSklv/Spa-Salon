import React, {useState} from 'react';
import { IService } from '../api/mainApi';

interface serviceProps {
    service: IService;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    setDetailsId: React.Dispatch<React.SetStateAction<number>>;
}

const Service:React.FC<serviceProps> = ({service, setIsDetails, setIsOpacity, setDetailsId}) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className='service-card' key={service.id}>
            {service.images !== undefined && service.images.length > 0 && 
                <div className='service-card__img'><img src={service.images[0]} alt="service preview" /></div>
            }
            <div className='service-card__content'>
                <h3 className='service-card__title'>{service.name}</h3>
                <h4 className='service-card__descr'>{service.description}</h4>
                <div className='service-card__bottom'>
                    <div className='button-with-price'>
                        <button 
                            className={isActive ? "button button_minus" : "button button_plus"}
                            onClick={() => {
                                setIsActive(prev => !prev);
                            }}
                        ><span></span><span></span></button>
                        <p className='price'>
                            {((service.priceMin !== undefined && service.priceMax !== undefined) && (service.priceMin != 0 && service.priceMax != 0))
                                ? (service.priceMin === 0 ? (service.priceMax + '₽') : (service.priceMax === 0 ? service.priceMin + '₽' : `${service.priceMin} - ${service.priceMax}₽`))
                                : 'Цена не указана'}
                        </p>
                    </div>
                    <div 
                        onClick={() => {
                            setDetailsId(service.id);
                            setIsDetails(true);
                            setIsOpacity(true);
                        }}
                        className='service-card__info'
                    ><img src="../images/info.svg" alt="i" /></div>
                </div>
            </div>
        </div>
    );
};

export default Service;