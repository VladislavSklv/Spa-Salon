import React, { useState, useRef, useEffect } from 'react';
import { useGetServicesQuery } from '../api/mainApi';
import ModalNavBar from '../components/ModalNavBar';
import NavBar from '../components/NavBar';
import ServicesList from '../components/ServicesList';
import {disablePageScroll, enablePageScroll} from 'scroll-lock';

interface servicesPageProps {
    companiesId: string;
}

const ServicesPage:React.FC<servicesPageProps> = ({companiesId}) => {
    const {data: servicesCategories, isLoading, isError} = useGetServicesQuery({companiesId});
    const [isOpacity, setIsOpacity] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [activeTab, setActiveTab] = useState(servicesCategories !== undefined ? servicesCategories[0].id : 0);
    const servicesRef = useRef<HTMLDivElement>(null);

    /* Disable scroll */
    useEffect(() => {
        if(isModal) {
            if(window.pageYOffset === 0) window.scrollBy(0, 1);
            disablePageScroll(document.body);
        } else {
            enablePageScroll(document.body);
        }
    }, [isModal]);

    return (
        <>
            {servicesCategories !== undefined && 
                <div ref={servicesRef} className='service'>
                    <NavBar servicesCategories={servicesCategories} mainMenuRef={servicesRef} setIsModal={setIsModal} activeTab={activeTab} setIsOpacity={setIsOpacity}/>
                    <ServicesList setActiveTab={setActiveTab} servicesCategories={servicesCategories}/>
                    <div 
                        onClick={() => {
                            setIsModal(false);
                            setIsOpacity(false);
                        }} 
                        style={isOpacity ? {opacity: 1, pointerEvents: 'all'} : {opacity: 0, pointerEvents: 'none'}} 
                        className='opacity-block'
                    ></div>
                    <ModalNavBar setIsOpacity={setIsOpacity} isModal={isModal} setIsModal={setIsModal} servicesRef={servicesRef} servicesCategories={servicesCategories} />
                </div>
            }
        </>
    );
};

export default ServicesPage;