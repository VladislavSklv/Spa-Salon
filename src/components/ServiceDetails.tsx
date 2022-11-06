import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IService, IServicesCategory } from '../api/mainApi';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { addService, IServiceInSlice } from '../redux/redux';
import Modal from './Modal';

interface serviceDetailsProps {
    servicesCategories: IServicesCategory[];
    isDetails: boolean;
    isServices: boolean;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    detailsId: number;
    setIsServices: React.Dispatch<React.SetStateAction<boolean>>;
}

const ServiceDetails: React.FC<serviceDetailsProps> = ({isDetails, servicesCategories, setIsDetails, setIsOpacity, detailsId, isServices, setIsServices}) => {
    const [service, setService] = useState<IServiceInSlice>();
    const [isServiceChosen, setIsServiceChosen] = useState(false);

    const dispatch = useAppDispatch();
    const {services} = useAppSelector(state => state.mainSlice);
    const navigate = useNavigate();

    /* Checking if service is chosen */
    useEffect(() => {
        if(services !== undefined && services.length > 0 && service !== undefined){
            let checker = true;
            services.forEach(chosenService => chosenService.id === service.id ? setIsServiceChosen(true) : checker = false);
            if(!checker) setIsServiceChosen(false);
        }
    }, [services, service]);

    /* Finding this service */
    useEffect(() => {
        servicesCategories.forEach(servicesCategory => {
            servicesCategory.services.forEach(item => {
                if(item.id === detailsId) setService({...item, categoryName: servicesCategory.name});
            });
        });
    }, [detailsId]);

    /* Setting Telegram */
    const onMainBtnClick = () => {
        if(isDetails === false){
            setIsServices(false);
            navigate('/');
        } else {
            if(service !== undefined){
                if(isServiceChosen){
                    setIsDetails(false);
                    setIsOpacity(false);
                } else {
                    if(service.isActive) dispatch(addService(service));
                    setIsDetails(false);
                    setIsOpacity(false);
                }
            }
        }
    };

    useEffect(() => {
        if(isServices === true){
            window.Telegram.WebApp.onEvent('mainButtonClicked', onMainBtnClick);
            return () => {
                window.Telegram.WebApp.offEvent('mainButtonClicked', onMainBtnClick);
            };
        }
    }, [onMainBtnClick, isServices, isDetails, service, isServiceChosen]);

    useEffect(() => {
        if(isDetails === true && isServices === true && service !== undefined){
            if(service.isActive === false) window.Telegram.WebApp.MainButton.setParams({text: 'Продолжить', color: '#3F3133', text_color: '#ffffff'}).enable().show();
            else window.Telegram.WebApp.MainButton.setParams({text: 'Добавить', color: '#3F3133', text_color: '#ffffff'}).enable().show();
        }
    }, [isDetails, isServices, service]);

    return (
        <Modal setIsOpacity={setIsOpacity} setIsOpened={setIsDetails} isOpened={isDetails}>
            <>
                {service !== undefined 
                    ?
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
                                        <img src="../images/time.svg" alt="time" />
                                        {service.length}
                                    </p>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div></div>
                }
            </>
        </Modal>
    );
};

export default ServiceDetails;