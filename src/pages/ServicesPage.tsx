import React, { useState, useRef, useEffect } from 'react';
import { useGetServicesQuery, useLazyGetServicesQuery } from '../api/mainApi';
import ModalNavBar from '../components/ModalNavBar';
import NavBar from '../components/NavBar';
import ServicesList from '../components/ServicesList';
import {disablePageScroll, enablePageScroll} from 'scroll-lock';
import ServiceDetails from '../components/ServiceDetails';
import Loader from '../components/Loader';
import ErrorBlock from '../components/ErrorBlock';
import { useAppSelector } from '../hooks/hooks';
import { useSearchParams } from 'react-router-dom';

interface servicesPageProps {
    isServices: boolean;
    setIsServices: React.Dispatch<React.SetStateAction<boolean>>;
    companyId: string;
}

const ServicesPage:React.FC<servicesPageProps> = ({isServices, setIsServices, companyId}) => {
    const {data: servicesCategories, isLoading, isFetching, isError} = useGetServicesQuery({companyId});
    const [isOpacity, setIsOpacity] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [activeTab, setActiveTab] = useState(servicesCategories !== undefined ? servicesCategories[0].id : 0);
    const [isDetails, setIsDetails] = useState(false);
    const [detailsId, setDetailsId] = useState(servicesCategories !== undefined ? servicesCategories[0].id : 0);
    const servicesRef = useRef<HTMLDivElement>(null);
    /* Getting Get param */
    /* const [searchParams, setSearchParams] = useSearchParams();
	const companyId = searchParams.get('companyId');
    if(companyId !== null) servicesTrigger({companyId});
    else console.error('required parameter companyId was not passed'); */

    const { services } = useAppSelector(state => state.mainSlice);

    /* Disable scroll */
    useEffect(() => {
        if(isModal || isDetails) {
            if(window.pageYOffset === 0) window.scrollBy(0, 1);
            disablePageScroll(document.body);
        } else {
            enablePageScroll(document.body);
        }
    }, [isModal, isDetails]);

    /* Setting Telegram */

    window.Telegram.WebApp.MainButton.setParams({color: '#3F3133', text_color: '#ffffff'});
    useEffect(() => {
        if(isServices && !isDetails && services.length > 0) {
            window.Telegram.WebApp.MainButton.setText(`Продолжить ${services.length}`);
            if(services.length === 1) window.Telegram.WebApp.MainButton.enable().show();
        } else if(isServices && !isDetails) {
            window.Telegram.WebApp.MainButton.disable().hide();
        }
    }, [services, isServices, isDetails]);

    return (
        <>
            {
                companyId !== null
                ?
                <>
                    {isError && <ErrorBlock/>}
                    {(isLoading || isFetching) && <Loader/>}
                    {servicesCategories !== undefined && 
                        <div ref={servicesRef} className='service'>
                            <NavBar servicesCategories={servicesCategories} mainMenuRef={servicesRef} setIsModal={setIsModal} activeTab={activeTab} setIsOpacity={setIsOpacity}/>
                            <ServicesList setDetailsId={setDetailsId} setIsOpacity={setIsOpacity} setIsDetails={setIsDetails} setActiveTab={setActiveTab} servicesCategories={servicesCategories}/>
                            <div 
                                onClick={() => {
                                    setIsModal(false);
                                    setIsOpacity(false);
                                    setIsDetails(false);
                                }} 
                                style={isOpacity ? {opacity: 1, pointerEvents: 'all'} : {opacity: 0, pointerEvents: 'none'}} 
                                className='opacity-block'
                            ></div>
                            <ModalNavBar setIsOpacity={setIsOpacity} isModal={isModal} setIsModal={setIsModal} servicesRef={servicesRef} servicesCategories={servicesCategories} />
                            <ServiceDetails setIsServices={setIsServices} isServices={isServices} detailsId={detailsId} isDetails={isDetails} servicesCategories={servicesCategories} setIsDetails={setIsDetails} setIsOpacity={setIsOpacity} />
                        </div>
                    }
                </>
                :
                <div></div>
            }
        </>
    );
};

export default ServicesPage;