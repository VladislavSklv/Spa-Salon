import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { IServicesCategory } from '../api/mainApi';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { addService, IServiceInSlice, setServices } from '../redux/redux';
import Modal from './Modal';

interface serviceDetailsProps {
    chosenServices: IServiceInSlice[];
    setChosenServices: React.Dispatch<React.SetStateAction<IServiceInSlice[]>>;
    servicesCategories: IServicesCategory[];
    isDetails: boolean;
    isServices: boolean;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    detailsId: number;
    setIsServices: React.Dispatch<React.SetStateAction<boolean>>;
    companyId: string;
}

const ServiceDetails: React.FC<serviceDetailsProps> = ({isDetails, servicesCategories, setIsDetails, setIsOpacity, detailsId, isServices, setIsServices, companyId, chosenServices, setChosenServices}) => {
    const [service, setService] = useState<IServiceInSlice>();
    const [isServiceChosen, setIsServiceChosen] = useState(false);
    const [canPlayVideo, setCanPlayVideo] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    /* Checking if service is chosen */
    useEffect(() => {
        if(chosenServices.length > 0 && service !== undefined){
            let checker = true;
            chosenServices.forEach(chosenService => chosenService.id === service.id ? setIsServiceChosen(true) : checker = false);
            if(!checker) setIsServiceChosen(false);
        }
    }, [chosenServices, service]);

    /* Finding this service */
    useEffect(() => {
        servicesCategories.forEach(servicesCategory => {
            servicesCategory.services.forEach(item => {
                if(item.id === detailsId) setService({...item, categoryName: servicesCategory.name});
            });
        });
    }, [detailsId]);

    useEffect(() => {
        if(!isDetails){
            setCanPlayVideo(false);
        }
    }, [isDetails]);

    /* Setting Telegram */
    const onMainBtnClick = () => {
        if(isDetails === false){
            dispatch(setServices(chosenServices));
            setIsServices(false);
            navigate(`/?companyId=${companyId}`);
        } else {
            if(service !== undefined){
                if(isServiceChosen){
                    setIsDetails(false);
                    setIsOpacity(false);
                } else {
                    if(service.isActive) {
                        setChosenServices(prev => [...prev, service]);
                    }
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
                        {service.images !== undefined && service.images.length > 0 && service.video === undefined &&
                            <div className='details__img'>
                                <img src={service.images[0]} alt="details preview" />
                            </div>
                        }

                        {service.video !== undefined &&
                            <video poster={(service.images !== undefined && service.images.length > 0) ? service.images[0] : "../images/services-icon.svg"} className='details__video' playsInline muted loop controls autoPlay>
                                <source src={service.video} type='video/mp4'/>
                            </video>
                        }
                        {/* <CSSTransition
                            in={service.images !== undefined && service.images.length > 0 && canPlayVideo === false}
                            classNames='details-img'
                            timeout={300}
                            unmountOnExit
                            mountOnEnter
                        >
                            <div style={canPlayVideo ? {opacity: 0, position: 'absolute', width: 0} : {opacity: 1, position: 'relative'}} className='details__img'><img src={service.images[0]} alt="details preview" /></div>
                        </CSSTransition>

                        {service.video !== undefined && isDetails === true && 
                            <div style={!canPlayVideo ? {position: 'absolute', width: 0} : {position: 'relative'}} className='details__video'>
                                <video onLoadedMetadata={() => setCanPlayVideo(true)} muted autoPlay loop playsInline controls>
                                    <source style={!canPlayVideo ? {opacity: 0} : {opacity: 1}} src={service.video} type='video/mp4'/>
                                </video>
                            </div>
                        } */}
                        {/* {service.video !== undefined &&
                            <video autoPlay loop muted preload='auto'>
                                <source src={service.video} type='video/mp4'/>
                            </video>
                        } */}
                        <div style={(!(service.images !== undefined && service.images.length > 0)) ? {marginTop: '15px'} : {}} className='details__content'>
                            <h3 className="details__title">{service.name}</h3>
                            <p className='details__descr'>{service.description !== undefined && service.description}</p>
                            <div className='details__bottom'>
                                <p className='details__price'>
                                    {((service.priceMin !== undefined && service.priceMax !== undefined) && (service.priceMin !== 0 && service.priceMax !== 0))
                                    ? (service.priceMax === service.priceMin ? (service.priceMax.toLocaleString() + '₽') : (service.priceMax > service.priceMin ? `${service.priceMin.toLocaleString()} - ${service.priceMax.toLocaleString()}₽` : service.priceMin.toLocaleString() + '₽'))
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