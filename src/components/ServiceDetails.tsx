import React, { useEffect, useState } from 'react';
import { IService, IServicesCategory } from '../api/mainApi';
import Modal from './Modal';

interface serviceDetailsProps {
    servicesCategories: IServicesCategory[];
    isDetails: boolean;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    detailsId: number;
}

const ServiceDetails: React.FC<serviceDetailsProps> = ({isDetails, servicesCategories, setIsDetails, setIsOpacity, detailsId}) => {
    const [service, setService] = useState<IService>();

    /* Finding this service */
    useEffect(() => {
        servicesCategories.forEach(servicesCategory => {
            servicesCategory.services.forEach(item => {
                if(item.id === detailsId) setService(item);
            });
        });
    }, [detailsId]);

    return (
        <Modal setIsOpacity={setIsOpacity} setIsOpened={setIsDetails} isOpened={isDetails}>
            {service !== undefined &&
                <div className='details'>
                    {service.images !== undefined && service.images.length > 0 && 
                        <div className='details__img'><img src={service.images[0]} alt="details preview" /></div>
                    }
                    <div className='details__content'>
                        <h3 className="details__title">{service.name}</h3>
                        <p className='details__descr'>{service.description !== undefined && service.description}</p>
                        <div className='details__bottom'>
                            <p className='details__price'>
                                {((service.priceMin !== undefined && service.priceMax !== undefined) && (service.priceMin != 0 && service.priceMax != 0))
                                    ? (service.priceMin === 0 ? (service.priceMax + '₽') : (service.priceMax === 0 ? service.priceMin + '₽' : `${service.priceMin} - ${service.priceMax}₽`))
                                    : 'Цена не указана'}
                            </p>
                            {service.length !== undefined &&
                                <p className='details__time'>
                                    {service.length}
                                </p>
                            }
                        </div>
                    </div>
                </div>
            }
        </Modal>
    );
};

export default ServiceDetails;